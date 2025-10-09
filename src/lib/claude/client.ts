import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function analyzeSimulation(params: {
  currentIncome: number;
  currentExpenses: number;
  currentNetWorth: number;
  simulationYears: number;
  inflationRate: number;
  incomeGrowthRate: number;
  investmentReturnRate: number;
  events: Array<{
    event_type: string;
    title: string;
    year_offset: number;
    one_time_cost?: number;
    monthly_income_change?: number;
    monthly_expense_change?: number;
  }>;
}) {
  const prompt = `당신은 전문 재무 설계사입니다. 다음 재무 정보를 분석하고 시뮬레이션 결과를 제공하세요.

**현재 재무 상태:**
- 월 수입: ${params.currentIncome.toLocaleString()}원
- 월 지출: ${params.currentExpenses.toLocaleString()}원
- 현재 순자산: ${params.currentNetWorth.toLocaleString()}원

**시뮬레이션 설정:**
- 기간: ${params.simulationYears}년
- 물가 상승률: ${params.inflationRate}%
- 소득 증가율: ${params.incomeGrowthRate}%
- 투자 수익률: ${params.investmentReturnRate}%

**예정된 인생 이벤트:**
${params.events.map(e => `- ${e.title} (${e.year_offset}년 후): 일회성 비용 ${e.one_time_cost?.toLocaleString() || 0}원`).join('\n')}

다음 형식의 JSON으로 응답해주세요:
{
  "summary": "전반적인 재무 전망 요약 (2-3문장)",
  "projectedNetWorth": 최종 예상 순자산 (숫자),
  "riskAlerts": [
    {
      "type": "위험 유형",
      "severity": "high/medium/low",
      "title": "위험 제목",
      "description": "상세 설명",
      "occurs_at": "발생 시점 (YYYY-MM 형식)"
    }
  ],
  "recommendations": [
    {
      "type": "추천 유형",
      "title": "추천 제목",
      "description": "상세 설명",
      "priority": "high/medium/low",
      "estimated_impact": "예상 효과"
    }
  ]
}`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    // Extract JSON from response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  }

  throw new Error('Failed to parse Claude response');
}

export async function chatWithClaude(params: {
  message: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  userContext?: {
    monthlyIncome?: number;
    monthlyExpenses?: number;
    netWorth?: number;
    savingsRate?: number;
  };
}) {
  const systemPrompt = `당신은 전문적이고 친절한 AI 재무 상담사입니다.

사용자의 재무 상태:
${params.userContext ? `
- 월 수입: ${params.userContext.monthlyIncome?.toLocaleString() || '미입력'}원
- 월 지출: ${params.userContext.monthlyExpenses?.toLocaleString() || '미입력'}원
- 순자산: ${params.userContext.netWorth?.toLocaleString() || '미입력'}원
- 저축률: ${params.userContext.savingsRate || '미입력'}%
` : '(아직 재무 데이터가 없습니다)'}

다음 원칙을 따르세요:
1. 친근하고 이해하기 쉬운 언어 사용
2. 구체적이고 실행 가능한 조언 제공
3. 한국의 금융 환경과 서민금융진흥원의 지원 제도를 고려
4. 답변은 3-5문장으로 간결하게
5. 필요시 구체적인 숫자와 예시 포함`;

  const messages: Anthropic.MessageParam[] = [
    ...params.conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    {
      role: 'user' as const,
      content: params.message,
    },
  ];

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const content = message.content[0];
  if (content.type === 'text') {
    return content.text;
  }

  throw new Error('Failed to get text response from Claude');
}
