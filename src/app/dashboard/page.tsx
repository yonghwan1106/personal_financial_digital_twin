'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Target,
  Sparkles,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
  LogOut,
  User,
  Settings,
  MessageSquare,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface DashboardStats {
  net_worth: number;
  monthly_income: number;
  monthly_expenses: number;
  savings_rate: number;
  total_assets: number;
  total_liabilities: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock data - 실제로는 Supabase에서 가져옴
  const [stats] = useState<DashboardStats>({
    net_worth: 45000000,
    monthly_income: 3500000,
    monthly_expenses: 2100000,
    savings_rate: 40,
    total_assets: 50000000,
    total_liabilities: 5000000,
  });

  // 월별 순자산 추이 데이터
  const netWorthTrend = [
    { month: '1월', value: 38000000 },
    { month: '2월', value: 39500000 },
    { month: '3월', value: 41000000 },
    { month: '4월', value: 42200000 },
    { month: '5월', value: 43500000 },
    { month: '6월', value: 45000000 },
  ];

  // 카테고리별 지출 데이터
  const expensesByCategory = [
    { name: '식비', value: 600000, color: '#3B82F6' },
    { name: '교통', value: 300000, color: '#10B981' },
    { name: '쇼핑', value: 400000, color: '#F59E0B' },
    { name: '공과금', value: 200000, color: '#EF4444' },
    { name: '여가', value: 300000, color: '#8B5CF6' },
    { name: '기타', value: 300000, color: '#6B7280' },
  ];

  // 월별 수입/지출 비교
  const incomeVsExpenses = [
    { month: '1월', income: 3500000, expenses: 2000000 },
    { month: '2월', income: 3500000, expenses: 2200000 },
    { month: '3월', income: 3500000, expenses: 1900000 },
    { month: '4월', income: 3500000, expenses: 2100000 },
    { month: '5월', income: 3500000, expenses: 2000000 },
    { month: '6월', income: 3500000, expenses: 2100000 },
  ];

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

      // Get profile
      let { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      // If profile doesn't exist, create it
      if (!profile && fetchError) {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: authUser.id,
            email: authUser.email!,
            name: authUser.user_metadata.name || authUser.email!.split('@')[0],
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          throw createError;
        }

        profile = newProfile;
      }

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
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
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg"></div>
            <span className="text-lg font-bold text-gray-900">금융 디지털트윈</span>
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
              className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium"
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
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
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

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg"></div>
            <span className="text-lg font-bold text-gray-900">금융 디지털트윈</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-0 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Prototype Banner */}
          <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚧</span>
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">
                  프로토타입 데모 버전
                </h3>
                <p className="text-sm text-amber-700">
                  이 서비스는 서민금융진흥원 공모전 출품용 프로토타입입니다.
                  현재 화면의 데이터는 시연을 위한 샘플 데이터이며, 실제 금융 데이터가 아닙니다.
                </p>
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              안녕하세요, {user?.name}님 👋
            </h1>
            <p className="text-gray-600">
              오늘의 재무 현황을 확인해보세요
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-green-600 flex items-center gap-1 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  12.5%
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">순자산</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.net_worth)}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-green-600 flex items-center gap-1 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  5.2%
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">월 수입</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.monthly_income)}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-red-600 flex items-center gap-1 text-sm font-medium">
                  <ArrowDownRight className="w-4 h-4" />
                  3.1%
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">월 지출</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.monthly_expenses)}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-green-600 flex items-center gap-1 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  2.8%
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">저축률</p>
              <p className="text-2xl font-bold text-gray-900">{stats.savings_rate}%</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Net Worth Trend */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                순자산 추이
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={netWorthTrend} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Income vs Expenses */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                수입 vs 지출
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incomeVsExpenses} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="#10B981" name="수입" />
                  <Bar dataKey="expenses" fill="#EF4444" name="지출" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expenses by Category */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                카테고리별 지출
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: { name?: string; percent?: number }) => `${props.name || ''} ${props.percent ? (props.percent * 100).toFixed(0) : '0'}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </RePieChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                빠른 실행
              </h2>
              <div className="space-y-3">
                <Link
                  href="/simulation"
                  className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">미래 시뮬레이션</span>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-blue-600" />
                </Link>

                <Link
                  href="/chat"
                  className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">AI 재무 상담</span>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-purple-600" />
                </Link>

                <Link
                  href="/goals"
                  className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">목표 설정</span>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-green-600" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
