// 사용자 프로필
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  age?: number;
  occupation?: string;
  created_at: string;
  updated_at: string;
}

// 금융 계정
export interface FinancialAccount {
  id: string;
  user_id: string;
  account_type: 'bank' | 'card' | 'loan' | 'investment' | 'insurance';
  institution_name: string;
  account_number: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

// 은행 계좌
export interface BankAccount extends FinancialAccount {
  account_type: 'bank';
  account_name: string;
  interest_rate?: number;
}

// 대출
export interface Loan extends FinancialAccount {
  account_type: 'loan';
  loan_type: 'student' | 'mortgage' | 'personal' | 'card';
  principal_amount: number;
  remaining_balance: number;
  interest_rate: number;
  monthly_payment: number;
  start_date: string;
  end_date: string;
}

// 거래 내역
export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  transaction_date: string;
  amount: number;
  category: TransactionCategory;
  description: string;
  merchant_name?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  created_at: string;
}

export type TransactionCategory =
  | 'income'
  | 'food'
  | 'transport'
  | 'shopping'
  | 'bills'
  | 'healthcare'
  | 'entertainment'
  | 'education'
  | 'savings'
  | 'other';

// 재무 목표
export interface FinancialGoal {
  id: string;
  user_id: string;
  goal_type: 'house' | 'car' | 'education' | 'retirement' | 'emergency' | 'custom';
  title: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

// 시뮬레이션 시나리오
export interface Simulation {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  scenario_type: 'life_event' | 'what_if' | 'goal_planning';
  simulation_period_years: number;
  assumptions: SimulationAssumptions;
  events: SimulationEvent[];
  results?: SimulationResult;
  created_at: string;
  updated_at: string;
}

export interface SimulationAssumptions {
  inflation_rate: number;
  income_growth_rate: number;
  investment_return_rate: number;
  emergency_fund_months: number;
}

export interface SimulationEvent {
  id: string;
  event_type: 'marriage' | 'childbirth' | 'house_purchase' | 'job_loss' | 'career_change' | 'custom';
  title: string;
  year_offset: number; // 시뮬레이션 시작 후 몇 년 뒤
  financial_impact: {
    one_time_cost?: number;
    monthly_income_change?: number;
    monthly_expense_change?: number;
    loan_amount?: number;
    loan_interest_rate?: number;
    loan_term_years?: number;
  };
}

export interface SimulationResult {
  monthly_projections: MonthlyProjection[];
  yearly_summary: YearlySummary[];
  risk_alerts: RiskAlert[];
  recommendations: Recommendation[];
}

export interface MonthlyProjection {
  month: number; // 0부터 시작
  year: number;
  income: number;
  expenses: number;
  net_cash_flow: number;
  total_assets: number;
  total_liabilities: number;
  net_worth: number;
  savings_rate: number;
}

export interface YearlySummary {
  year: number;
  total_income: number;
  total_expenses: number;
  net_savings: number;
  end_net_worth: number;
  dsr: number; // 총부채원리금상환비율
}

export interface RiskAlert {
  type: 'liquidity' | 'debt' | 'investment' | 'goal';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  occurs_at: string; // 'YYYY-MM' 형식
}

export interface Recommendation {
  type: 'savings' | 'debt_repayment' | 'investment' | 'insurance' | 'product';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimated_impact: string;
  related_products?: FinancialProduct[];
}

// 서민금융진흥원 금융 상품
export interface FinancialProduct {
  id: string;
  product_type: 'loan' | 'savings' | 'insurance' | 'credit_management';
  name: string;
  institution: string;
  description: string;
  interest_rate?: string;
  max_amount?: number;
  eligibility_criteria: string[];
  application_url?: string;
}

// 대시보드 통계
export interface DashboardStats {
  net_worth: number;
  monthly_income: number;
  monthly_expenses: number;
  savings_rate: number;
  dsr: number;
  credit_score?: number;
  total_assets: number;
  total_liabilities: number;
}
