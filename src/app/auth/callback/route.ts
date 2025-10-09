import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Create profile if it doesn't exist
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata.name || data.user.email!.split('@')[0],
        });

      // Ignore duplicate key error
      if (profileError && !profileError.message.includes('duplicate')) {
        console.error('Profile creation error:', profileError);
      }

      // Redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
    }
  }

  // If there's an error, redirect to login
  return NextResponse.redirect(new URL('/auth/login?error=confirmation_failed', requestUrl.origin));
}
