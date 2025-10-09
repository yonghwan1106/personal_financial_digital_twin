'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import {
  Sparkles,
  Database,
  Brain,
  Target,
  TrendingUp,
  Shield,
  Users,
  Zap,
  Check,
  Globe,
  LineChart,
  Layers,
  BarChart3,
  MessageSquare,
  Wallet,
  Award,
  Menu,
  LogOut,
  User,
  Settings,
  Home,
  CreditCard,
  PieChart,
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export default function AboutPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/auth/login');
        return;
      }

      setUser({
        id: authUser.id,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        email: authUser.email || '',
      });
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200">
        <div className="flex items-center gap-2 p-6 border-b border-gray-200">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"></div>
          <span className="text-lg font-bold text-gray-900">금융 디지털트윈</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">대시보드</span>
          </Link>

          <Link
            href="/accounts"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            <span className="font-medium">계좌 관리</span>
          </Link>

          <Link
            href="/goals"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Target className="w-5 h-5" />
            <span className="font-medium">재무 목표</span>
          </Link>

          <Link
            href="/simulation"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <PieChart className="w-5 h-5" />
            <span className="font-medium">미래 시뮬레이션</span>
          </Link>

          <Link
            href="/chat"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">AI 상담</span>
          </Link>

          <Link
            href="/about"
            className="flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">서비스 소개</span>
          </Link>

          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">설정</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          <Menu className="w-6 h-6 text-gray-900" />
        </button>
      </div>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <aside className="w-64 h-full bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 p-6 border-b border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"></div>
              <span className="text-lg font-bold text-gray-900">금융 디지털트윈</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
                <Home className="w-5 h-5" />
                <span>대시보드</span>
              </Link>
              <Link href="/accounts" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
                <CreditCard className="w-5 h-5" />
                <span>계좌 관리</span>
              </Link>
              <Link href="/goals" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
                <Target className="w-5 h-5" />
                <span>재무 목표</span>
              </Link>
              <Link href="/simulation" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
                <PieChart className="w-5 h-5" />
                <span>미래 시뮬레이션</span>
              </Link>
              <Link href="/chat" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
                <MessageSquare className="w-5 h-5" />
                <span>AI 상담</span>
              </Link>
              <Link href="/about" className="flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg">
                <Sparkles className="w-5 h-5" />
                <span>서비스 소개</span>
              </Link>
              <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
                <Settings className="w-5 h-5" />
                <span>설정</span>
              </Link>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">2025 서민금융진흥원 대국민 혁신 아이디어 공모전 출품작</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              AI 기반 개인 금융 디지털 트윈 구축을 통한<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                초개인화 금융 라이프 플래닝 서비스
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl">
              모든 국민이 자신의 금융 생활에 대한 '디지털 쌍둥이'를 가질 수 있도록,
              미래를 예측하고 시뮬레이션하며 현명한 의사결정을 지원하는 금융 인생 내비게이션
            </p>
          </div>

          {/* Background & Purpose Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">추진 배경 및 목적</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Problem */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-100">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">현황 및 문제점</h3>
                <ul className="space-y-3 text-gray-700 text-sm">
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
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">기술적 가능성</h3>
                <ul className="space-y-3 text-gray-700 text-sm">
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
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">추진 목적</h3>
                <ul className="space-y-3 text-gray-700 text-sm">
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
          </section>

          {/* Key Features Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">3단계 핵심 기능</h2>

            <div className="space-y-6">
              {/* Stage 1 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center">
                      <Database className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                        1단계
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">
                        데이터 통합 - Digital Twin 생성
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-blue-600" />
                          마이데이터 연동
                        </h4>
                        <ul className="space-y-1.5 text-gray-700">
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>은행, 카드, 대출, 보험, 투자 등 모든 금융 정보 API 연동</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>통합된 재무 현황 대시보드 실시간 제공</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-600" />
                          공공 마이데이터 활용
                        </h4>
                        <ul className="space-y-1.5 text-gray-700">
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>국세청, 국민연금공단 등 공공기관 데이터 연동</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>소득, 세금, 연금 정보 결합으로 정확성 향상</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl flex items-center justify-center">
                      <Brain className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                        2단계
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">
                        AI 예측 및 시뮬레이션
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-purple-600" />
                          인생 이벤트 시뮬레이션
                        </h4>
                        <ul className="space-y-1.5 text-gray-700">
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>주택 구매, 결혼, 자녀 출산 등 주요 이벤트 선택</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>미래 현금 흐름 및 순자산 장기 예측</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-purple-600" />
                          자연어 시나리오 분석
                        </h4>
                        <ul className="space-y-1.5 text-gray-700">
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>채팅으로 자연어 질문 입력</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>AI가 의도 파악 후 즉시 시뮬레이션</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-purple-600" />
                          위험 예측 및 조기 경보
                        </h4>
                        <ul className="space-y-1.5 text-gray-700">
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>유동성 부족, DSR 급등 등 위험 징후 감지</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>즉시 경고 알림 및 원인 상세 설명</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-400 rounded-xl flex items-center justify-center">
                      <Target className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                        3단계
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">
                        맞춤형 솔루션 제시
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-green-600" />
                          AI 컨설팅 및 솔루션 제안
                        </h4>
                        <ul className="space-y-1.5 text-gray-700">
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>재무 상태 및 예측 위험 기반 맞춤형 전략</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>부채 상환 순서, 저축 증액 방안 제시</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-green-600" />
                          서민금융 상품 연계
                        </h4>
                        <ul className="space-y-1.5 text-gray-700">
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>채무 부담, 긴급 자금 필요 시 자동 감지</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>서민금융진흥원 맞춤형 정책금융상품 추천</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Expected Benefits Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">기대 효과</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Public Benefits */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">대국민 효과</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      예측 기반의 선제적 재무 관리
                    </h4>
                    <p className="text-gray-700">
                      과거 데이터 조회에서 벗어나 미래를 예측하고 시뮬레이션하며
                      위험에 미리 대비하는 능동적·선제적 재무 관리 실현
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-blue-600" />
                      금융 의사결정 능력 향상
                    </h4>
                    <p className="text-gray-700">
                      게임처럼 시뮬레이션하며 학습함으로써 청년 및 금융 취약계층의
                      금융 이해력 향상과 합리적 의사결정 능력 배양
                    </p>
                  </div>
                </div>
              </div>

              {/* Institutional Benefits */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">서민금융진흥원 효과</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      초개인화 서비스 제공
                    </h4>
                    <p className="text-gray-700">
                      모든 국민에게 'AI 금융 주치의' 제공으로 단순 자금 지원을 넘어
                      금융 인생 전반을 함께 설계하는 동반자로서의 위상 정립
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <LineChart className="w-4 h-4 text-purple-600" />
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
          </section>

          {/* Technology Stack Section */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">기술 스택</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-base mb-1">Next.js 15</h3>
                  <p className="text-xs text-gray-600">React 프레임워크</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-300 transition-colors">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-base mb-1">Supabase</h3>
                  <p className="text-xs text-gray-600">BaaS 플랫폼</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 transition-colors">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-base mb-1">Claude AI</h3>
                  <p className="text-xs text-gray-600">AI 분석</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-300 transition-colors">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <LineChart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-base mb-1">Recharts</h3>
                  <p className="text-xs text-gray-600">데이터 시각화</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
