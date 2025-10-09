-- DSR (Debt Service Ratio) Assessment Table
-- DSR 평가 이력 저장

CREATE TABLE IF NOT EXISTS dsr_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dsr NUMERIC NOT NULL CHECK (dsr >= 0), -- DSR 비율 (%)
  dti NUMERIC NOT NULL CHECK (dti >= 0), -- DTI 비율 (%)
  risk_level TEXT NOT NULL CHECK (risk_level IN ('safe', 'caution', 'warning', 'danger')),
  risk_score NUMERIC NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  monthly_debt_payment NUMERIC NOT NULL DEFAULT 0,
  monthly_income NUMERIC NOT NULL DEFAULT 0,
  total_debt NUMERIC NOT NULL DEFAULT 0,
  assessed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) 활성화
ALTER TABLE dsr_assessments ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "Users can view own dsr_assessments"
  ON dsr_assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dsr_assessments"
  ON dsr_assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own dsr_assessments"
  ON dsr_assessments FOR DELETE
  USING (auth.uid() = user_id);

-- 인덱스 생성
CREATE INDEX idx_dsr_assessments_user ON dsr_assessments(user_id);
CREATE INDEX idx_dsr_assessments_assessed_at ON dsr_assessments(assessed_at DESC);
CREATE INDEX idx_dsr_assessments_user_date ON dsr_assessments(user_id, assessed_at DESC);
CREATE INDEX idx_dsr_assessments_risk_level ON dsr_assessments(risk_level);

-- 최근 평가만 유지하는 함수
CREATE OR REPLACE FUNCTION cleanup_old_dsr_assessments()
RETURNS void AS $$
BEGIN
  -- 각 사용자별로 최근 24개월 평가만 유지
  DELETE FROM dsr_assessments
  WHERE id IN (
    SELECT id
    FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY assessed_at DESC) as rn
      FROM dsr_assessments
    ) t
    WHERE rn > 24
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- DSR 경고 알림 함수 (Supabase Edge Functions에서 호출 가능)
CREATE OR REPLACE FUNCTION get_high_risk_dsr_users()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  dsr NUMERIC,
  dti NUMERIC,
  risk_level TEXT,
  assessed_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (d.user_id)
    d.user_id,
    u.email,
    d.dsr,
    d.dti,
    d.risk_level,
    d.assessed_at
  FROM dsr_assessments d
  JOIN auth.users u ON u.id = d.user_id
  WHERE d.risk_level IN ('warning', 'danger')
    AND d.assessed_at > NOW() - INTERVAL '7 days'
  ORDER BY d.user_id, d.assessed_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE dsr_assessments IS 'DSR/DTI 평가 이력';
COMMENT ON COLUMN dsr_assessments.dsr IS 'DSR 비율 (총부채원리금상환비율)';
COMMENT ON COLUMN dsr_assessments.dti IS 'DTI 비율 (소득 대비 부채 비율)';
COMMENT ON COLUMN dsr_assessments.risk_level IS '위험 수준 (safe/caution/warning/danger)';
COMMENT ON COLUMN dsr_assessments.risk_score IS '위험 점수 (0-100, 높을수록 위험)';
