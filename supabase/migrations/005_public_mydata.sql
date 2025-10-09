-- Public MyData (행정안전부 공공 마이데이터) Tables
-- 세금, 고용보험, 주소 정보 저장

-- 세금 정보 테이블 (국세청 연동)
CREATE TABLE IF NOT EXISTS public_mydata_tax (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  total_income NUMERIC NOT NULL DEFAULT 0,
  taxable_income NUMERIC NOT NULL DEFAULT 0,
  income_tax NUMERIC NOT NULL DEFAULT 0,
  local_income_tax NUMERIC NOT NULL DEFAULT 0,
  total_tax NUMERIC NOT NULL DEFAULT 0,
  deductions JSONB, -- 공제 내역
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, year)
);

-- 고용보험 정보 테이블
CREATE TABLE IF NOT EXISTS public_mydata_employment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insured_id TEXT NOT NULL,
  employer_name TEXT NOT NULL,
  employment_start_date DATE NOT NULL,
  employment_type TEXT NOT NULL CHECK (employment_type IN ('permanent', 'temporary', 'daily')),
  monthly_wage NUMERIC NOT NULL DEFAULT 0,
  insured_period_months INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

-- 주소 정보 테이블 (주민등록 연동)
CREATE TABLE IF NOT EXISTS public_mydata_residence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  address_type TEXT NOT NULL CHECK (address_type IN ('owned', 'rented', 'charter')),
  move_in_date DATE NOT NULL,
  monthly_rent NUMERIC, -- 월세
  charter_deposit NUMERIC, -- 전세금
  property_value NUMERIC, -- 부동산 가격 (소유 시)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

-- Row Level Security (RLS) 활성화
ALTER TABLE public_mydata_tax ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_mydata_employment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_mydata_residence ENABLE ROW LEVEL SECURITY;

-- RLS 정책: Tax
CREATE POLICY "Users can view own tax data"
  ON public_mydata_tax FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tax data"
  ON public_mydata_tax FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tax data"
  ON public_mydata_tax FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tax data"
  ON public_mydata_tax FOR DELETE
  USING (auth.uid() = user_id);

-- RLS 정책: Employment
CREATE POLICY "Users can view own employment data"
  ON public_mydata_employment FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own employment data"
  ON public_mydata_employment FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own employment data"
  ON public_mydata_employment FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own employment data"
  ON public_mydata_employment FOR DELETE
  USING (auth.uid() = user_id);

-- RLS 정책: Residence
CREATE POLICY "Users can view own residence data"
  ON public_mydata_residence FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own residence data"
  ON public_mydata_residence FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own residence data"
  ON public_mydata_residence FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own residence data"
  ON public_mydata_residence FOR DELETE
  USING (auth.uid() = user_id);

-- 인덱스 생성
CREATE INDEX idx_public_mydata_tax_user ON public_mydata_tax(user_id);
CREATE INDEX idx_public_mydata_tax_year ON public_mydata_tax(year DESC);
CREATE INDEX idx_public_mydata_employment_user ON public_mydata_employment(user_id);
CREATE INDEX idx_public_mydata_residence_user ON public_mydata_residence(user_id);

-- 통합 공공 마이데이터 뷰 생성
CREATE OR REPLACE VIEW user_public_mydata_summary AS
SELECT
  u.id AS user_id,
  u.email,
  t.year AS tax_year,
  t.total_income,
  t.total_tax,
  e.employer_name,
  e.monthly_wage,
  e.employment_type,
  r.address,
  r.address_type,
  r.charter_deposit,
  r.monthly_rent,
  p.monthly_contribution AS pension_contribution,
  p.expected_pension
FROM auth.users u
LEFT JOIN public_mydata_tax t ON u.id = t.user_id
LEFT JOIN public_mydata_employment e ON u.id = e.user_id
LEFT JOIN public_mydata_residence r ON u.id = r.user_id
LEFT JOIN mydata_pensions p ON u.id = p.user_id AND p.pension_type = 'national'
WHERE t.year = (
  SELECT MAX(year)
  FROM public_mydata_tax t2
  WHERE t2.user_id = u.id
);

COMMENT ON TABLE public_mydata_tax IS '국세청 세금 정보 (공공 마이데이터)';
COMMENT ON TABLE public_mydata_employment IS '고용보험 정보 (공공 마이데이터)';
COMMENT ON TABLE public_mydata_residence IS '주민등록 주소 정보 (공공 마이데이터)';
COMMENT ON VIEW user_public_mydata_summary IS '사용자 공공 마이데이터 통합 뷰';
