'use client';

import Link from 'next/link';
import {
  Sparkles,
  Database,
  Brain,
  Target,
  TrendingUp,
  Shield,
  Users,
  Zap,
  ArrowRight,
  Check,
  Globe,
  LineChart,
  Layers,
  BarChart3,
  MessageSquare,
  Wallet,
  Award,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"></div>
              <span className="text-lg font-bold text-gray-900">금융 디지털트윈</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                홈
              </Link>
              <Link
                href="/about"
                className="text-blue-600 font-medium"
              >
                소개
              </Link>
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                시작하기
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">2025 서민금융진흥원 대국민 혁신 아이디어 공모전 출품작</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                AI 기반 '개인 금융 디지털 트윈' 구축을 통한<br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  초개인화 금융 라이프 플래닝 서비스
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                모든 국민이 자신의 금융 생활에 대한 '디지털 쌍둥이'를 가질 수 있도록,
                미래를 예측하고 시뮬레이션하며 현명한 의사결정을 지원하는 금융 인생 내비게이션
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  무료로 시작하기
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-lg border-2 border-gray-200"
                >
                  자세히 알아보기
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Background & Purpose Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                추진 배경 및 목적
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                복잡한 금융 정보와 분산된 자산 현황으로 인한 어려움을 해결하고,
                모든 국민이 예측 가능한 금융 미래를 설계할 수 있도록 돕습니다
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Problem */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">현황 및 문제점</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></div>
                    <span>복잡한 금융 정보와 분산된 자산으로 통합적 재무 파악 어려움</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></div>
                    <span>결혼, 주택 구매, 은퇴 등 장기 인생 계획 수립의 막막함</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></div>
                    <span>금융 위기 발생 시 효과적 대응 부족</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></div>
                    <span>고액 자산가 위주의 단편적 자문 서비스</span>
                  </li>
                </ul>
              </div>

              {/* Technology */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">기술적 가능성</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                    <span>마이데이터 서비스로 금융 정보 안전한 통합 기반 마련</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                    <span>AI와 시뮬레이션 기술로 미래 예측 가능</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                    <span>디지털 트윈 기술로 다양한 what-if 시나리오 분석</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                    <span>개인의 금융 생활을 가상 세계에 복제하여 실시간 분석</span>
                  </li>
                </ul>
              </div>

              {/* Solution */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">추진 목적</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></div>
                    <span>모든 국민에게 금융 디지털 쌍둥이 제공</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></div>
                    <span>현재 재무 상태 정확한 진단 및 미래 시뮬레이션</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></div>
                    <span>데이터 기반 현명한 의사결정 지원</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></div>
                    <span>금융 위기 선제적 예방 및 장기 금융 자립 지원</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                3단계 핵심 기능
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                데이터 통합부터 AI 예측, 맞춤형 솔루션 제공까지
                체계적인 3단계 시스템으로 완벽한 금융 라이프 플래닝을 지원합니다
              </p>
            </div>

            <div className="space-y-8">
              {/* Stage 1 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center">
                      <Database className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                        1단계
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900">
                        데이터 통합 - Digital Twin 생성 (Data Fabric)
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Layers className="w-5 h-5 text-blue-600" />
                          마이데이터 연동
                        </h4>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>은행, 카드, 대출, 보험, 투자 등 모든 금융 정보 API 연동</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>통합된 재무 현황 대시보드 실시간 제공</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>안전한 데이터 암호화 및 사용자 동의 기반 운영</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Globe className="w-5 h-5 text-blue-600" />
                          공공 마이데이터 활용
                        </h4>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>국세청, 국민연금공단 등 공공기관 데이터 연동</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>소득, 세금, 연금 정보 결합으로 정확성 향상</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>디지털 트윈의 신뢰도 극대화</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl flex items-center justify-center">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                        2단계
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900">
                        AI 예측 및 시뮬레이션 (Simulation & Decision Intelligence)
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-purple-600" />
                          인생 이벤트 시뮬레이션
                        </h4>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>주택 구매, 결혼, 자녀 출산 등 주요 이벤트 선택</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>미래 현금 흐름 및 순자산 장기 예측 (1~30년)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>직관적인 그래프와 차트로 시각화</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-purple-600" />
                          자연어 시나리오 분석
                        </h4>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>채팅으로 자연어 질문 입력</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>AI가 의도 파악 후 즉시 시뮬레이션</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>이해하기 쉬운 언어로 결과 설명</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-purple-600" />
                          위험 예측 및 조기 경보
                        </h4>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>유동성 부족, DSR 급등 등 위험 징후 감지</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>즉시 경고 알림 및 원인 상세 설명</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>선제적 대응 방안 제시</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-400 rounded-2xl flex items-center justify-center">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                        3단계
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900">
                        맞춤형 솔루션 제시 (Experience Orchestration)
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-green-600" />
                          AI 컨설팅 및 솔루션 제안
                        </h4>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>재무 상태 및 예측 위험 기반 맞춤형 전략</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>부채 상환 순서, 저축 증액 방안 제시</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>투자 포트폴리오 조정 및 실행 가능한 행동 계획</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Wallet className="w-5 h-5 text-green-600" />
                          서민금융 상품 연계
                        </h4>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>채무 부담, 긴급 자금 필요 시 자동 감지</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>서민금융진흥원 맞춤형 정책금융상품 추천</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>신청 절차 안내 및 실질적 문제 해결 지원</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Expected Benefits Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                기대 효과
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                국민 개개인의 금융 생활 혁신과 서민금융진흥원의 역할 확장
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Public Benefits */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">대국민 효과</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      예측 기반의 선제적 재무 관리
                    </h4>
                    <p className="text-gray-700">
                      과거 데이터 조회에서 벗어나 미래를 예측하고 시뮬레이션하며
                      위험에 미리 대비하는 능동적·선제적 재무 관리 실현
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-blue-600" />
                      금융 의사결정 능력 향상
                    </h4>
                    <p className="text-gray-700">
                      게임처럼 시뮬레이션하며 학습함으로써 청년 및 금융 취약계층의
                      금융 이해력 향상과 합리적 의사결정 능력 배양
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      금융 계획의 보편화
                    </h4>
                    <p className="text-gray-700">
                      고액 자산가만 접근 가능했던 재무 설계 서비스를 모든 국민에게 무료 제공,
                      금융 정보 격차 해소 및 보편적 금융 복지 실현
                    </p>
                  </div>
                </div>
              </div>

              {/* Institutional Benefits */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">서민금융진흥원 효과</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      초개인화 서비스 제공
                    </h4>
                    <p className="text-gray-700">
                      모든 국민에게 'AI 금융 주치의' 제공으로 단순 자금 지원을 넘어
                      금융 인생 전반을 함께 설계하는 동반자로서의 위상 정립
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      정책금융의 효과성 극대화
                    </h4>
                    <p className="text-gray-700">
                      잠재적 위기 상황 사전 포착으로 가장 필요한 시점에
                      가장 적합한 정책금융 상품 선제적 연계, 지원 효과성 극대화 및 부실률 감소
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <LineChart className="w-5 h-5 text-purple-600" />
                      데이터 기반 정책 수립
                    </h4>
                    <p className="text-gray-700">
                      익명화된 시뮬레이션 데이터 분석으로 국민의 잠재적 금융 애로사항 과학적 예측,
                      사후 대응에서 사전 예방으로 역할 전환
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack Section */}
        <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                기술 스택
              </h2>
              <p className="text-lg text-blue-100 max-w-3xl mx-auto">
                최신 기술을 활용하여 안전하고 확장 가능한 플랫폼을 구축합니다
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Layers className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Next.js 15</h3>
                  <p className="text-sm text-blue-100">React 기반 풀스택 프레임워크</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Supabase</h3>
                  <p className="text-sm text-blue-100">PostgreSQL 기반 BaaS</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Claude AI</h3>
                  <p className="text-sm text-blue-100">자연어 분석 및 상담</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <LineChart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Recharts</h3>
                  <p className="text-sm text-blue-100">데이터 시각화 라이브러리</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Tailwind CSS</h3>
                  <p className="text-sm text-blue-100">유틸리티 기반 CSS</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">TypeScript</h3>
                  <p className="text-sm text-blue-100">타입 안정성 보장</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Vercel</h3>
                  <p className="text-sm text-blue-100">자동화된 배포 및 호스팅</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">마이데이터 API</h3>
                  <p className="text-sm text-blue-100">금융 데이터 통합</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              무료로 당신만의 금융 디지털 트윈을 만들고
              미래를 예측해보세요
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors font-bold text-xl shadow-2xl"
            >
              무료로 시작하기
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"></div>
                  <span className="text-lg font-bold">금융 디지털트윈</span>
                </div>
                <p className="text-gray-400 text-sm">
                  AI 기반 초개인화 금융 라이프 플래닝 서비스
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">서비스</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><Link href="/dashboard" className="hover:text-white">대시보드</Link></li>
                  <li><Link href="/simulation" className="hover:text-white">시뮬레이션</Link></li>
                  <li><Link href="/chat" className="hover:text-white">AI 상담</Link></li>
                  <li><Link href="/goals" className="hover:text-white">재무 목표</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">정보</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><Link href="/about" className="hover:text-white">프로젝트 소개</Link></li>
                  <li><Link href="/" className="hover:text-white">홈</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-gray-400 text-sm">
                  2025 서민금융진흥원 대국민 혁신 아이디어 공모전 출품작
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Award className="w-4 h-4" />
                  <span>서민금융진흥원 - 서비스 향상 부문</span>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-4 text-center">
                본 서비스는 프로토타입이며, 화면에 표시되는 데이터는 시연용 샘플 데이터입니다.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
