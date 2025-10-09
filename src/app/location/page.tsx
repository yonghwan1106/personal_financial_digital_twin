'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Script from 'next/script';
import {
  MapPin,
  TrendingUp,
  PieChart,
  Home,
  LogOut,
  User,
  Settings,
  MessageSquare,
  Target,
  Wallet,
  CreditCard,
  Sparkles,
  Navigation,
  Store,
  Coffee,
  ShoppingBag,
} from 'lucide-react';

// Kakao Maps 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface LocationData {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  placeName: string;
  placeCategory: string;
  district: string;
  city: string;
  amount: number;
  transactionDate: string;
}

interface DistrictStat {
  district: string;
  amount: number;
  count: number;
}

interface CategoryStat {
  category: string;
  amount: number;
  count: number;
}

export default function LocationPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [topDistricts, setTopDistricts] = useState<DistrictStat[]>([]);
  const [topCategories, setTopCategories] = useState<CategoryStat[]>([]);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    checkUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/auth/login');
        return;
      }

      setUser({
        id: authUser.id,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        email: authUser.email || '',
      });

      // 위치 데이터 로드
      await loadLocationData();
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const loadLocationData = async () => {
    try {
      const response = await fetch('/api/location/spending-map');
      const data = await response.json();

      console.log('Location data loaded:', data);

      if (data.success) {
        setLocations(data.locations || []);
        setTopDistricts(data.stats?.topDistricts || []);
        setTopCategories(data.stats?.topCategories || []);
        console.log('Locations set:', data.locations?.length);
      }
    } catch (error) {
      console.error('Error loading location data:', error);
    }
  };

  // 카카오맵 초기화
  const initializeMap = () => {
    console.log('Initializing map...', {
      mapRef: !!mapRef.current,
      kakao: !!window.kakao,
      kakaoMaps: !!window.kakao?.maps,
      locationsLength: locations.length
    });

    if (!mapRef.current || !window.kakao || !window.kakao.maps) {
      console.log('Map initialization failed - missing requirements');
      return;
    }

    const { kakao } = window;

    // 서울 시청을 기본 중심으로 설정
    const defaultCenter = new kakao.maps.LatLng(37.5665, 126.9780);

    const mapOption = {
      center: defaultCenter,
      level: 5, // 지도 확대 레벨
      mapTypeId: kakao.maps.MapTypeId.ROADMAP, // 로드맵 타입 명시
    };

    // 지도 생성
    console.log('Creating map...');
    const map = new kakao.maps.Map(mapRef.current, mapOption);
    mapInstance.current = map;
    console.log('Map created successfully');

    // 지도 타입 컨트롤 추가
    const mapTypeControl = new kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    // 줌 컨트롤 추가
    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    // 마커 추가
    if (locations.length > 0) {
      // 첫 번째 위치로 지도 중심 이동
      const firstLocation = locations[0];
      const centerPosition = new kakao.maps.LatLng(
        firstLocation.latitude,
        firstLocation.longitude
      );
      map.setCenter(centerPosition);

      // 각 위치에 마커 추가
      locations.forEach((location) => {
        const markerPosition = new kakao.maps.LatLng(
          location.latitude,
          location.longitude
        );

        const marker = new kakao.maps.Marker({
          position: markerPosition,
          map: map,
        });

        // 인포윈도우 생성
        const infowindowContent = `
          <div style="padding: 10px; min-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 5px;">${location.placeName}</h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 3px;">${location.address}</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 3px;">${location.placeCategory}</p>
            <p style="font-weight: bold; color: #3b82f6;">${formatCurrency(location.amount)}</p>
          </div>
        `;

        const infowindow = new kakao.maps.InfoWindow({
          content: infowindowContent,
        });

        // 마커 클릭 이벤트
        kakao.maps.event.addListener(marker, 'click', () => {
          infowindow.open(map, marker);
        });
      });
    }
  };

  // 카카오맵 스크립트 로드 완료 후 실행
  useEffect(() => {
    console.log('Map effect triggered:', { kakaoLoaded, locationsLength: locations.length });
    if (kakaoLoaded && locations.length > 0) {
      initializeMap();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kakaoLoaded, locations]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(Math.abs(amount));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '카페':
        return <Coffee className="w-4 h-4" />;
      case '쇼핑':
        return <ShoppingBag className="w-4 h-4" />;
      case '음식점':
        return <Store className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '카페':
        return 'bg-amber-100 text-amber-700';
      case '쇼핑':
        return 'bg-blue-100 text-blue-700';
      case '음식점':
        return 'bg-green-100 text-green-700';
      case '편의점':
        return 'bg-purple-100 text-purple-700';
      case '교통':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
    <>
      {/* Kakao Maps SDK 로드 */}
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Kakao script loaded');
          window.kakao.maps.load(() => {
            console.log('Kakao maps API loaded');
            setKakaoLoaded(true);
          });
        }}
        onError={(e) => {
          console.error('Failed to load Kakao Maps script:', e);
        }}
      />

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
              <Home className="w-5 h-5" />
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
              href="/location"
              className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium"
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">위치 기반 소비 분석</h1>
            <p className="text-gray-600">
              지도에서 소비 패턴을 확인하고 지역별 소비 현황을 분석하세요
            </p>
          </div>

          {/* Map Integration Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-xl">🗺️</span>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Kakao Maps 연동 완료</h3>
                <p className="text-sm text-blue-700">
                  실제 거래 내역을 기반으로 한 위치 데이터가 지도에 표시됩니다.
                  마커를 클릭하여 상세 정보를 확인하세요.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">총 거래 위치</p>
                  <p className="text-2xl font-bold text-gray-900">{locations.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">주요 활동 지역</p>
                  <p className="text-2xl font-bold text-gray-900">{topDistricts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">소비 카테고리</p>
                  <p className="text-2xl font-bold text-gray-900">{topCategories.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Districts */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">지역별 소비 순위</h2>
              <div className="space-y-4">
                {topDistricts.map((district, index) => (
                  <div key={district.district} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : index === 1
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{district.district}</p>
                        <p className="text-sm text-gray-600">{district.count}건의 거래</p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900">{formatCurrency(district.amount)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">카테고리별 소비 순위</h2>
              <div className="space-y-4">
                {topCategories.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${getCategoryColor(category.category)}`}
                      >
                        {getCategoryIcon(category.category)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{category.category}</p>
                        <p className="text-sm text-gray-600">{category.count}건의 거래</p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900">{formatCurrency(category.amount)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kakao Map */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">소비 지도</h2>
            {!kakaoLoaded ? (
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">지도를 불러오는 중...</p>
                </div>
              </div>
            ) : (
              <div
                ref={mapRef}
                className="w-full h-96 rounded-lg overflow-hidden bg-gray-100"
                style={{ minHeight: '400px' }}
              />
            )}
          </div>

          {/* Recent Locations */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">최근 거래 위치</h2>
            <div className="space-y-3">
              {locations.slice(0, 10).map((location) => (
                <div
                  key={location.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(location.placeCategory)}`}
                    >
                      {getCategoryIcon(location.placeCategory)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{location.placeName}</p>
                      <p className="text-sm text-gray-600">
                        {location.district} • {location.placeCategory}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(location.amount)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(location.transactionDate).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      </div>
    </>
  );
}
