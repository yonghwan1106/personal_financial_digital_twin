import { NextRequest, NextResponse } from 'next/server';
import { createMyDataClient } from '@/lib/mydata/client';
import { createClient } from '@/lib/supabase/client';

/**
 * MyData 계좌 목록 조회 및 동기화
 * GET /api/mydata/accounts?organization=kb
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const organizationCode = searchParams.get('organization');

    if (!organizationCode) {
      return NextResponse.json(
        { error: 'Organization code is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // 토큰 조회
    const { data: tokenData, error: tokenError } = await supabase
      .from('mydata_tokens')
      .select('*')
      .eq('user_id', user.id)
      .eq('organization_code', organizationCode)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'MyData connection not found. Please connect first.' },
        { status: 404 }
      );
    }

    // 토큰 만료 확인 및 갱신
    let accessToken = tokenData.access_token;
    const isExpired = new Date(tokenData.expires_at) <= new Date();

    if (isExpired) {
      const mydataClient = createMyDataClient(organizationCode);
      const refreshedToken = await mydataClient.refreshAccessToken(tokenData.refresh_token);

      accessToken = refreshedToken.access_token;

      // 갱신된 토큰 저장
      await supabase
        .from('mydata_tokens')
        .update({
          access_token: refreshedToken.access_token,
          refresh_token: refreshedToken.refresh_token,
          expires_at: new Date(Date.now() + refreshedToken.expires_in * 1000).toISOString(),
        })
        .eq('id', tokenData.id);
    }

    // MyData API로 계좌 조회
    const mydataClient = createMyDataClient(organizationCode);
    const accounts = await mydataClient.getAccounts(accessToken);

    // 계좌 정보 DB 업데이트
    for (const account of accounts) {
      await supabase.from('accounts').upsert({
        user_id: user.id,
        organization_code: account.organization_code,
        organization_name: account.organization_name,
        account_number: account.account_num,
        account_type: account.account_type,
        account_name: account.account_name,
        balance: account.balance,
        currency: account.currency,
        is_mydata_connected: true,
        last_synced_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      accounts,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('MyData accounts fetch error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch MyData accounts',
      },
      { status: 500 }
    );
  }
}
