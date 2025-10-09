'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import {
  TrendingUp,
  PieChart,
  LogOut,
  User,
  Settings,
  MessageSquare,
  ArrowLeft,
  Wallet,
  Target,
  Sparkles,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface FinancialGoal {
  id: string;
  user_id: string;
  goal_type: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  status: string;
  created_at: string;
}

export default function GoalsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    goal_type: 'savings',
    title: '',
    target_amount: '',
    current_amount: '0',
    target_date: '',
  });

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

      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        setUser(profile);
        await loadGoals(authUser.id);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGoals = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setGoals(data);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const addGoal = async () => {
    if (!user) return;

    if (!newGoal.title || !newGoal.target_amount || !newGoal.target_date) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .insert([
          {
            user_id: user.id,
            goal_type: newGoal.goal_type,
            title: newGoal.title,
            target_amount: parseFloat(newGoal.target_amount),
            current_amount: parseFloat(newGoal.current_amount),
            target_date: newGoal.target_date,
            status: 'active',
          },
        ])
        .select();

      if (error) throw error;

      if (data) {
        setGoals([...data, ...goals]);
        setShowAddModal(false);
        setNewGoal({
          goal_type: 'savings',
          title: '',
          target_amount: '',
          current_amount: '0',
          target_date: '',
        });
      }
    } catch (error) {
      console.error('Error adding goal:', error);
      alert('목표 추가 중 오류가 발생했습니다.');
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!confirm('이 목표를 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('financial_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      setGoals(goals.filter((g) => g.id !== goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('목표 삭제 중 오류가 발생했습니다.');
    }
  };

  const updateProgress = async (goalId: string, newAmount: string) => {
    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount < 0) return;

    try {
      const { error } = await supabase
        .from('financial_goals')
        .update({ current_amount: amount })
        .eq('id', goalId);

      if (error) throw error;

      setGoals(
        goals.map((g) =>
          g.id === goalId ? { ...g, current_amount: amount } : g
        )
      );
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('진행 상황 업데이트 중 오류가 발생했습니다.');
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  const getProgress = (current: number, target: number): number => {
    if (target === 0) return 0;
    const progress = (current / target) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getGoalIcon = (goalType: string): string => {
    switch (goalType) {
      case 'savings':
        return '💰';
      case 'house':
        return '🏠';
      case 'car':
        return '🚗';
      case 'education':
        return '🎓';
      case 'retirement':
        return '🏖️';
      default:
        return '🎯';
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
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
          <Link href="/dashboard" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg"></div>
            <span className="text-lg font-bold text-gray-900">금융 디지털트윈</span>
          </Link>

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
              className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium"
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

      {/* Main Content */}
      <main className="lg:ml-64 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">재무 목표</h1>
                  <p className="text-gray-600 mt-1">
                    목표를 설정하고 진행 상황을 추적하세요
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                새 목표 추가
              </button>
            </div>
          </div>

          {/* Prototype Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">프로토타입 데모</h3>
                <p className="text-sm text-amber-700">
                  재무 목표 설정 기능입니다. 목표 유형, 금액 설정, 진행 상황 추적 등 목표를 설정하고
                  진행 상황을 관리할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Goals Grid */}
          {goals.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                아직 목표가 없습니다
              </h3>
              <p className="text-gray-600 mb-6">
                첫 번째 재무 목표를 추가해보세요
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                새 목표 추가
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => {
                const progress = getProgress(goal.current_amount, goal.target_amount);
                const remaining = goal.target_amount - goal.current_amount;

                return (
                  <div
                    key={goal.id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getGoalIcon(goal.goal_type)}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                          <p className="text-sm text-gray-600">
                            목표일: {new Date(goal.target_date).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>진행률</span>
                        <span className="font-semibold text-blue-600">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Amounts */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">현재</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(goal.current_amount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">목표</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(goal.target_amount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">남은 금액</span>
                        <span className="font-semibold text-blue-600">
                          {formatCurrency(remaining)}
                        </span>
                      </div>
                    </div>

                    {/* Update Progress */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        진행 상황 업데이트
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          defaultValue={goal.current_amount}
                          onBlur={(e) => updateProgress(goal.id, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="현재 금액"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">새 목표 추가</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    목표 유형
                  </label>
                  <select
                    value={newGoal.goal_type}
                    onChange={(e) => setNewGoal({ ...newGoal, goal_type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="savings">저축 💰</option>
                    <option value="house">주택 구매 🏠</option>
                    <option value="car">자동차 구매 🚗</option>
                    <option value="education">교육 🎓</option>
                    <option value="retirement">은퇴 🏖️</option>
                    <option value="other">기타 🎯</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    목표 이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="예: 내 집 마련"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    목표 금액 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newGoal.target_amount}
                    onChange={(e) => setNewGoal({ ...newGoal, target_amount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="10000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    현재 금액
                  </label>
                  <input
                    type="number"
                    value={newGoal.current_amount}
                    onChange={(e) => setNewGoal({ ...newGoal, current_amount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    목표 달성 날짜 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newGoal.target_date}
                    onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={addGoal}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
