import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { calculateFinancialHealthScore, FinancialData } from '@/lib/financial-health/score';

/**
 * Financial Health Score API
 * GET /api/financial-health
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

    // 사용자 기본 정보
    const { data: userData } = await supabase
      .from('users')
      .select('monthly_income, monthly_expenses, age, created_at')
      .eq('id', user.id)
      .single();

    const monthlyIncome = userData?.monthly_income || 0;
    const monthlyExpenses = userData?.monthly_expenses || 0;
    const age = userData?.age || 30;

    // 계좌 정보 (자산)
    const { data: accounts } = await supabase
      .from('accounts')
      .select('balance, account_type')
      .eq('user_id', user.id);

    const totalAssets = accounts?.reduce((sum, acc) => sum + (acc.balance || 0), 0) || 0;

    // 유동 자산 (은행 계좌)
    const liquidAssets = accounts
      ?.filter((acc) => acc.account_type === 'bank' || acc.account_type === 'deposit')
      .reduce((sum, acc) => sum + (acc.balance || 0), 0) || 0;

    // 투자 자산
    const investmentAssets = totalAssets - liquidAssets;

    // 대출 정보 (부채)
    const { data: loans } = await supabase
      .from('mydata_loans')
      .select('loan_balance, monthly_payment')
      .eq('user_id', user.id);

    const totalLiabilities = loans?.reduce((sum, loan) => sum + (loan.loan_balance || 0), 0) || 0;
    const monthlyDebtPayment = loans?.reduce((sum, loan) => sum + (loan.monthly_payment || 0), 0) || 0;

    // 단기/장기 부채 구분 (간단한 휴리스틱: 금액 기준)
    const shortTermDebt = totalLiabilities * 0.3; // 30%를 단기로 가정
    const longTermDebt = totalLiabilities * 0.7;

    // 비상 자금 계산
    const emergencyFundAmount = liquidAssets * 0.5; // 유동 자산의 50%를 비상 자금으로 가정
    const monthsOfEmergencyFund = monthlyExpenses > 0 ? emergencyFundAmount / monthlyExpenses : 0;
    const hasEmergencyFund = monthsOfEmergencyFund >= 3;

    // 재무 데이터 구성
    const financialData: FinancialData = {
      totalAssets,
      liquidAssets,
      investmentAssets,
      totalLiabilities,
      shortTermDebt,
      longTermDebt,
      monthlyIncome,
      monthlyExpenses,
      monthlyDebtPayment,
      age,
      hasEmergencyFund,
      monthsOfEmergencyFund,
    };

    // 재무 건강 점수 계산
    const healthScore = calculateFinancialHealthScore(financialData);

    // 점수 이력 저장
    await supabase.from('financial_health_scores').insert({
      user_id: user.id,
      score: healthScore.totalScore,
      grade: healthScore.grade,
      components: healthScore.components,
      insights: healthScore.insights,
      recommendations: healthScore.recommendations,
      calculated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      healthScore,
      financialData: {
        totalAssets,
        totalLiabilities,
        netWorth: totalAssets - totalLiabilities,
        monthlyIncome,
        monthlyExpenses,
        savingsRate: monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0,
      },
    });
  } catch (error) {
    console.error('Financial health score calculation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to calculate financial health score',
      },
      { status: 500 }
    );
  }
}

/**
 * 재무 건강 점수 이력 조회
 * GET /api/financial-health/history
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // 최근 12개월 점수 이력
    const { data: history } = await supabase
      .from('financial_health_scores')
      .select('*')
      .eq('user_id', user.id)
      .order('calculated_at', { ascending: false })
      .limit(12);

    return NextResponse.json({
      success: true,
      history: history || [],
    });
  } catch (error) {
    console.error('Financial health history fetch error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch health score history',
      },
      { status: 500 }
    );
  }
}
