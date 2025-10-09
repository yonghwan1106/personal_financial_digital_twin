-- Location-based Spending Analysis
-- 위치 기반 소비 분석 테이블

-- 거래 위치 정보 테이블
CREATE TABLE IF NOT EXISTS transaction_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude NUMERIC(10, 8) NOT NULL,
  longitude NUMERIC(11, 8) NOT NULL,
  address TEXT,
  place_name TEXT,
  place_category TEXT, -- '음식점', '카페', '쇼핑', '편의점', '주유소' 등
  district TEXT, -- 구/군
  city TEXT, -- 시/도
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 지역별 소비 통계 테이블
CREATE TABLE IF NOT EXISTS regional_spending_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  district TEXT NOT NULL,
  category TEXT NOT NULL,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  transaction_count INTEGER NOT NULL DEFAULT 0,
  avg_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, year, month, district, category)
);

-- 즐겨찾는 장소 테이블
CREATE TABLE IF NOT EXISTS favorite_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  place_name TEXT NOT NULL,
  latitude NUMERIC(10, 8) NOT NULL,
  longitude NUMERIC(11, 8) NOT NULL,
  address TEXT,
  category TEXT,
  visit_count INTEGER NOT NULL DEFAULT 0,
  total_spent NUMERIC NOT NULL DEFAULT 0,
  last_visit_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 부동산 자산 위치 테이블
CREATE TABLE IF NOT EXISTS real_estate_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('owned', 'rented', 'charter', 'investment')),
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'officetel', 'commercial', 'land')),
  address TEXT NOT NULL,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  purchase_date DATE,
  purchase_price NUMERIC,
  current_value NUMERIC,
  monthly_cost NUMERIC, -- 월세, 관리비 등
  area_m2 NUMERIC,
  metadata JSONB, -- 추가 정보 (방 개수, 층수 등)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) 활성화
ALTER TABLE transaction_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_spending_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_assets ENABLE ROW LEVEL SECURITY;

-- RLS 정책: transaction_locations
CREATE POLICY "Users can view own transaction locations"
  ON transaction_locations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transaction locations"
  ON transaction_locations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transaction locations"
  ON transaction_locations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transaction locations"
  ON transaction_locations FOR DELETE
  USING (auth.uid() = user_id);

-- RLS 정책: regional_spending_stats
CREATE POLICY "Users can view own regional stats"
  ON regional_spending_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own regional stats"
  ON regional_spending_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own regional stats"
  ON regional_spending_stats FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own regional stats"
  ON regional_spending_stats FOR DELETE
  USING (auth.uid() = user_id);

-- RLS 정책: favorite_places
CREATE POLICY "Users can view own favorite places"
  ON favorite_places FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorite places"
  ON favorite_places FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own favorite places"
  ON favorite_places FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorite places"
  ON favorite_places FOR DELETE
  USING (auth.uid() = user_id);

-- RLS 정책: real_estate_assets
CREATE POLICY "Users can view own real estate"
  ON real_estate_assets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own real estate"
  ON real_estate_assets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own real estate"
  ON real_estate_assets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own real estate"
  ON real_estate_assets FOR DELETE
  USING (auth.uid() = user_id);

-- 인덱스 생성
CREATE INDEX idx_transaction_locations_user ON transaction_locations(user_id);
CREATE INDEX idx_transaction_locations_transaction ON transaction_locations(transaction_id);
CREATE INDEX idx_transaction_locations_coords ON transaction_locations(latitude, longitude);
CREATE INDEX idx_transaction_locations_category ON transaction_locations(place_category);

CREATE INDEX idx_regional_stats_user ON regional_spending_stats(user_id);
CREATE INDEX idx_regional_stats_date ON regional_spending_stats(year DESC, month DESC);
CREATE INDEX idx_regional_stats_district ON regional_spending_stats(district);

CREATE INDEX idx_favorite_places_user ON favorite_places(user_id);
CREATE INDEX idx_favorite_places_coords ON favorite_places(latitude, longitude);

CREATE INDEX idx_real_estate_user ON real_estate_assets(user_id);
CREATE INDEX idx_real_estate_coords ON real_estate_assets(latitude, longitude);
CREATE INDEX idx_real_estate_type ON real_estate_assets(asset_type, property_type);

-- 지역별 소비 분석 뷰
CREATE OR REPLACE VIEW user_spending_by_district AS
SELECT
  user_id,
  district,
  SUM(total_amount) as total_spent,
  SUM(transaction_count) as total_transactions,
  AVG(avg_amount) as avg_transaction_amount,
  array_agg(DISTINCT category) as categories
FROM regional_spending_stats
GROUP BY user_id, district;

-- 월별 지역 소비 트렌드 뷰
CREATE OR REPLACE VIEW monthly_regional_trends AS
SELECT
  user_id,
  year,
  month,
  district,
  category,
  total_amount,
  transaction_count,
  avg_amount,
  LAG(total_amount) OVER (PARTITION BY user_id, district, category ORDER BY year, month) as prev_month_amount,
  CASE
    WHEN LAG(total_amount) OVER (PARTITION BY user_id, district, category ORDER BY year, month) > 0
    THEN ROUND(((total_amount - LAG(total_amount) OVER (PARTITION BY user_id, district, category ORDER BY year, month))
                 / LAG(total_amount) OVER (PARTITION BY user_id, district, category ORDER BY year, month) * 100)::numeric, 2)
    ELSE NULL
  END as growth_percentage
FROM regional_spending_stats
ORDER BY year DESC, month DESC;

COMMENT ON TABLE transaction_locations IS '거래 위치 정보';
COMMENT ON TABLE regional_spending_stats IS '지역별 소비 통계';
COMMENT ON TABLE favorite_places IS '즐겨찾는 장소';
COMMENT ON TABLE real_estate_assets IS '부동산 자산 위치';
COMMENT ON VIEW user_spending_by_district IS '사용자별 지역 소비 집계';
COMMENT ON VIEW monthly_regional_trends IS '월별 지역 소비 트렌드';
