import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { calculateDSR, simulateDSRImprovement, DSRData } from '@/lib/risk/dsr-detector';

/**
 * DSR (Debt Service Ratio) 계산 및 위험 감지
 * GET /api/risk/dsr
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // 사용자 소득 정보
    const { data: userData } = await supabase
      .from('users')
      .select('monthly_income, monthly_expenses')
      .eq('id', user.id)
      .single();

    const monthlyIncome = userData?.monthly_income || 0;
    const monthlyExpenses = userData?.monthly_expenses || 0;
    const annualIncome = monthlyIncome * 12;

    // 대출 정보 조회
    const { data: loans } = await supabase
      .from('mydata_loans')
      .select('*')
      .eq('user_id', user.id);

    if (!loans || loans.length === 0) {
      return NextResponse.json({
        success: true,
        message: '대출 정보가 없습니다.',
        dsr: {
          dsr: 0,
          dti: 0,
          riskLevel: 'safe',
          riskScore: 0,
          alerts: [{
            severity: 'info',
            title: '부채 없음',
            message: '현재 등록된 대출이 없습니다.',
            actionRequired: false,
          }],
          recommendations: ['부채가 없는 건전한 재무 상태를 유지하고 있습니다.'],
          projection: {
            monthsUntilDebtFree: 0,
            totalInterestToPay: 0,
            potentialSavings: 0,
          },
        },
      });
    }

    // 대출 데이터 변환
    const loanDetails = loans.map((loan) => {
      const remainingMonths = loan.maturity_date
        ? Math.ceil(
            (new Date(loan.maturity_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)
          )
        : 120; // 기본 10년

      return {
        loanType: loan.loan_type,
        balance: loan.loan_balance,
        interestRate: loan.interest_rate,
        monthlyPayment: loan.monthly_payment,
        remainingMonths,
      };
    });

    const monthlyDebtPayment = loanDetails.reduce((sum, loan) => sum + loan.monthlyPayment, 0);

    // 월 이자 및 원금 계산
    let monthlyInterest = 0;
    let monthlyPrincipal = 0;

    loanDetails.forEach((loan) => {
      const interest = (loan.balance * loan.interestRate / 100) / 12;
      monthlyInterest += interest;
      monthlyPrincipal += loan.monthlyPayment - interest;
    });

    // 기타 고정 지출 (보험료 등)
    const { data: insurance } = await supabase
      .from('mydata_insurance')
      .select('monthly_premium')
      .eq('user_id', user.id);

    const otherMonthlyObligations = insurance
      ? insurance.reduce((sum, ins) => sum + ins.monthly_premium, 0)
      : 0;

    // DSR 데이터 구성
    const dsrData: DSRData = {
      monthlyIncome,
      annualIncome,
      monthlyDebtPayment,
      monthlyPrincipal,
      monthlyInterest,
      loans: loanDetails,
      otherMonthlyObligations,
    };

    // DSR 계산
    const dsrResult = calculateDSR(dsrData);

    // 결과 저장
    await supabase.from('dsr_assessments').insert({
      user_id: user.id,
      dsr: dsrResult.dsr,
      dti: dsrResult.dti,
      risk_level: dsrResult.riskLevel,
      risk_score: dsrResult.riskScore,
      monthly_debt_payment: monthlyDebtPayment,
      monthly_income: monthlyIncome,
      total_debt: loanDetails.reduce((sum, loan) => sum + loan.balance, 0),
      assessed_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      dsr: dsrResult,
      summary: {
        monthlyIncome,
        monthlyDebtPayment,
        monthlyInterest,
        monthlyPrincipal,
        totalDebt: loanDetails.reduce((sum, loan) => sum + loan.balance, 0),
        numberOfLoans: loanDetails.length,
      },
    });
  } catch (error) {
    console.error('DSR calculation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to calculate DSR',
      },
      { status: 500 }
    );
  }
}

/**
 * DSR 개선 시뮬레이션
 * POST /api/risk/dsr/simulate
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { increaseIncome, reduceExpenses, refinanceRate, extraPayment } = body;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // 현재 DSR 데이터 조회 (GET 로직과 동일)
    const { data: userData } = await supabase
      .from('users')
      .select('monthly_income, monthly_expenses')
      .eq('id', user.id)
      .single();

    const monthlyIncome = userData?.monthly_income || 0;
    const annualIncome = monthlyIncome * 12;

    const { data: loans } = await supabase
      .from('mydata_loans')
      .select('*')
      .eq('user_id', user.id);

    if (!loans || loans.length === 0) {
      return NextResponse.json({
        success: false,
        error: '대출 정보가 없어 시뮬레이션을 수행할 수 없습니다.',
      });
    }

    const loanDetails = loans.map((loan) => {
      const remainingMonths = loan.maturity_date
        ? Math.ceil(
            (new Date(loan.maturity_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)
          )
        : 120;

      return {
        loanType: loan.loan_type,
        balance: loan.loan_balance,
        interestRate: loan.interest_rate,
        monthlyPayment: loan.monthly_payment,
        remainingMonths,
      };
    });

    const monthlyDebtPayment = loanDetails.reduce((sum, loan) => sum + loan.monthlyPayment, 0);

    let monthlyInterest = 0;
    let monthlyPrincipal = 0;

    loanDetails.forEach((loan) => {
      const interest = (loan.balance * loan.interestRate / 100) / 12;
      monthlyInterest += interest;
      monthlyPrincipal += loan.monthlyPayment - interest;
    });

    const { data: insurance } = await supabase
      .from('mydata_insurance')
      .select('monthly_premium')
      .eq('user_id', user.id);

    const otherMonthlyObligations = insurance
      ? insurance.reduce((sum, ins) => sum + ins.monthly_premium, 0)
      : 0;

    const currentData: DSRData = {
      monthlyIncome,
      annualIncome,
      monthlyDebtPayment,
      monthlyPrincipal,
      monthlyInterest,
      loans: loanDetails,
      otherMonthlyObligations,
    };

    // 시뮬레이션 실행
    const simulation = simulateDSRImprovement(currentData, {
      increaseIncome,
      reduceExpenses,
      refinanceRate,
      extraPayment,
    });

    return NextResponse.json({
      success: true,
      simulation,
      scenarios: {
        increaseIncome,
        reduceExpenses,
        refinanceRate,
        extraPayment,
      },
    });
  } catch (error) {
    console.error('DSR simulation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to simulate DSR improvement',
      },
      { status: 500 }
    );
  }
}
