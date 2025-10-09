/**
 * MyData API Integration Types
 * 금융위원회 MyData API 가이드라인 준수
 */

export interface MyDataConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
}

export interface MyDataAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface MyDataAccount {
  organization_code: string; // 기관 코드
  organization_name: string; // 기관명
  account_num: string; // 계좌번호 (마스킹)
  account_type: 'deposit' | 'savings' | 'checking' | 'card'; // 계좌 유형
  balance: number; // 잔액
  currency: string; // 통화 (KRW)
  account_name: string; // 계좌명
  is_consent: boolean; // 동의 여부
}

export interface MyDataTransaction {
  transaction_id: string;
  transaction_date: string; // ISO 8601 format
  transaction_time: string;
  transaction_type: 'deposit' | 'withdrawal' | 'transfer'; // 거래 유형
  amount: number;
  balance_after: number;
  description: string;
  counterparty_name?: string; // 거래 상대방
  category?: string; // 카테고리
}

export interface MyDataLoan {
  organization_code: string;
  organization_name: string;
  loan_num: string;
  loan_type: string; // 대출 유형
  loan_balance: number; // 대출 잔액
  interest_rate: number; // 금리 (%)
  monthly_payment: number; // 월 상환액
  maturity_date: string; // 만기일
  loan_start_date: string; // 대출 시작일
}

export interface MyDataCard {
  organization_code: string;
  organization_name: string;
  card_num: string; // 카드번호 (마스킹)
  card_type: 'credit' | 'check' | 'debit';
  card_name: string;
  is_domestic: boolean;
  annual_fee: number;
  payment_date: number; // 결제일
  card_status: 'active' | 'inactive' | 'suspended';
}

export interface MyDataCardTransaction {
  transaction_id: string;
  approved_date: string;
  approved_time: string;
  approved_num: string;
  merchant_name: string; // 가맹점명
  approved_amount: number;
  installment_month: number; // 할부 개월수
  transaction_type: 'domestic' | 'overseas';
  category?: string;
}

export interface MyDataInsurance {
  organization_code: string;
  organization_name: string;
  contract_num: string;
  insurance_type: string;
  contract_date: string;
  maturity_date: string;
  insured_amount: number; // 보험 가입 금액
  monthly_premium: number; // 월 보험료
  contract_status: 'active' | 'terminated' | 'expired';
}

export interface MyDataInvestment {
  organization_code: string;
  organization_name: string;
  account_num: string;
  account_type: 'stock' | 'fund' | 'etf' | 'bond';
  evaluation_amount: number; // 평가 금액
  investment_principal: number; // 투자 원금
  profit_loss: number; // 손익
  profit_loss_rate: number; // 수익률 (%)
}

export interface MyDataPension {
  organization_code: string;
  organization_name: string;
  pension_type: 'national' | 'corporate' | 'personal'; // 국민연금, 퇴직연금, 개인연금
  account_num: string;
  accumulated_amount: number; // 적립 금액
  monthly_contribution: number; // 월 납입액
  expected_pension: number; // 예상 연금 수령액
}

// API Response Wrappers
export interface MyDataResponse<T> {
  data: T;
  result_code: string;
  result_message: string;
  transaction_id: string;
  timestamp: string;
}

export interface MyDataErrorResponse {
  error_code: string;
  error_message: string;
  transaction_id: string;
  timestamp: string;
}

// 통합 MyData 프로필
export interface MyDataProfile {
  user_id: string;
  accounts: MyDataAccount[];
  transactions: MyDataTransaction[];
  loans: MyDataLoan[];
  cards: MyDataCard[];
  card_transactions: MyDataCardTransaction[];
  insurance: MyDataInsurance[];
  investments: MyDataInvestment[];
  pensions: MyDataPension[];
  last_sync: string;
}

// OAuth State 관리
export interface MyDataOAuthState {
  state: string;
  code_verifier: string; // PKCE
  organization_code: string;
  created_at: number;
}

// 기관 정보
export interface FinancialOrganization {
  code: string;
  name: string;
  type: 'bank' | 'card' | 'insurance' | 'investment' | 'loan';
  logo_url?: string;
  api_base_url: string;
  supports_mydata: boolean;
}
