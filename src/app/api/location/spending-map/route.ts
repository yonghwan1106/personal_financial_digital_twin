import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { generateMockLocationData } from '@/lib/maps/kakao-maps-client';

/**
 * 위치 기반 소비 분석 데이터 조회
 * GET /api/location/spending-map
 */
export async function GET(_request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // 거래 내역 조회
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('id, description, amount, category, transaction_date')
      .eq('user_id', user.id)
      .order('transaction_date', { ascending: false })
      .limit(100);

    if (txError) throw txError;

    if (!transactions || transactions.length === 0) {
      return NextResponse.json({
        success: true,
        locations: [],
        stats: {
          totalLocations: 0,
          topDistricts: [],
          topCategories: [],
        },
      });
    }

    // 거래에 대한 위치 정보 조회 또는 생성
    const locationsPromises = transactions.map(async (tx) => {
      // 기존 위치 정보 확인
      const { data: existingLocation } = await supabase
        .from('transaction_locations')
        .select('*')
        .eq('transaction_id', tx.id)
        .single();

      if (existingLocation) {
        return {
          ...existingLocation,
          amount: tx.amount,
          transaction_date: tx.transaction_date,
        };
      }

      // Mock 위치 데이터 생성
      const mockLocation = generateMockLocationData(tx.description || '거래');

      // DB에 저장
      const { data: newLocation } = await supabase
        .from('transaction_locations')
        .insert({
          transaction_id: tx.id,
          user_id: user.id,
          latitude: mockLocation.latitude,
          longitude: mockLocation.longitude,
          address: mockLocation.address,
          place_name: mockLocation.placeName,
          place_category: mockLocation.placeCategory,
          district: mockLocation.district,
          city: mockLocation.city,
        })
        .select()
        .single();

      return {
        ...newLocation,
        amount: tx.amount,
        transaction_date: tx.transaction_date,
      };
    });

    const locations = (await Promise.all(locationsPromises)).filter(Boolean);

    // 지역별 통계 계산
    const districtStats = locations.reduce(
      (acc: Record<string, { amount: number; count: number }>, loc) => {
        if (!loc.district) return acc;
        if (!acc[loc.district]) {
          acc[loc.district] = { amount: 0, count: 0 };
        }
        acc[loc.district].amount += Math.abs(loc.amount || 0);
        acc[loc.district].count += 1;
        return acc;
      },
      {}
    );

    const topDistricts = Object.entries(districtStats)
      .map(([district, stats]) => ({
        district,
        amount: stats.amount,
        count: stats.count,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // 카테고리별 통계 계산
    const categoryStats = locations.reduce(
      (acc: Record<string, { amount: number; count: number }>, loc) => {
        if (!loc.place_category) return acc;
        if (!acc[loc.place_category]) {
          acc[loc.place_category] = { amount: 0, count: 0 };
        }
        acc[loc.place_category].amount += Math.abs(loc.amount || 0);
        acc[loc.place_category].count += 1;
        return acc;
      },
      {}
    );

    const topCategories = Object.entries(categoryStats)
      .map(([category, stats]) => ({
        category,
        amount: stats.amount,
        count: stats.count,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      locations: locations.map((loc) => ({
        id: loc.id,
        latitude: loc.latitude,
        longitude: loc.longitude,
        address: loc.address,
        placeName: loc.place_name,
        placeCategory: loc.place_category,
        district: loc.district,
        city: loc.city,
        amount: loc.amount,
        transactionDate: loc.transaction_date,
      })),
      stats: {
        totalLocations: locations.length,
        topDistricts,
        topCategories,
      },
    });
  } catch (error) {
    console.error('Spending map error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch spending map data',
      },
      { status: 500 }
    );
  }
}

/**
 * 즐겨찾는 장소 저장
 * POST /api/location/spending-map
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { placeName, latitude, longitude, address, category, notes } = body;

    // 즐겨찾는 장소 저장
    const { data: favoritePlace, error } = await supabase
      .from('favorite_places')
      .insert({
        user_id: user.id,
        place_name: placeName,
        latitude,
        longitude,
        address,
        category,
        notes,
        visit_count: 1,
        total_spent: 0,
        last_visit_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      favoritePlace,
    });
  } catch (error) {
    console.error('Save favorite place error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to save favorite place',
      },
      { status: 500 }
    );
  }
}
