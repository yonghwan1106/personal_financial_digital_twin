import Link from 'next/link';
import { ArrowRight, TrendingUp, Shield, Sparkles, Target } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">나의 금융 디지털트윈</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-gray-600 hover:text-gray-900">
              주요 기능
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900">
              이용 방법
            </Link>
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
              로그인
            </Link>
            <Link
              href="/auth/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              시작하기
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            서민금융진흥원 대국민 혁신 아이디어 공모전 출품작
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AI로 예측하는
            <br />
            <span className="text-blue-600">나의 금융 미래</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            디지털트윈 기술과 AI가 만나 당신의 재무 상태를 실시간으로 분석하고
            <br />
            미래 재무 상황을 시뮬레이션합니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              무료로 시작하기
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 transition-colors"
            >
              자세히 알아보기
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              주요 기능
            </h2>
            <p className="text-lg text-gray-600">
              당신의 금융 생활을 혁신할 핵심 기능들
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                실시간 재무 현황
              </h3>
              <p className="text-gray-600">
                MyData 연동으로 모든 금융 계좌를 한눈에 확인하고 실시간으로 추적합니다
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI 미래 시뮬레이션
              </h3>
              <p className="text-gray-600">
                결혼, 출산, 주택 구매 등 인생 이벤트에 따른 재무 상황을 AI가 예측합니다
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                맞춤형 솔루션 추천
              </h3>
              <p className="text-gray-600">
                서민금융진흥원의 금융 상품을 분석하여 당신에게 최적화된 상품을 추천합니다
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                안전한 데이터 관리
              </h3>
              <p className="text-gray-600">
                엔드투엔드 암호화와 최신 보안 기술로 당신의 금융 정보를 안전하게 보호합니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              이용 방법
            </h2>
            <p className="text-lg text-gray-600">
              3단계로 시작하는 금융 디지털트윈
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                계정 생성 및 데이터 연동
              </h3>
              <p className="text-gray-600">
                간편하게 회원가입하고 MyData를 통해 금융 계좌를 연동하세요
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                재무 현황 확인
              </h3>
              <p className="text-gray-600">
                대시보드에서 실시간 재무 상태, DSR, 저축률 등을 한눈에 확인하세요
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                미래 시뮬레이션
              </h3>
              <p className="text-gray-600">
                AI와 대화하며 다양한 시나리오를 시뮬레이션하고 최적의 재무 전략을 수립하세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            무료로 당신의 금융 미래를 설계해보세요
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            무료로 시작하기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg"></div>
                <span className="text-white font-bold">나의 금융 디지털트윈</span>
              </div>
              <p className="text-sm">
                AI 기반 개인 재무 관리 플랫폼
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    대시보드
                  </Link>
                </li>
                <li>
                  <Link href="/simulation" className="hover:text-white">
                    시뮬레이션
                  </Link>
                </li>
                <li>
                  <Link href="/chat" className="hover:text-white">
                    AI 상담
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    소개
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    블로그
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    문의
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">법적 고지</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    이용약관
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    개인정보처리방침
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>© 2025 나의 금융 디지털트윈. 서민금융진흥원 대국민 혁신 아이디어 공모전 출품작.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
