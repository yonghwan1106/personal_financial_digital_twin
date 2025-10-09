/**
 * MyData API Client
 * 실제 금융기관 MyData API 연동 클라이언트
 */

import {
  MyDataConfig,
  MyDataAuthResponse,
  MyDataAccount,
  MyDataTransaction,
  MyDataResponse,
  MyDataErrorResponse,
  MyDataOAuthState,
  FinancialOrganization,
} from './types';

// PKCE (Proof Key for Code Exchange) 헬퍼
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
}

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export class MyDataClient {
  private config: MyDataConfig;
  private organizationInfo: FinancialOrganization;

  constructor(config: MyDataConfig, organizationInfo: FinancialOrganization) {
    this.config = config;
    this.organizationInfo = organizationInfo;
  }

  /**
   * OAuth 2.0 인증 URL 생성 (PKCE 포함)
   */
  async generateAuthUrl(): Promise<{ url: string; state: MyDataOAuthState }> {
    const state = generateRandomString(32);
    const codeVerifier = generateRandomString(128);
    const codeChallenge = base64UrlEncode(await sha256(codeVerifier));

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope.join(' '),
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    const authUrl = `${this.organizationInfo.api_base_url}/oauth2/authorize?${params.toString()}`;

    const oauthState: MyDataOAuthState = {
      state,
      code_verifier: codeVerifier,
      organization_code: this.organizationInfo.code,
      created_at: Date.now(),
    };

    return { url: authUrl, state: oauthState };
  }

  /**
   * 인증 코드로 액세스 토큰 교환
   */
  async exchangeCodeForToken(
    code: string,
    codeVerifier: string
  ): Promise<MyDataAuthResponse> {
    const response = await fetch(`${this.organizationInfo.api_base_url}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.config.redirectUri,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      const error: MyDataErrorResponse = await response.json();
      throw new Error(`MyData OAuth Error: ${error.error_message}`);
    }

    return response.json();
  }

  /**
   * 리프레시 토큰으로 액세스 토큰 갱신
   */
  async refreshAccessToken(refreshToken: string): Promise<MyDataAuthResponse> {
    const response = await fetch(`${this.organizationInfo.api_base_url}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      }),
    });

    if (!response.ok) {
      const error: MyDataErrorResponse = await response.json();
      throw new Error(`MyData Token Refresh Error: ${error.error_message}`);
    }

    return response.json();
  }

  /**
   * 계좌 목록 조회
   */
  async getAccounts(accessToken: string): Promise<MyDataAccount[]> {
    const response = await fetch(`${this.organizationInfo.api_base_url}/v1/accounts`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error: MyDataErrorResponse = await response.json();
      throw new Error(`MyData API Error: ${error.error_message}`);
    }

    const data: MyDataResponse<MyDataAccount[]> = await response.json();
    return data.data;
  }

  /**
   * 거래 내역 조회
   */
  async getTransactions(
    accessToken: string,
    accountNum: string,
    fromDate: string,
    toDate: string
  ): Promise<MyDataTransaction[]> {
    const params = new URLSearchParams({
      account_num: accountNum,
      from_date: fromDate,
      to_date: toDate,
    });

    const response = await fetch(
      `${this.organizationInfo.api_base_url}/v1/transactions?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error: MyDataErrorResponse = await response.json();
      throw new Error(`MyData API Error: ${error.error_message}`);
    }

    const data: MyDataResponse<MyDataTransaction[]> = await response.json();
    return data.data;
  }

  /**
   * 액세스 토큰 해지 (로그아웃)
   */
  async revokeToken(accessToken: string): Promise<void> {
    const response = await fetch(`${this.organizationInfo.api_base_url}/oauth2/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        token: accessToken,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      }),
    });

    if (!response.ok) {
      const error: MyDataErrorResponse = await response.json();
      throw new Error(`MyData Token Revoke Error: ${error.error_message}`);
    }
  }
}

/**
 * 금융기관 정보 레지스트리
 */
export const FINANCIAL_ORGANIZATIONS: Record<string, FinancialOrganization> = {
  kb: {
    code: '0001',
    name: 'KB국민은행',
    type: 'bank',
    api_base_url: process.env.NEXT_PUBLIC_MYDATA_KB_API_URL || 'https://api.kbstar.com/mydata',
    supports_mydata: true,
  },
  shinhan: {
    code: '0002',
    name: '신한은행',
    type: 'bank',
    api_base_url: process.env.NEXT_PUBLIC_MYDATA_SHINHAN_API_URL || 'https://api.shinhan.com/mydata',
    supports_mydata: true,
  },
  woori: {
    code: '0003',
    name: '우리은행',
    type: 'bank',
    api_base_url: process.env.NEXT_PUBLIC_MYDATA_WOORI_API_URL || 'https://api.wooribank.com/mydata',
    supports_mydata: true,
  },
  hana: {
    code: '0004',
    name: '하나은행',
    type: 'bank',
    api_base_url: process.env.NEXT_PUBLIC_MYDATA_HANA_API_URL || 'https://api.hanabank.com/mydata',
    supports_mydata: true,
  },
  nh: {
    code: '0005',
    name: 'NH농협은행',
    type: 'bank',
    api_base_url: process.env.NEXT_PUBLIC_MYDATA_NH_API_URL || 'https://api.nonghyup.com/mydata',
    supports_mydata: true,
  },
  kakao: {
    code: '0090',
    name: '카카오뱅크',
    type: 'bank',
    api_base_url: process.env.NEXT_PUBLIC_MYDATA_KAKAO_API_URL || 'https://api.kakaobank.com/mydata',
    supports_mydata: true,
  },
  toss: {
    code: '0092',
    name: '토스뱅크',
    type: 'bank',
    api_base_url: process.env.NEXT_PUBLIC_MYDATA_TOSS_API_URL || 'https://api.tossbank.com/mydata',
    supports_mydata: true,
  },
  kbank: {
    code: '0089',
    name: '케이뱅크',
    type: 'bank',
    api_base_url: process.env.NEXT_PUBLIC_MYDATA_KBANK_API_URL || 'https://api.kbanknow.com/mydata',
    supports_mydata: true,
  },
};

/**
 * MyData 클라이언트 팩토리
 */
export function createMyDataClient(organizationCode: string): MyDataClient {
  const organization = FINANCIAL_ORGANIZATIONS[organizationCode];
  if (!organization) {
    throw new Error(`Unknown organization code: ${organizationCode}`);
  }

  if (!organization.supports_mydata) {
    throw new Error(`Organization ${organization.name} does not support MyData`);
  }

  const config: MyDataConfig = {
    clientId: process.env.NEXT_PUBLIC_MYDATA_CLIENT_ID || '',
    clientSecret: process.env.MYDATA_CLIENT_SECRET || '',
    redirectUri: process.env.NEXT_PUBLIC_MYDATA_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/mydata/callback`,
    scope: ['account', 'transaction', 'loan', 'card', 'insurance', 'investment'],
  };

  return new MyDataClient(config, organization);
}
