import { NextRequest, NextResponse } from 'next/server';
import { createMyDataClient } from '@/lib/mydata/client';
import { createClient } from '@/lib/supabase/client';

/**
 * MyData OAuth 인증 시작
 * GET /api/mydata/auth?organization=kb
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

    // MyData 클라이언트 생성
    const mydataClient = createMyDataClient(organizationCode);

    // OAuth 인증 URL 및 State 생성 (PKCE 포함)
    const { url: authUrl, state: oauthState } = await mydataClient.generateAuthUrl();

    // OAuth State를 Supabase에 저장 (보안을 위해)
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // OAuth state를 데이터베이스에 임시 저장 (10분 후 만료)
    await supabase.from('mydata_oauth_states').insert({
      user_id: user.id,
      state: oauthState.state,
      code_verifier: oauthState.code_verifier,
      organization_code: oauthState.organization_code,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10분 후
    });

    // 인증 URL로 리다이렉트
    return NextResponse.json({
      success: true,
      authUrl,
    });
  } catch (error) {
    console.error('MyData auth error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to initiate MyData authentication',
      },
      { status: 500 }
    );
  }
}
