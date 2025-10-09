import { NextRequest, NextResponse } from 'next/server';
import { chatWithClaude } from '@/lib/claude/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { message, conversationHistory, userContext } = body;

    // Call Claude API
    const response = await chatWithClaude({
      message,
      conversationHistory: conversationHistory || [],
      userContext,
    });

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { success: false, error: error.message || '채팅 응답 실패' },
      { status: 500 }
    );
  }
}
