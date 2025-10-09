# 개인 금융 디지털 트윈 (Personal Financial Digital Twin) PRD v2.0

## 문서 정보
- **버전:** 2.0
- **최종 수정일:** 2025년 10월 9일
- **프로젝트명:** 나의 금융 미래 (My Financial Future)
- **출품 대회:** 2025 서민금융진흥원 대국민 혁신 아이디어 공모전
- **개발 상태:** MVP 개발 완료, Phase 2 준비 중

---

## Executive Summary

본 프로젝트는 AI 기반의 개인 금융 디지털 트윈 플랫폼으로, 사용자의 실제 금융 데이터를 기반으로 미래 재무 상태를 시뮬레이션하고 맞춤형 금융 의사결정을 지원합니다. Next.js 15, Supabase, Claude 3.5 Sonnet API를 활용하여 실시간 금융 데이터 통합, AI 기반 시나리오 분석, 자연어 대화형 재무 상담 기능을 제공합니다.

**핵심 가치 제안:**
- 🎯 **예측 가능한 미래:** 인생 이벤트별 재무 영향을 사전 시뮬레이션
- 🤖 **AI 재무 어드바이저:** Claude API 기반 자연어 대화형 상담
- 🔗 **통합 금융 데이터:** MyData 연동을 통한 원스톱 자산 관리
- 📊 **직관적 시각화:** 복잡한 재무 데이터의 이해하기 쉬운 표현

---

## 1. 프로젝트 개요

### 1.1 비전
모든 국민이 자신의 금융 생활에 대한 '디지털 쌍둥이'를 통해 미래를 예측하고, 데이터 기반의 현명한 의사결정을 내릴 수 있도록 돕는 초개인화 금융 라이프 플래닝 서비스

### 1.2 미션
금융 데이터와 AI 시뮬레이션 기술을 결합하여, 서민·취약계층이 잠재적 금융 위기를 사전에 인지하고 선제적으로 대응할 수 있는 '금융 인생 내비게이션'을 제공함으로써 장기적인 금융 자립과 안정을 지원

### 1.3 목표 시장
- **1차 타겟:** 사회초년생 (2030세대), 다중채무자, 은퇴 준비자 (4050세대)
- **2차 타겟:** 체계적인 재무 관리를 원하는 모든 국민
- **시장 규모:** 대한민국 경제활동인구 약 2,800만 명

---

## 2. 구현 현황 (Implementation Status)

### 2.1 완료된 기능 (Phase 1 - MVP)

#### ✅ 사용자 인증 및 관리
- Supabase Auth 기반 이메일/비밀번호 인증
- 회원가입, 로그인, 로그아웃 기능
- Row Level Security (RLS) 정책 적용

#### ✅ 재무 현황 대시보드
- **위치:** `/dashboard`
- **기능:**
  - 순자산 추이 그래프 (LineChart)
  - 월별 수입 vs 지출 비교 (BarChart)
  - 자산/부채 구성 요약 카드
  - 주요 재무 지표 (저축률, 현금흐름 등)
- **기술:** Recharts를 활용한 데이터 시각화

#### ✅ MyData 계좌 연동 (Mock 구현)
- **위치:** `/accounts`
- **지원 기관:**
  - 은행 8개: KB국민, 신한, 우리, 하나, NH농협, 카카오뱅크, 토스뱅크, 케이뱅크
  - 카드사 6개: 삼성, 현대, 신한, KB국민, 우리, 하나
- **기능:**
  - 계좌 연동 시 자동으로 30일간의 샘플 거래 내역 생성
  - 거래 내역 Supabase DB 저장
  - 연동된 계좌 목록 및 잔액 표시
- **향후 계획:** 실제 MyData API 연동 (Phase 2)

#### ✅ 미래 재무 시뮬레이션
- **위치:** `/simulation`
- **설정 가능한 변수:**
  - 시뮬레이션 기간 (1-30년)
  - 물가상승률 (%)
  - 소득증가율 (%)
  - 투자수익률 (%)
  - 인생 이벤트 (결혼, 출산, 주택구매 등)
- **시뮬레이션 엔진:**
  - 연도별 순자산, 소득, 지출, 저축 계산
  - 이벤트 기반 현금흐름 변동 반영
  - Claude API를 통한 AI 분석 및 위험 경고
- **출력:**
  - 연도별 재무 상태 그래프
  - AI 생성 요약 및 추천사항
  - 위험 요소 알림

#### ✅ AI 재무 상담 채팅
- **위치:** `/chat`
- **기능:**
  - Claude 3.5 Sonnet API 기반 대화형 인터페이스
  - 사용자 재무 컨텍스트 자동 전달 (소득, 지출, 순자산, 저축률)
  - 실시간 질의응답
  - 대화 히스토리 유지
- **응답 품질:**
  - 한국어 자연어 처리
  - 구체적이고 실행 가능한 조언
  - 2-4문단 적절한 길이

#### ✅ 재무 목표 관리
- **위치:** `/goals`
- **기능:**
  - 목표 CRUD (생성, 조회, 수정, 삭제)
  - 목표 유형: 저축, 주택구매, 자동차구매, 교육, 은퇴 등
  - 목표 달성률 진행 바 시각화
  - 목표 금액 및 현재 금액 추적
  - 목표 기한 설정

#### ✅ 사용자 설정
- **위치:** `/settings`
- **기능:**
  - 프로필 정보 관리 (이름, 이메일)
  - 월 소득/지출 목표 설정
  - 저축 목표 설정
  - 알림 설정 (이메일, 푸시)

#### ✅ 프로젝트 소개 페이지
- **위치:** `/about`
- **내용:**
  - 프로젝트 배경 및 목적
  - 3단계 핵심 기능 소개
  - 기대 효과
  - 기술 스택

### 2.2 진행 중인 기능 (Phase 2)

#### 🚧 실제 MyData API 연동
- 금융위원회 MyData API 가이드라인 준수
- OAuth 2.0 기반 안전한 인증
- 실시간 거래 내역 동기화

#### 🚧 공공 MyData 연동
- 행정안전부 공공 마이데이터
- 소득, 세금, 국민연금 정보 통합

#### 🚧 고급 시뮬레이션 기능
- 몬테카를로 시뮬레이션 (확률적 미래 예측)
- Best/Worst Case 시나리오 비교
- DSR(총부채원리금상환비율) 위험 감지

### 2.3 계획된 기능 (Phase 3)

#### 📋 위치 기반 소비 분석
- Kakao Maps API 연동
- 지역별 소비 패턴 시각화
- 부동산 자산 위치 표시

#### 📋 비금융 데이터 연동
- 통신, 쇼핑 등 대안 신용평가 데이터
- 신용 점수 영향 요인 분석

#### 📋 소셜 비교 기능
- 익명화된 유사 그룹 비교
- 재무 건강 점수 벤치마킹

---

## 3. 기술 스택

### 3.1 프론트엔드
- **프레임워크:** Next.js 15.5.4
- **UI 라이브러리:** React 19.1.0
- **스타일링:** Tailwind CSS 4.0
- **아이콘:** Lucide React 0.545.0
- **차트:** Recharts 3.2.1
- **날짜 처리:** date-fns 4.1.0

### 3.2 백엔드
- **BaaS:** Supabase
  - PostgreSQL 데이터베이스
  - Supabase Auth (인증)
  - Row Level Security (RLS)
  - Realtime Subscriptions
  - Edge Functions (서버리스)
- **Supabase SDK:**
  - @supabase/supabase-js 2.74.0
  - @supabase/ssr 0.7.0
  - @supabase/auth-helpers-nextjs 0.10.0

### 3.3 AI/ML
- **AI 모델:** Claude 3.5 Sonnet (claude-3-5-sonnet-20241022)
- **SDK:** @anthropic-ai/sdk 0.65.0
- **기능:**
  - 자연어 시나리오 분석
  - 시뮬레이션 결과 해석
  - 맞춤형 재무 조언 생성

### 3.4 배포 및 인프라
- **호스팅:** Vercel
- **CI/CD:** Vercel Git Integration
- **환경 변수 관리:** Vercel Environment Variables

### 3.5 개발 도구
- **언어:** TypeScript 5.x
- **린팅:** ESLint 9.x
- **패키지 매니저:** npm
- **빌드 도구:** Next.js Turbopack

### 3.6 아키텍처 다이어그램

```
┌─────────────┐
│   사용자    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Next.js 15 Frontend (Vercel)       │
│  - React 19 Components              │
│  - Tailwind CSS                     │
│  - Recharts Visualization           │
└──────┬──────────────────────────────┘
       │
       ├──────────────┬─────────────────┐
       ▼              ▼                 ▼
┌─────────────┐ ┌──────────────┐ ┌────────────┐
│  Supabase   │ │ Next.js API  │ │ Claude API │
│  - Auth     │ │  Routes      │ │  (AI)      │
│  - DB       │ │  /api/chat   │ └────────────┘
│  - RLS      │ │  /api/sim*   │
└─────────────┘ └──────────────┘
```

---

## 4. 데이터베이스 스키마

### 4.1 users 테이블
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  monthly_income NUMERIC,
  monthly_expenses NUMERIC,
  savings_goal NUMERIC,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 accounts 테이블
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  account_type TEXT NOT NULL, -- 'bank' | 'card'
  account_number TEXT,
  balance NUMERIC,
  connected_at TIMESTAMP DEFAULT NOW()
);
```

### 4.3 transactions 테이블
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  category TEXT,
  description TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.4 financial_goals 테이블
```sql
CREATE TABLE financial_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL, -- 'savings' | 'house' | 'car' | 'education' | 'retirement'
  title TEXT NOT NULL,
  target_amount NUMERIC NOT NULL,
  current_amount NUMERIC DEFAULT 0,
  target_date DATE,
  status TEXT DEFAULT 'active', -- 'active' | 'completed' | 'cancelled'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4.5 Row Level Security (RLS) 정책

모든 테이블에 적용된 RLS 정책:
```sql
-- 사용자는 자신의 데이터만 조회/수정/삭제 가능
ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON [table_name] FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
  ON [table_name] FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
  ON [table_name] FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data"
  ON [table_name] FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 5. API 명세

### 5.1 POST /api/chat

**설명:** Claude API를 이용한 AI 재무 상담

**요청 본문:**
```typescript
{
  message: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  userContext?: {
    monthlyIncome?: number;
    monthlyExpenses?: number;
    netWorth?: number;
    savingsRate?: number;
  };
}
```

**응답:**
```typescript
{
  success: boolean;
  response?: string;
  error?: string;
}
```

**구현 위치:** `src/app/api/chat/route.ts`

**내부 동작:**
1. 요청 본문에서 메시지, 대화 히스토리, 사용자 컨텍스트 추출
2. `chatWithClaude()` 함수 호출 (src/lib/claude/client.ts)
3. Claude API에 시스템 프롬프트와 사용자 메시지 전달
4. AI 응답을 클라이언트에 반환

### 5.2 POST /api/simulation

**설명:** 미래 재무 상태 시뮬레이션 및 AI 분석

**요청 본문:**
```typescript
{
  simulationYears?: number;      // 기본값: 10
  inflationRate?: number;        // 기본값: 2.5 (%)
  incomeGrowthRate?: number;     // 기본값: 3.0 (%)
  investmentReturnRate?: number; // 기본값: 5.0 (%)
  events?: Array<{
    year: number;
    type: 'expense' | 'income';
    amount: number;
    description: string;
  }>;
}
```

**응답:**
```typescript
{
  success: boolean;
  projectionData?: Array<{
    year: number;
    netWorth: number;
    income: number;
    expenses: number;
    savings: number;
  }>;
  analysis?: {
    summary: string;
    projectedNetWorth: number;
    riskAlerts: string[];
    recommendations: string[];
  };
  error?: string;
}
```

**구현 위치:** `src/app/api/simulation/route.ts`

**내부 동작:**
1. Mock 현재 재무 상태 로드 (추후 DB 연동)
2. `analyzeSimulation()` 함수 호출로 Claude API 분석 요청
3. 연도별 시뮬레이션 계산:
   - 월 저축 = 소득 - 지출
   - 연간 저축 = 월 저축 × 12
   - 투자 수익 = 순자산 × 투자수익률
   - 다음 연도 순자산 = 현재 순자산 + 연간 저축 + 투자 수익 + 이벤트 영향
4. 소득 증가율 및 물가상승률 적용
5. 시뮬레이션 데이터와 AI 분석 결과 반환

---

## 6. 보안 및 개인정보 보호

### 6.1 인증 및 권한

- **인증 방식:** Supabase Auth (JWT 기반)
- **세션 관리:** HTTP-only 쿠키
- **비밀번호:** bcrypt 해싱 (Supabase 기본)

### 6.2 데이터 보호

- **전송 암호화:** HTTPS/TLS 1.3
- **저장 암호화:** Supabase 기본 암호화 (AES-256)
- **접근 제어:** Row Level Security (RLS) 정책
- **API 키 관리:** Vercel 환경 변수 (서버 측 전용)

### 6.3 개인정보 처리

- **수집 데이터:**
  - 필수: 이메일, 비밀번호
  - 선택: 이름, 소득, 지출, 금융 거래 내역
- **데이터 보관:** 회원 탈퇴 시 즉시 삭제
- **제3자 제공:** Claude API (익명화된 재무 데이터만 전송, 개인식별정보 제외)

### 6.4 규정 준수

- **개인정보보호법:** 동의 기반 데이터 수집 및 처리
- **금융 마이데이터:** 금융위원회 가이드라인 준수 (Phase 2)
- **신용정보법:** 민감정보 암호화 및 접근통제

---

## 7. 사용자 플로우

### 7.1 신규 사용자 온보딩

```
1. 랜딩 페이지 접속 (/)
   ↓
2. "시작하기" 버튼 클릭
   ↓
3. 회원가입 페이지 (/auth)
   - 이메일/비밀번호 입력
   ↓
4. 계정 생성 완료
   ↓
5. 대시보드 리다이렉트 (/dashboard)
   ↓
6. 프로필 설정 안내
   - 월 소득/지출 입력
   ↓
7. MyData 계좌 연동 안내
   - 은행/카드사 선택
   - Mock 데이터 생성
   ↓
8. 첫 시뮬레이션 실행 안내
```

### 7.2 재무 시뮬레이션 플로우

```
1. 시뮬레이션 페이지 접속 (/simulation)
   ↓
2. 시뮬레이션 설정
   - 기간 선택 (슬라이더)
   - 변수 조정 (물가상승률, 소득증가율, 투자수익률)
   ↓
3. 인생 이벤트 추가 (선택)
   - 이벤트 유형 선택 (결혼, 출산, 주택구매 등)
   - 발생 연도 지정
   - 예상 금액 입력
   ↓
4. "시뮬레이션 실행" 버튼 클릭
   ↓
5. API 요청 (/api/simulation)
   - 서버에서 계산 수행
   - Claude API 분석 요청
   ↓
6. 결과 표시
   - 연도별 순자산 그래프
   - AI 요약 및 추천사항
   - 위험 경고
   ↓
7. 결과 기반 액션
   - 채팅으로 질문하기
   - 목표 수정하기
   - 설정 조정하기
```

### 7.3 AI 상담 플로우

```
1. 채팅 페이지 접속 (/chat)
   ↓
2. 사용자 재무 컨텍스트 자동 로드
   - 현재 소득, 지출, 순자산, 저축률
   ↓
3. 질문 입력
   - 예: "결혼 자금을 3년 안에 모으려면 얼마씩 저축해야 할까요?"
   ↓
4. API 요청 (/api/chat)
   - 대화 히스토리 포함
   - 사용자 컨텍스트 전달
   ↓
5. Claude API 응답 생성
   - 한국어 자연어 처리
   - 구체적인 계산 및 조언
   ↓
6. 응답 표시
   - 채팅 UI에 AI 메시지 추가
   ↓
7. 추가 질문 가능
   - 대화 히스토리 유지
```

---

## 8. 성능 및 최적화

### 8.1 성능 목표

- **첫 페이지 로드 (FCP):** < 1.5초
- **Time to Interactive (TTI):** < 3초
- **API 응답 시간:**
  - /api/chat: < 3초
  - /api/simulation: < 2초
- **Lighthouse 점수:** > 90 (Performance, Accessibility, Best Practices)

### 8.2 최적화 전략

- **코드 분할:** Next.js 자동 코드 스플리팅
- **이미지 최적화:** Next.js Image 컴포넌트
- **서버 사이드 렌더링:** 주요 페이지 SSR 적용
- **캐싱:**
  - Vercel Edge Network CDN
  - Supabase 쿼리 캐싱
- **번들 최적화:** Turbopack 빌드 시스템

### 8.3 확장성

- **서버리스 아키텍처:** Vercel Functions 자동 스케일링
- **데이터베이스:** Supabase 자동 스케일링 지원
- **API Rate Limiting:** Claude API 사용량 모니터링 및 제한

---

## 9. 접근성 (Accessibility)

### 9.1 WCAG 2.1 준수

- **레벨:** AA 목표
- **주요 기준:**
  - 키보드 내비게이션 지원
  - 스크린 리더 호환성
  - 색상 대비 4.5:1 이상
  - 대체 텍스트 제공

### 9.2 다국어 지원

- **1차:** 한국어 (현재 구현)
- **향후:** 영어, 일본어, 중국어 (i18n)

---

## 10. 테스트 전략

### 10.1 단위 테스트
- **프레임워크:** Jest, React Testing Library
- **커버리지 목표:** > 80%
- **대상:**
  - 유틸리티 함수
  - React 컴포넌트
  - API 핸들러

### 10.2 통합 테스트
- **도구:** Playwright
- **대상:**
  - 사용자 인증 플로우
  - MyData 연동 플로우
  - 시뮬레이션 실행 플로우

### 10.3 E2E 테스트
- **시나리오:**
  - 신규 사용자 온보딩
  - 계좌 연동 → 대시보드 확인
  - 시뮬레이션 설정 → 결과 확인
  - AI 채팅 대화

### 10.4 부하 테스트
- **도구:** k6, Artillery
- **시나리오:**
  - 동시 사용자 1,000명
  - API 호출 빈도 테스트

---

## 11. 배포 및 운영

### 11.1 배포 프로세스

```
1. 개발 환경 (localhost:3000)
   - npm run dev
   ↓
2. Git 커밋 및 푸시
   - GitHub 리포지토리
   ↓
3. Vercel 자동 배포
   - Preview 배포 (PR 생성 시)
   - Production 배포 (main 브랜치 머지 시)
   ↓
4. 배포 확인
   - Vercel 대시보드
   - 실제 URL 테스트
```

### 11.2 환경 변수

**필수 환경 변수:**
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

**관리:**
- Vercel 프로젝트 설정에서 관리
- 환경별 분리 (Development, Preview, Production)

### 11.3 모니터링

- **성능:** Vercel Analytics
- **에러 추적:** Vercel Logs
- **사용량:**
  - Supabase Dashboard (DB 쿼리, 인증)
  - Anthropic Console (API 사용량)

### 11.4 백업 및 복구

- **데이터베이스:** Supabase 자동 백업 (일일)
- **코드:** GitHub 버전 관리
- **복구 계획:** RTO < 1시간, RPO < 24시간

---

## 12. 제약사항 및 한계

### 12.1 현재 제약사항

1. **Mock MyData 구현**
   - 실제 금융기관 API 미연동
   - 샘플 거래 데이터 사용
   - Phase 2에서 실제 API 연동 예정

2. **시뮬레이션 정확도**
   - 단순 선형 계산 모델
   - 시장 변동성, 세금, 인플레이션 복잡도 미반영
   - 몬테카를로 시뮬레이션 Phase 2 예정

3. **AI 응답 품질**
   - Claude API 의존성 (인터넷 연결 필요)
   - 토큰 사용량 제한 (월 사용량 관리 필요)
   - 한국 금융 규제에 대한 이해 한계

4. **확장성**
   - 대규모 트래픽 미검증
   - 실시간 업데이트 미구현

### 12.2 기술적 한계

- **브라우저 호환성:** 최신 모던 브라우저 권장 (Chrome 90+, Safari 14+, Firefox 88+)
- **모바일 최적화:** 반응형 디자인 구현되었으나 네이티브 앱 대비 성능 제한
- **오프라인 지원:** 미지원 (PWA Phase 3 예정)

---

## 13. 성공 지표 (Success Metrics)

### 13.1 사용자 참여

- **MAU (월간 활성 사용자):** 목표 10,000명 (출시 6개월)
- **세션당 시뮬레이션 실행 횟수:** 평균 2회 이상
- **평균 세션 시간:** > 5분
- **재방문율:** > 40% (주간)

### 13.2 서비스 효과

- **재무 목표 설정률:** 사용자의 70% 이상
- **목표 달성률:** 설정된 목표의 30% 이상 달성
- **재무 건강 점수 개선:** 평균 15점 이상 상승 (100점 만점)

### 13.3 사용자 만족도

- **NPS (Net Promoter Score):** > 50
- **앱 스토어 평점:** > 4.5 / 5.0
- **사용자 피드백 응답률:** > 60%

### 13.4 비즈니스 지표

- **사용자 획득 비용 (CAC):** < 5,000원
- **생애 가치 (LTV):** > 50,000원 (향후 수익화 시)
- **이탈률 (Churn Rate):** < 10% (월간)

---

## 14. 향후 로드맵

### Phase 1: MVP (완료) ✅
- 기본 인증 및 사용자 관리
- 재무 현황 대시보드
- Mock MyData 연동
- 기본 시뮬레이션
- AI 채팅 상담
- 재무 목표 관리

### Phase 2: 고도화 (2025 Q2) 🚧
- **실제 MyData API 연동**
  - 금융위원회 인증 획득
  - OAuth 2.0 구현
  - 실시간 데이터 동기화
- **공공 마이데이터 연동**
  - 소득, 세금, 국민연금
- **고급 시뮬레이션**
  - 몬테카를로 방법론
  - 확률적 미래 예측
  - 민감도 분석
- **자동화된 재무 건강 점수**
  - 주간/월간 리포트 자동 생성
  - 이메일 알림

### Phase 3: 확장 (2025 Q4) 📋
- **위치 기반 기능**
  - Kakao Maps API 연동
  - 소비 패턴 지도 시각화
  - 부동산 자산 위치 표시
- **소셜 기능**
  - 익명화된 유사 그룹 비교
  - 재무 목표 공유 (선택적)
  - 커뮤니티 챌린지
- **대안 신용평가**
  - 비금융 데이터 연동 (통신, 쇼핑)
  - 신용 점수 예측
- **PWA (Progressive Web App)**
  - 오프라인 지원
  - 푸시 알림
  - 홈 화면 설치

### Phase 4: 수익화 (2026 Q2)
- **프리미엄 구독 모델**
  - 무제한 AI 상담
  - 고급 시뮬레이션 기능
  - 우선 지원
- **B2B 서비스**
  - 금융기관용 화이트라벨
  - 기업 복지 프로그램 연동
- **파트너십**
  - 서민금융진흥원 상품 추천 수수료
  - 금융사 제휴 마케팅

---

## 15. 위험 관리

### 15.1 기술적 위험

| 위험 | 영향 | 확률 | 완화 방안 |
|------|------|------|-----------|
| Claude API 장애 | 높음 | 낮음 | 폴백 응답 메시지, 캐싱 전략 |
| Supabase 다운타임 | 높음 | 낮음 | 읽기 전용 모드, 백업 DB |
| MyData API 연동 실패 | 중간 | 중간 | Mock 데이터 유지, 단계적 롤아웃 |
| 성능 저하 (대규모 트래픽) | 중간 | 중간 | CDN, 로드 밸런싱, 쿼리 최적화 |

### 15.2 보안 위험

| 위험 | 영향 | 확률 | 완화 방안 |
|------|------|------|-----------|
| 개인정보 유출 | 매우 높음 | 낮음 | 암호화, RLS, 정기 보안 감사 |
| SQL 인젝션 | 높음 | 매우 낮음 | Parameterized queries, ORM 사용 |
| XSS 공격 | 중간 | 낮음 | React 자동 이스케이핑, CSP 헤더 |
| CSRF 공격 | 중간 | 낮음 | CSRF 토큰, SameSite 쿠키 |

### 15.3 비즈니스 위험

| 위험 | 영향 | 확률 | 완화 방안 |
|------|------|------|-----------|
| 사용자 확보 실패 | 높음 | 중간 | 마케팅 전략 다각화, 바이럴 기능 |
| 경쟁 서비스 등장 | 중간 | 높음 | 차별화된 AI 기능, 빠른 기능 개선 |
| 규제 강화 | 높음 | 중간 | 법률 자문, 규정 준수 모니터링 |
| 수익화 실패 | 중간 | 중간 | 다양한 수익 모델 실험 |

---

## 16. 참고 문서

### 16.1 외부 문서
1. [금융위원회 마이데이터 API 가이드라인](https://www.fsc.go.kr)
2. [행정안전부 공공 마이데이터](https://www.mois.go.kr)
3. [개인정보보호법](https://www.pipc.go.kr)
4. [Next.js 공식 문서](https://nextjs.org/docs)
5. [Supabase 공식 문서](https://supabase.com/docs)
6. [Anthropic Claude API 문서](https://docs.anthropic.com)

### 16.2 내부 문서
- [프로젝트 제안서](./proposal.md)
- [PRD v1.0](./prd.md)
- [기술 스택 분석](./prd.md#기술적-구현-가능성-분석)

---

## 17. 팀 및 연락처

### 17.1 개발팀
- **프론트엔드:** Next.js + React
- **백엔드:** Supabase
- **AI/ML:** Claude API Integration

### 17.2 프로젝트 정보
- **GitHub Repository:** [링크 추가 예정]
- **프로덕션 URL:** [링크 추가 예정]
- **문의:** [이메일 추가 예정]

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 2.0 | 2025-10-09 | - 구현 현황 섹션 추가<br>- 기술 스택 상세 명세<br>- API 명세 추가<br>- 보안 섹션 추가<br>- 사용자 플로우 추가<br>- 성능 및 최적화 섹션 추가<br>- 테스트 전략 추가<br>- 배포 및 운영 섹션 추가<br>- 제약사항 및 위험 관리 추가 | AI Assistant |
| 1.0 | 2025-10-01 | 초기 PRD 작성 | - |

---

**문서 끝**
