-- Financial Health Scores Table
-- 재무 건강 점수 이력 저장

CREATE TABLE IF NOT EXISTS financial_health_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL CHECK (score >= 0 AND score <= 100),
  grade TEXT NOT NULL CHECK (grade IN ('A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F')),
  components JSONB NOT NULL,
  insights TEXT[] NOT NULL,
  recommendations TEXT[] NOT NULL,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- users 테이블에 age 컬럼 추가 (있으면 무시)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS age INTEGER DEFAULT 30;

-- Row Level Security (RLS) 활성화
ALTER TABLE financial_health_scores ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "Users can view own health scores"
  ON financial_health_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health scores"
  ON financial_health_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own health scores"
  ON financial_health_scores FOR DELETE
  USING (auth.uid() = user_id);

-- 인덱스 생성
CREATE INDEX idx_financial_health_scores_user ON financial_health_scores(user_id);
CREATE INDEX idx_financial_health_scores_calculated_at ON financial_health_scores(calculated_at DESC);
CREATE INDEX idx_financial_health_scores_user_date ON financial_health_scores(user_id, calculated_at DESC);

-- 최근 점수만 유지하는 함수 (선택적)
CREATE OR REPLACE FUNCTION cleanup_old_health_scores()
RETURNS void AS $$
BEGIN
  -- 각 사용자별로 최근 24개월 점수만 유지
  DELETE FROM financial_health_scores
  WHERE id IN (
    SELECT id
    FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY calculated_at DESC) as rn
      FROM financial_health_scores
    ) t
    WHERE rn > 24
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE financial_health_scores IS '재무 건강 점수 이력 (월간 자동 계산)';
COMMENT ON COLUMN financial_health_scores.score IS '총 점수 (0-100)';
COMMENT ON COLUMN financial_health_scores.grade IS '등급 (A+, A, B+, B, C+, C, D, F)';
COMMENT ON COLUMN financial_health_scores.components IS '세부 항목별 점수 (JSON)';
COMMENT ON COLUMN financial_health_scores.insights IS '인사이트 (배열)';
COMMENT ON COLUMN financial_health_scores.recommendations IS '추천사항 (배열)';
