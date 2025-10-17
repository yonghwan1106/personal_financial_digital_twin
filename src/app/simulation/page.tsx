'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import {
  TrendingUp,
  PieChart,
  Menu,
  LogOut,
  User,
  Settings,
  MessageSquare,
  Plus,
  Calendar,
  DollarSign,
  AlertTriangle,
  Lightbulb,
  Play,
  Save,
  ArrowLeft,
  Wallet,
  Target,
  Sparkles,
  MapPin,
} from 'lucide-react';
import Logo from '@/components/Logo';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface SimulationEvent {
  id: string;
  event_type: string;
  title: string;
  year_offset: number;
  one_time_cost?: number;
  monthly_income_change?: number;
  monthly_expense_change?: number;
}

export default function SimulationPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);

  // Simulation parameters
  const [simulationYears, setSimulationYears] = useState(10);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [incomeGrowthRate, setIncomeGrowthRate] = useState(3.0);
  const [investmentReturnRate, setInvestmentReturnRate] = useState(5.0);
  const [events, setEvents] = useState<SimulationEvent[]>([]);

  // Results
  const [projectionData, setProjectionData] = useState<any[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUser(profile);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const addEvent = (eventType: string, title: string) => {
    const newEvent: SimulationEvent = {
      id: Math.random().toString(36).substr(2, 9),
      event_type: eventType,
      title,
      year_offset: 1,
      one_time_cost: 0,
      monthly_income_change: 0,
      monthly_expense_change: 0,
    };
    setEvents([...events, newEvent]);
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const updateEvent = (id: string, field: string, value: any) => {
    setEvents(events.map(e =>
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  const runSimulation = async () => {
    setSimulating(true);

    try {
      // Call Claude API for simulation
      const response = await fetch('/api/simulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          simulationYears,
          inflationRate,
          incomeGrowthRate,
          investmentReturnRate,
          events,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setProjectionData(data.projectionData);
        setRiskAlerts(data.analysis.riskAlerts || []);
        setRecommendations(data.analysis.recommendations || []);
        setSimulationComplete(true);
      } else {
        alert('시뮬레이션 실패: ' + data.error);
      }
    } catch (error) {
      console.error('Simulation error:', error);
      alert('시뮬레이션 중 오류가 발생했습니다.');
    } finally {
      setSimulating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 hidden lg:block">
        <div className="p-6">
          <div className="mb-8">
            <Logo variant="compact" />
          </div>

          <nav className="space-y-2">
            <Link
              href="/about"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg border-b border-gray-100 mb-2"
            >
              <Sparkles className="w-5 h-5" />
              프로젝트 소개
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <PieChart className="w-5 h-5" />
              대시보드
            </Link>
            <Link
              href="/accounts"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Wallet className="w-5 h-5" />
              계좌 관리
            </Link>
            <Link
              href="/goals"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Target className="w-5 h-5" />
              재무 목표
            </Link>
            <Link
              href="/simulation"
              className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium"
            >
              <TrendingUp className="w-5 h-5" />
              시뮬레이션
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <MessageSquare className="w-5 h-5" />
              AI 상담
            </Link>
            <Link
              href="/location"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <MapPin className="w-5 h-5" />
              위치 기반 분석
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Settings className="w-5 h-5" />
              설정
            </Link>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link
                href="/dashboard"
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">미래 재무 시뮬레이션</h1>
                <p className="text-gray-600 mt-1">
                  AI가 당신의 미래 재무 상황을 예측합니다
                </p>
              </div>
            </div>

            {/* AI Powered Notice */}
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700">
                ✨ <strong>Claude AI 연동:</strong> 이제 실제 Claude AI가 재무 상황을 분석하고
                맞춤형 추천을 제공합니다!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Simulation Settings */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  시뮬레이션 설정
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      시뮬레이션 기간
                    </label>
                    <input
                      type="number"
                      value={simulationYears}
                      onChange={(e) => setSimulationYears(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      min="1"
                      max="30"
                    />
                    <p className="text-xs text-gray-500 mt-1">{simulationYears}년</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      물가 상승률 (%)
                    </label>
                    <input
                      type="number"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      소득 증가율 (%)
                    </label>
                    <input
                      type="number"
                      value={incomeGrowthRate}
                      onChange={(e) => setIncomeGrowthRate(parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      투자 수익률 (%)
                    </label>
                    <input
                      type="number"
                      value={investmentReturnRate}
                      onChange={(e) => setInvestmentReturnRate(parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>

              {/* Life Events */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  인생 이벤트 추가
                </h2>

                <div className="space-y-2 mb-4">
                  <button
                    onClick={() => addEvent('marriage', '결혼')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200"
                  >
                    💒 결혼
                  </button>
                  <button
                    onClick={() => addEvent('childbirth', '출산')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200"
                  >
                    👶 출산
                  </button>
                  <button
                    onClick={() => addEvent('house_purchase', '주택 구매')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200"
                  >
                    🏠 주택 구매
                  </button>
                  <button
                    onClick={() => addEvent('career_change', '이직')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200"
                  >
                    💼 이직
                  </button>
                </div>

                {events.length > 0 && (
                  <div className="space-y-3 mt-4">
                    {events.map((event) => (
                      <div key={event.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-gray-900">{event.title}</span>
                          <button
                            onClick={() => removeEvent(event.id)}
                            className="text-red-600 text-sm hover:text-red-700"
                          >
                            삭제
                          </button>
                        </div>
                        <div className="space-y-2">
                          <input
                            type="number"
                            value={event.year_offset}
                            onChange={(e) => updateEvent(event.id, 'year_offset', parseInt(e.target.value))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="발생 시점 (년)"
                            min="0"
                          />
                          <input
                            type="number"
                            value={event.one_time_cost || 0}
                            onChange={(e) => updateEvent(event.id, 'one_time_cost', parseInt(e.target.value))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="일회성 비용 (원)"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={runSimulation}
                disabled={simulating}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {simulating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    시뮬레이션 중...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    시뮬레이션 실행
                  </>
                )}
              </button>
            </div>

            {/* Results */}
            <div className="lg:col-span-2 space-y-6">
              {!simulationComplete ? (
                <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    시뮬레이션을 실행하세요
                  </h3>
                  <p className="text-gray-600">
                    왼쪽 설정을 조정하고 시뮬레이션 버튼을 눌러주세요
                  </p>
                </div>
              ) : (
                <>
                  {/* Projection Chart */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      순자산 예측
                    </h2>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={projectionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="year" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="netWorth"
                          stroke="#3B82F6"
                          strokeWidth={3}
                          name="순자산"
                          dot={{ fill: '#3B82F6', r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Risk Alerts */}
                  {riskAlerts.length > 0 && (
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        위험 요소
                      </h2>
                      <div className="space-y-3">
                        {riskAlerts.map((alert, index) => (
                          <div key={index} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-2">{alert.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                            <p className="text-xs text-orange-600">발생 예상: {alert.occurs_at}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {recommendations.length > 0 && (
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        AI 추천
                      </h2>
                      <div className="space-y-3">
                        {recommendations.map((rec, index) => (
                          <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                                rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {rec.priority === 'high' ? '높음' : rec.priority === 'medium' ? '중간' : '낮음'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                            <p className="text-xs text-blue-600 font-medium">
                              예상 효과: {rec.estimated_impact}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
