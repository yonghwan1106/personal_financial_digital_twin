import { NextRequest, NextResponse } from 'next/server';
import { createMyDataClient } from '@/lib/mydata/client';
import { createClient } from '@/lib/supabase/client';
import { format, subDays } from 'date-fns';

/**
 * MyData 거래 내역 조회 및 동기화
 * GET /api/mydata/transactions?organization=kb&account_num=xxx&from_date=2024-01-01&to_date=2024-12-31
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const organizationCode = searchParams.get('organization');
    const accountNum = searchParams.get('account_num');
    const fromDate = searchParams.get('from_date') || format(subDays(new Date(), 30), 'yyyy-MM-dd');
    const toDate = searchParams.get('to_date') || format(new Date(), 'yyyy-MM-dd');

    if (!organizationCode || !accountNum) {
      return NextResponse.json(
        { error: 'Organization code and account number are required' },
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

      await supabase
        .from('mydata_tokens')
        .update({
          access_token: refreshedToken.access_token,
          refresh_token: refreshedToken.refresh_token,
          expires_at: new Date(Date.now() + refreshedToken.expires_in * 1000).toISOString(),
        })
        .eq('id', tokenData.id);
    }

    // 계좌 조회 (존재 확인)
    const { data: accountData } = await supabase
      .from('accounts')
      .select('id')
      .eq('user_id', user.id)
      .eq('account_number', accountNum)
      .single();

    if (!accountData) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // MyData API로 거래 내역 조회
    const mydataClient = createMyDataClient(organizationCode);
    const transactions = await mydataClient.getTransactions(
      accessToken,
      accountNum,
      fromDate,
      toDate
    );

    // 거래 내역 DB 저장
    const transactionsToInsert = transactions.map((tx) => ({
      user_id: user.id,
      account_id: accountData.id,
      transaction_id: tx.transaction_id,
      transaction_date: tx.transaction_date,
      transaction_time: tx.transaction_time,
      transaction_type: tx.transaction_type,
      amount: tx.amount,
      balance_after: tx.balance_after,
      description: tx.description,
      counterparty_name: tx.counterparty_name,
      category: tx.category || 'uncategorized',
    }));

    // Upsert로 중복 방지
    if (transactionsToInsert.length > 0) {
      await supabase
        .from('transactions')
        .upsert(transactionsToInsert, {
          onConflict: 'transaction_id',
        });
    }

    return NextResponse.json({
      success: true,
      transactions,
      count: transactions.length,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('MyData transactions fetch error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch MyData transactions',
      },
      { status: 500 }
    );
  }
}
