import { NextRequest, NextResponse } from 'next/server';
import { createMyDataClient } from '@/lib/mydata/client';
import { createClient } from '@/lib/supabase/client';

/**
 * MyData OAuth 콜백 처리
 * GET /api/mydata/callback?code=xxx&state=yyy
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/accounts?error=invalid_callback', request.url)
      );
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(
        new URL('/auth/login?error=unauthorized', request.url)
      );
    }

    // State 검증 및 code_verifier 조회
    const { data: oauthState, error: stateError } = await supabase
      .from('mydata_oauth_states')
      .select('*')
      .eq('user_id', user.id)
      .eq('state', state)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (stateError || !oauthState) {
      console.error('Invalid or expired OAuth state:', stateError);
      return NextResponse.redirect(
        new URL('/accounts?error=invalid_state', request.url)
      );
    }

    // MyData 클라이언트 생성
    const mydataClient = createMyDataClient(oauthState.organization_code);

    // Authorization Code로 액세스 토큰 교환
    const tokenResponse = await mydataClient.exchangeCodeForToken(
      code,
      oauthState.code_verifier
    );

    // 토큰 저장
    await supabase.from('mydata_tokens').upsert({
      user_id: user.id,
      organization_code: oauthState.organization_code,
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token,
      token_type: tokenResponse.token_type,
      expires_at: new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString(),
      scope: tokenResponse.scope,
    });

    // OAuth State 삭제 (일회용)
    await supabase
      .from('mydata_oauth_states')
      .delete()
      .eq('id', oauthState.id);

    // 계좌 정보 자동 동기화
    try {
      const accounts = await mydataClient.getAccounts(tokenResponse.access_token);

      // 계좌 정보 저장
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
          connected_at: new Date().toISOString(),
        });
      }
    } catch (syncError) {
      console.error('Failed to sync accounts:', syncError);
      // 동기화 실패해도 인증 성공으로 처리
    }

    // 성공 페이지로 리다이렉트
    return NextResponse.redirect(
      new URL('/accounts?success=mydata_connected', request.url)
    );
  } catch (error) {
    console.error('MyData callback error:', error);
    return NextResponse.redirect(
      new URL('/accounts?error=callback_failed', request.url)
    );
  }
}
