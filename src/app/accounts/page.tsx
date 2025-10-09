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
  Building2,
  CreditCard,
  Landmark,
  Wallet,
  Plus,
  RefreshCw,
  CheckCircle,
  ChevronRight,
  Shield,
  Target,
  Sparkles,
  MapPin,
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface BankConnection {
  id: string;
  bankName: string;
  bankLogo: string;
  accountCount: number;
  lastSync: string;
  status: 'connected' | 'error' | 'syncing';
}

const AVAILABLE_BANKS = [
  { id: 'kb', name: 'KB국민은행', logo: '🏦', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'shinhan', name: '신한은행', logo: '🏦', color: 'bg-blue-100 text-blue-700' },
  { id: 'woori', name: '우리은행', logo: '🏦', color: 'bg-cyan-100 text-cyan-700' },
  { id: 'hana', name: '하나은행', logo: '🏦', color: 'bg-green-100 text-green-700' },
  { id: 'nh', name: 'NH농협은행', logo: '🏦', color: 'bg-lime-100 text-lime-700' },
  { id: 'kakao', name: '카카오뱅크', logo: '💛', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'toss', name: '토스뱅크', logo: '💙', color: 'bg-blue-100 text-blue-700' },
  { id: 'kbank', name: '케이뱅크', logo: '💚', color: 'bg-teal-100 text-teal-700' },
];

const CARD_COMPANIES = [
  { id: 'samsung', name: '삼성카드', logo: '💳', color: 'bg-blue-100 text-blue-700' },
  { id: 'hyundai', name: '현대카드', logo: '💳', color: 'bg-purple-100 text-purple-700' },
  { id: 'shinhan-card', name: '신한카드', logo: '💳', color: 'bg-blue-100 text-blue-700' },
  { id: 'kb-card', name: 'KB국민카드', logo: '💳', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'woori-card', name: '우리카드', logo: '💳', color: 'bg-cyan-100 text-cyan-700' },
  { id: 'hana-card', name: '하나카드', logo: '💳', color: 'bg-green-100 text-green-700' },
];

export default function AccountsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState<BankConnection[]>([]);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    checkUser();
    loadConnections();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/auth/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        setUser(profile);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConnections = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: accounts } = await supabase
        .from('financial_accounts')
        .select('*')
        .eq('user_id', authUser.id);

      if (accounts) {
        // Group by institution
        const grouped = accounts.reduce((acc: Array<BankConnection>, account: { institution_name: string; account_type: string; updated_at: string }) => {
          const existing = acc.find((g) => g.bankName === account.institution_name);
          if (existing) {
            existing.accountCount++;
          } else {
            acc.push({
              id: account.institution_name,
              bankName: account.institution_name,
              bankLogo: account.account_type === 'bank' ? '🏦' : '💳',
              accountCount: 1,
              lastSync: account.updated_at,
              status: 'connected' as const,
            });
          }
          return acc;
        }, []);

        setConnections(grouped);
      }
    } catch (error) {
      console.error('Error loading connections:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const connectBank = async (bank: { id: string; name: string }) => {
    setConnecting(true);
    setShowBankModal(false);

    // Simulate authentication flow
    setTimeout(async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        // Create mock bank accounts
        const mockAccounts = [
          {
            user_id: authUser.id,
            account_type: 'bank',
            institution_name: bank.name,
            account_number: `***-***-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            balance: Math.floor(Math.random() * 10000000) + 1000000,
            currency: 'KRW',
            metadata: { connected_via: 'mydata', bank_code: bank.id },
          },
        ];

        const { error } = await supabase
          .from('financial_accounts')
          .insert(mockAccounts);

        if (error) throw error;

        // Generate mock transactions
        await generateMockTransactions(authUser.id);

        await loadConnections();
        alert(`${bank.name} 연동이 완료되었습니다!`);
      } catch (error) {
        console.error('Error connecting bank:', error);
        alert('계좌 연동에 실패했습니다.');
      } finally {
        setConnecting(false);
      }
    }, 2000);
  };

  const connectCard = async (card: { id: string; name: string }) => {
    setConnecting(true);
    setShowCardModal(false);

    setTimeout(async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        const mockCard = {
          user_id: authUser.id,
          account_type: 'card',
          institution_name: card.name,
          account_number: `****-****-****-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          balance: -Math.floor(Math.random() * 1000000),
          currency: 'KRW',
          metadata: { connected_via: 'mydata', card_code: card.id },
        };

        const { error } = await supabase
          .from('financial_accounts')
          .insert([mockCard]);

        if (error) throw error;

        await generateMockTransactions(authUser.id);
        await loadConnections();
        alert(`${card.name} 연동이 완료되었습니다!`);
      } catch (error) {
        console.error('Error connecting card:', error);
        alert('카드 연동에 실패했습니다.');
      } finally {
        setConnecting(false);
      }
    }, 2000);
  };

  const generateMockTransactions = async (userId: string) => {
    // Get user's accounts
    const { data: accounts } = await supabase
      .from('financial_accounts')
      .select('*')
      .eq('user_id', userId);

    if (!accounts || accounts.length === 0) return;

    const categories = ['식비', '교통', '쇼핑', '공과금', '여가', '기타'];
    const merchants = [
      '스타벅스', '이마트', '쿠팡', 'GS25', '맥도날드',
      '카카오택시', '지하철', '버스', '넷플릭스', '유튜브프리미엄'
    ];

    const transactions = [];
    const now = new Date();

    // Generate 30 transactions for the last 30 days
    for (let i = 0; i < 30; i++) {
      const account = accounts[Math.floor(Math.random() * accounts.length)];
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      transactions.push({
        user_id: userId,
        account_id: account.id,
        transaction_date: date.toISOString(),
        amount: -Math.floor(Math.random() * 50000) - 5000,
        category: categories[Math.floor(Math.random() * categories.length)],
        description: merchants[Math.floor(Math.random() * merchants.length)],
        merchant_name: merchants[Math.floor(Math.random() * merchants.length)],
      });
    }

    await supabase.from('transactions').insert(transactions);
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
              className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium"
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
        <div className="max-w-4xl mx-auto">
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
                <h1 className="text-3xl font-bold text-gray-900">계좌 관리</h1>
                <p className="text-gray-600 mt-1">
                  MyData로 금융 계좌를 안전하게 연동하세요
                </p>
              </div>
            </div>
          </div>

          {/* Prototype Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">🚧</span>
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">프로토타입 데모</h3>
                <p className="text-sm text-amber-700">
                  현재는 실제 MyData API 대신 시뮬레이션된 계좌 연동을 제공합니다.
                  계좌를 연동하면 샘플 거래 데이터가 자동으로 생성됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* MyData Info Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  안전한 MyData 연동 (향후 구현)
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  실제 서비스에서는 금융결제원의 MyData 표준 API를 통해 안전하게 계좌 정보를 가져옵니다.
                  계좌 비밀번호는 저장되지 않으며, 언제든지 연동을 해제할 수 있습니다.
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>🔒 엔드투엔드 암호화</span>
                  <span>✅ 금융위원회 인증</span>
                  <span>🛡️ 개인정보 보호</span>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Accounts */}
          {connections.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                연동된 계좌 ({connections.length})
              </h2>
              <div className="space-y-3">
                {connections.map((conn) => (
                  <div
                    key={conn.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{conn.bankLogo}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{conn.bankName}</h3>
                        <p className="text-sm text-gray-600">
                          {conn.accountCount}개 계좌 • 마지막 동기화: {new Date(conn.lastSync).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {conn.status === 'connected' && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Account Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => setShowBankModal(true)}
              className="w-full flex items-center justify-between p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">은행 계좌 연동</h3>
                  <p className="text-sm text-gray-600">은행 계좌를 연동하여 잔액과 거래내역을 확인하세요</p>
                </div>
              </div>
              <Plus className="w-6 h-6 text-gray-400" />
            </button>

            <button
              onClick={() => setShowCardModal(true)}
              className="w-full flex items-center justify-between p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">카드 연동</h3>
                  <p className="text-sm text-gray-600">신용카드/체크카드를 연동하여 사용내역을 확인하세요</p>
                </div>
              </div>
              <Plus className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>
      </main>

      {/* Bank Selection Modal */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">은행 선택</h2>
              <p className="text-gray-600 mt-1">연동할 은행을 선택하세요</p>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_BANKS.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => connectBank(bank)}
                    disabled={connecting}
                    className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className={`w-10 h-10 ${bank.color} rounded-lg flex items-center justify-center text-xl`}>
                      {bank.logo}
                    </div>
                    <span className="font-medium text-gray-900">{bank.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowBankModal(false)}
                disabled={connecting}
                className="w-full py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Selection Modal */}
      {showCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">카드사 선택</h2>
              <p className="text-gray-600 mt-1">연동할 카드사를 선택하세요</p>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-3">
                {CARD_COMPANIES.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => connectCard(card)}
                    disabled={connecting}
                    className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center text-xl`}>
                      {card.logo}
                    </div>
                    <span className="font-medium text-gray-900">{card.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCardModal(false)}
                disabled={connecting}
                className="w-full py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connecting Overlay */}
      {connecting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">계좌 연동 중</h3>
            <p className="text-gray-600">
              금융기관과 안전하게 연결하고 있습니다...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
