-- MyData Integration Tables
-- 마이데이터 OAuth 토큰 저장 테이블

CREATE TABLE IF NOT EXISTS mydata_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_code TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_type TEXT NOT NULL DEFAULT 'Bearer',
  expires_at TIMESTAMPTZ NOT NULL,
  scope TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 한 사용자가 한 기관당 하나의 토큰만 가질 수 있음
  UNIQUE(user_id, organization_code)
);

-- MyData OAuth State 임시 저장 테이블 (PKCE)
CREATE TABLE IF NOT EXISTS mydata_oauth_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  state TEXT NOT NULL UNIQUE,
  code_verifier TEXT NOT NULL,
  organization_code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- accounts 테이블에 MyData 관련 컬럼 추가
ALTER TABLE accounts
  ADD COLUMN IF NOT EXISTS organization_code TEXT,
  ADD COLUMN IF NOT EXISTS is_mydata_connected BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ;

-- transactions 테이블에 MyData 관련 컬럼 추가
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS transaction_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS transaction_time TEXT,
  ADD COLUMN IF NOT EXISTS transaction_type TEXT,
  ADD COLUMN IF NOT EXISTS balance_after NUMERIC,
  ADD COLUMN IF NOT EXISTS counterparty_name TEXT;

-- MyData 대출 정보 테이블
CREATE TABLE IF NOT EXISTS mydata_loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_code TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  loan_num TEXT NOT NULL,
  loan_type TEXT NOT NULL,
  loan_balance NUMERIC NOT NULL,
  interest_rate NUMERIC NOT NULL,
  monthly_payment NUMERIC NOT NULL,
  maturity_date DATE NOT NULL,
  loan_start_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, organization_code, loan_num)
);

-- MyData 카드 정보 테이블
CREATE TABLE IF NOT EXISTS mydata_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_code TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  card_num TEXT NOT NULL,
  card_type TEXT NOT NULL CHECK (card_type IN ('credit', 'check', 'debit')),
  card_name TEXT NOT NULL,
  is_domestic BOOLEAN DEFAULT TRUE,
  annual_fee NUMERIC DEFAULT 0,
  payment_date INTEGER,
  card_status TEXT DEFAULT 'active' CHECK (card_status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, organization_code, card_num)
);

-- MyData 카드 거래 내역 테이블
CREATE TABLE IF NOT EXISTS mydata_card_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID REFERENCES mydata_cards(id) ON DELETE CASCADE,
  transaction_id TEXT NOT NULL UNIQUE,
  approved_date DATE NOT NULL,
  approved_time TEXT NOT NULL,
  approved_num TEXT NOT NULL,
  merchant_name TEXT NOT NULL,
  approved_amount NUMERIC NOT NULL,
  installment_month INTEGER DEFAULT 0,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('domestic', 'overseas')),
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MyData 보험 정보 테이블
CREATE TABLE IF NOT EXISTS mydata_insurance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_code TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  contract_num TEXT NOT NULL,
  insurance_type TEXT NOT NULL,
  contract_date DATE NOT NULL,
  maturity_date DATE NOT NULL,
  insured_amount NUMERIC NOT NULL,
  monthly_premium NUMERIC NOT NULL,
  contract_status TEXT DEFAULT 'active' CHECK (contract_status IN ('active', 'terminated', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, organization_code, contract_num)
);

-- MyData 투자 정보 테이블
CREATE TABLE IF NOT EXISTS mydata_investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_code TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  account_num TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('stock', 'fund', 'etf', 'bond')),
  evaluation_amount NUMERIC NOT NULL,
  investment_principal NUMERIC NOT NULL,
  profit_loss NUMERIC NOT NULL,
  profit_loss_rate NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, organization_code, account_num)
);

-- MyData 연금 정보 테이블
CREATE TABLE IF NOT EXISTS mydata_pensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_code TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  pension_type TEXT NOT NULL CHECK (pension_type IN ('national', 'corporate', 'personal')),
  account_num TEXT NOT NULL,
  accumulated_amount NUMERIC NOT NULL,
  monthly_contribution NUMERIC NOT NULL,
  expected_pension NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, organization_code, account_num)
);

-- Row Level Security (RLS) 정책 활성화
ALTER TABLE mydata_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE mydata_oauth_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE mydata_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE mydata_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE mydata_card_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mydata_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE mydata_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE mydata_pensions ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 사용자는 자신의 데이터만 조회/수정/삭제 가능
CREATE POLICY "Users can view own mydata_tokens"
  ON mydata_tokens FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mydata_tokens"
  ON mydata_tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mydata_tokens"
  ON mydata_tokens FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mydata_tokens"
  ON mydata_tokens FOR DELETE
  USING (auth.uid() = user_id);

-- OAuth States 정책
CREATE POLICY "Users can view own oauth_states"
  ON mydata_oauth_states FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own oauth_states"
  ON mydata_oauth_states FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own oauth_states"
  ON mydata_oauth_states FOR DELETE
  USING (auth.uid() = user_id);

-- Loans 정책
CREATE POLICY "Users can view own loans"
  ON mydata_loans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own loans"
  ON mydata_loans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own loans"
  ON mydata_loans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own loans"
  ON mydata_loans FOR DELETE
  USING (auth.uid() = user_id);

-- Cards 정책
CREATE POLICY "Users can view own cards"
  ON mydata_cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cards"
  ON mydata_cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cards"
  ON mydata_cards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cards"
  ON mydata_cards FOR DELETE
  USING (auth.uid() = user_id);

-- Card Transactions 정책
CREATE POLICY "Users can view own card_transactions"
  ON mydata_card_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own card_transactions"
  ON mydata_card_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own card_transactions"
  ON mydata_card_transactions FOR DELETE
  USING (auth.uid() = user_id);

-- Insurance 정책
CREATE POLICY "Users can view own insurance"
  ON mydata_insurance FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insurance"
  ON mydata_insurance FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insurance"
  ON mydata_insurance FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own insurance"
  ON mydata_insurance FOR DELETE
  USING (auth.uid() = user_id);

-- Investments 정책
CREATE POLICY "Users can view own investments"
  ON mydata_investments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investments"
  ON mydata_investments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own investments"
  ON mydata_investments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own investments"
  ON mydata_investments FOR DELETE
  USING (auth.uid() = user_id);

-- Pensions 정책
CREATE POLICY "Users can view own pensions"
  ON mydata_pensions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pensions"
  ON mydata_pensions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pensions"
  ON mydata_pensions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pensions"
  ON mydata_pensions FOR DELETE
  USING (auth.uid() = user_id);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_mydata_tokens_user_org ON mydata_tokens(user_id, organization_code);
CREATE INDEX idx_mydata_oauth_states_user ON mydata_oauth_states(user_id);
CREATE INDEX idx_mydata_oauth_states_state ON mydata_oauth_states(state);
CREATE INDEX idx_mydata_oauth_states_expires ON mydata_oauth_states(expires_at);
CREATE INDEX idx_mydata_loans_user ON mydata_loans(user_id);
CREATE INDEX idx_mydata_cards_user ON mydata_cards(user_id);
CREATE INDEX idx_mydata_card_transactions_user ON mydata_card_transactions(user_id);
CREATE INDEX idx_mydata_card_transactions_card ON mydata_card_transactions(card_id);
CREATE INDEX idx_mydata_insurance_user ON mydata_insurance(user_id);
CREATE INDEX idx_mydata_investments_user ON mydata_investments(user_id);
CREATE INDEX idx_mydata_pensions_user ON mydata_pensions(user_id);

-- 만료된 OAuth State 자동 삭제 함수
CREATE OR REPLACE FUNCTION delete_expired_oauth_states()
RETURNS void AS $$
BEGIN
  DELETE FROM mydata_oauth_states WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 주기적으로 만료된 OAuth State 삭제 (pg_cron 사용 시)
-- SELECT cron.schedule('delete-expired-oauth-states', '*/10 * * * *', 'SELECT delete_expired_oauth_states()');

COMMENT ON TABLE mydata_tokens IS 'MyData OAuth 액세스 토큰 및 리프레시 토큰 저장';
COMMENT ON TABLE mydata_oauth_states IS 'MyData OAuth PKCE State 임시 저장 (10분 후 만료)';
COMMENT ON TABLE mydata_loans IS 'MyData 대출 정보';
COMMENT ON TABLE mydata_cards IS 'MyData 카드 정보';
COMMENT ON TABLE mydata_card_transactions IS 'MyData 카드 거래 내역';
COMMENT ON TABLE mydata_insurance IS 'MyData 보험 정보';
COMMENT ON TABLE mydata_investments IS 'MyData 투자 정보';
COMMENT ON TABLE mydata_pensions IS 'MyData 연금 정보';
