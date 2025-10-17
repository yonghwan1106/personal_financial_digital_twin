/**
 * 데모 계정용 시드 데이터 생성 스크립트
 *
 * 사용법:
 * SUPABASE_SERVICE_ROLE_KEY=your_service_role_key npm run seed-demo
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('환경 변수가 설정되지 않았습니다.');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// 데모 계정 정보
const DEMO_EMAIL = 'demo@financial-twin.kr';
const DEMO_PASSWORD = 'demo1234!@#$';
const DEMO_NAME = '김데모';

async function main() {
  console.log('🚀 데모 계정 시드 데이터 생성 시작...\n');

  try {
    // 1. 데모 계정 생성
    console.log('1️⃣ 데모 계정 생성 중...');

    // 기존 데모 계정 확인
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(u => u.email === DEMO_EMAIL);

    let userId: string;

    if (existingUser) {
      console.log('   ✓ 기존 데모 계정 발견:', existingUser.id);
      userId = existingUser.id;

      // 기존 데이터 삭제
      console.log('   ✓ 기존 데이터 삭제 중...');
      await supabase.from('simulations').delete().eq('user_id', userId);
      await supabase.from('financial_goals').delete().eq('user_id', userId);
      await supabase.from('transactions').delete().eq('user_id', userId);
      await supabase.from('financial_accounts').delete().eq('user_id', userId);
      console.log('   ✓ 기존 데이터 삭제 완료');
    } else {
      const { data: newUser, error: signUpError } = await supabase.auth.admin.createUser({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: {
          name: DEMO_NAME
        }
      });

      if (signUpError) {
        throw new Error(`계정 생성 실패: ${signUpError.message}`);
      }

      userId = newUser.user.id;
      console.log('   ✓ 데모 계정 생성 완료:', userId);
    }

    // 2. 프로필 생성/업데이트
    console.log('\n2️⃣ 프로필 생성 중...');
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: DEMO_EMAIL,
        name: DEMO_NAME,
        age: 32,
        occupation: 'IT 개발자'
      });

    if (profileError) throw profileError;
    console.log('   ✓ 프로필 생성 완료');

    // 3. 금융 계좌 생성
    console.log('\n3️⃣ 금융 계좌 생성 중...');
    const accounts = [
      {
        user_id: userId,
        account_type: 'bank',
        institution_name: '국민은행',
        account_number: '123-45-678901',
        balance: 15000000,
        currency: 'KRW'
      },
      {
        user_id: userId,
        account_type: 'bank',
        institution_name: '카카오뱅크',
        account_number: '3333-01-1234567',
        balance: 3500000,
        currency: 'KRW'
      },
      {
        user_id: userId,
        account_type: 'investment',
        institution_name: '삼성증권',
        account_number: '8888-9999-0000',
        balance: 25000000,
        currency: 'KRW'
      },
      {
        user_id: userId,
        account_type: 'card',
        institution_name: '신한카드',
        account_number: '1234-5678-****-1234',
        balance: -850000, // 사용액
        currency: 'KRW'
      },
      {
        user_id: userId,
        account_type: 'loan',
        institution_name: '우리은행',
        account_number: 'LOAN-2023-1234',
        balance: -120000000, // 대출금 (마이너스)
        currency: 'KRW',
        metadata: {
          loan_type: '주택담보대출',
          interest_rate: 3.5,
          monthly_payment: 600000,
          remaining_months: 240
        }
      }
    ];

    const { data: createdAccounts, error: accountsError } = await supabase
      .from('financial_accounts')
      .insert(accounts)
      .select();

    if (accountsError) throw accountsError;
    console.log(`   ✓ ${createdAccounts?.length}개의 계좌 생성 완료`);

    // 4. 거래 내역 생성 (최근 3개월)
    console.log('\n4️⃣ 거래 내역 생성 중...');
    const transactions = [];
    const bankAccount = createdAccounts?.find(a => a.account_type === 'bank' && a.institution_name === '국민은행');
    const cardAccount = createdAccounts?.find(a => a.account_type === 'card');

    if (bankAccount) {
      // 급여 (매월 25일)
      for (let i = 0; i < 3; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        date.setDate(25);

        transactions.push({
          user_id: userId,
          account_id: bankAccount.id,
          transaction_date: date.toISOString(),
          amount: 4500000,
          category: '급여',
          description: '월급',
          merchant_name: '주식회사 테크놀로지'
        });
      }

      // 고정 지출
      const fixedExpenses = [
        { category: '주거', description: '월세', amount: -800000, day: 1 },
        { category: '보험', description: '보험료', amount: -250000, day: 5 },
        { category: '통신', description: '통신비', amount: -65000, day: 10 },
        { category: '구독', description: '넷플릭스', amount: -17000, day: 15 },
        { category: '구독', description: '유튜브 프리미엄', amount: -14900, day: 15 }
      ];

      for (let i = 0; i < 3; i++) {
        for (const expense of fixedExpenses) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          date.setDate(expense.day);

          transactions.push({
            user_id: userId,
            account_id: bankAccount.id,
            transaction_date: date.toISOString(),
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            merchant_name: expense.description
          });
        }
      }
    }

    if (cardAccount) {
      // 변동 지출 (카드)
      const variableExpenses = [
        { category: '식비', description: '스타벅스', amount: -5500, count: 20 },
        { category: '식비', description: '점심 식사', amount: -12000, count: 15 },
        { category: '쇼핑', description: '온라인 쇼핑', amount: -45000, count: 5 },
        { category: '교통', description: '택시', amount: -15000, count: 10 },
        { category: '여가', description: '영화관', amount: -15000, count: 3 }
      ];

      for (let i = 0; i < 3; i++) {
        for (const expense of variableExpenses) {
          for (let j = 0; j < expense.count; j++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            date.setDate(Math.floor(Math.random() * 28) + 1);
            date.setHours(Math.floor(Math.random() * 12) + 9);

            transactions.push({
              user_id: userId,
              account_id: cardAccount.id,
              transaction_date: date.toISOString(),
              amount: expense.amount * (0.9 + Math.random() * 0.2), // ±10% 변동
              category: expense.category,
              description: expense.description,
              merchant_name: expense.description
            });
          }
        }
      }
    }

    const { error: transactionsError } = await supabase
      .from('transactions')
      .insert(transactions);

    if (transactionsError) throw transactionsError;
    console.log(`   ✓ ${transactions.length}개의 거래 내역 생성 완료`);

    // 5. 재무 목표 생성
    console.log('\n5️⃣ 재무 목표 생성 중...');
    const goals = [
      {
        user_id: userId,
        goal_type: 'savings',
        title: '비상금 마련',
        description: '6개월치 생활비 확보',
        target_amount: 20000000,
        current_amount: 12000000,
        target_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'high',
        status: 'active'
      },
      {
        user_id: userId,
        goal_type: 'investment',
        title: '노후 준비',
        description: '퇴직 후 생활비 마련',
        target_amount: 500000000,
        current_amount: 25000000,
        target_date: new Date(Date.now() + 30 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'medium',
        status: 'active'
      },
      {
        user_id: userId,
        goal_type: 'savings',
        title: '해외여행 자금',
        description: '유럽 여행 경비',
        target_amount: 5000000,
        current_amount: 2500000,
        target_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'low',
        status: 'active'
      },
      {
        user_id: userId,
        goal_type: 'debt',
        title: '주택담보대출 상환',
        description: '대출 조기 상환',
        target_amount: 120000000,
        current_amount: 0,
        target_date: new Date(Date.now() + 15 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'high',
        status: 'active'
      }
    ];

    const { error: goalsError } = await supabase
      .from('financial_goals')
      .insert(goals);

    if (goalsError) throw goalsError;
    console.log(`   ✓ ${goals.length}개의 재무 목표 생성 완료`);

    // 6. 시뮬레이션 데이터 생성
    console.log('\n6️⃣ 시뮬레이션 데이터 생성 중...');
    const simulations = [
      {
        user_id: userId,
        title: '은퇴 후 생활 시뮬레이션',
        description: '현재 저축률 유지 시 은퇴 후 생활비 분석',
        scenario_type: 'retirement',
        simulation_period_years: 30,
        assumptions: {
          monthly_savings: 1000000,
          expected_return: 0.05,
          inflation_rate: 0.02,
          retirement_age: 60
        },
        events: [
          {
            year: 5,
            type: 'expense',
            description: '자녀 대학 등록금',
            amount: -50000000
          },
          {
            year: 10,
            type: 'income',
            description: '승진으로 인한 급여 인상',
            amount: 1000000
          }
        ],
        results: {
          final_amount: 458000000,
          monthly_pension: 1900000,
          success_probability: 0.85
        }
      },
      {
        user_id: userId,
        title: '주택 구매 시뮬레이션',
        description: '5년 후 주택 구매 가능성 분석',
        scenario_type: 'home_purchase',
        simulation_period_years: 5,
        assumptions: {
          target_home_price: 600000000,
          down_payment_ratio: 0.3,
          monthly_savings: 2000000,
          expected_return: 0.03
        },
        events: [],
        results: {
          total_savings: 125000000,
          shortfall: 55000000,
          success_probability: 0.65
        }
      }
    ];

    const { error: simulationsError } = await supabase
      .from('simulations')
      .insert(simulations);

    if (simulationsError) throw simulationsError;
    console.log(`   ✓ ${simulations.length}개의 시뮬레이션 생성 완료`);

    console.log('\n✅ 데모 계정 시드 데이터 생성 완료!\n');
    console.log('📧 이메일:', DEMO_EMAIL);
    console.log('🔑 비밀번호:', DEMO_PASSWORD);
    console.log('');

  } catch (error) {
    console.error('\n❌ 오류 발생:', error);
    process.exit(1);
  }
}

main();
