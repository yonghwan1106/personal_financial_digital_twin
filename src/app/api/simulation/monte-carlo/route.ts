import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { runMonteCarloSimulation, runScenarioComparison, MonteCarloConfig } from '@/lib/simulation/monte-carlo';
import { chatWithClaude } from '@/lib/claude/client';

/**
 * Monte Carlo 시뮬레이션 API
 * POST /api/simulation/monte-carlo
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      simulationYears = 10,
      numSimulations = 1000,
      inflationRate = { mean: 2.5, stdDev: 1.0 },
      incomeGrowthRate = { mean: 3.0, stdDev: 2.0 },
      investmentReturnRate = { mean: 7.0, stdDev: 10.0 },
      expenseGrowthRate = { mean: 2.0, stdDev: 1.5 },
      events = [],
      scenarioComparison = false,
    } = body;

    // 사용자 인증
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // 사용자 재무 정보 조회
    const { data: userData } = await supabase
      .from('users')
      .select('monthly_income, monthly_expenses')
      .eq('id', user.id)
      .single();

    const monthlyIncome = userData?.monthly_income || 3000000;
    const monthlyExpenses = userData?.monthly_expenses || 2000000;

    // 계좌 잔액 합산 (순자산)
    const { data: accounts } = await supabase
      .from('accounts')
      .select('balance')
      .eq('user_id', user.id);

    const currentNetWorth = accounts?.reduce((sum, account) => sum + (account.balance || 0), 0) || 50000000;

    // Monte Carlo 설정
    const config: MonteCarloConfig = {
      simulationYears,
      numSimulations,
      currentNetWorth,
      monthlyIncome,
      monthlyExpenses,
      inflationRate,
      incomeGrowthRate,
      investmentReturnRate,
      expenseGrowthRate,
      events,
    };

    let result;
    let scenarioData = null;

    if (scenarioComparison) {
      // 시나리오 비교 분석
      scenarioData = runScenarioComparison(config);
      result = scenarioData.baseCase;
    } else {
      // 기본 Monte Carlo 시뮬레이션
      result = runMonteCarloSimulation(config);
    }

    // Claude API로 AI 분석 생성
    const aiAnalysis = await generateMonteCarloAnalysis(
      result,
      config,
      scenarioData
    );

    return NextResponse.json({
      success: true,
      simulation: result,
      scenarios: scenarioData,
      aiAnalysis,
      config: {
        simulationYears,
        numSimulations,
        currentNetWorth,
        monthlyIncome,
        monthlyExpenses,
      },
    });
  } catch (error) {
    console.error('Monte Carlo simulation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to run Monte Carlo simulation',
      },
      { status: 500 }
    );
  }
}

/**
 * Claude API를 이용한 Monte Carlo 결과 분석
 */
async function generateMonteCarloAnalysis(
  result: any,
  config: MonteCarloConfig,
  scenarioData: any
): Promise<{
  summary: string;
  insights: string[];
  risks: string[];
  recommendations: string[];
}> {
  const { statistics, percentiles } = result;

  const prompt = `
당신은 전문 재무 분석가입니다. 다음 Monte Carlo 시뮬레이션 결과를 분석하고, 사용자에게 명확하고 실행 가능한 조언을 제공해주세요.

## 시뮬레이션 설정
- 시뮬레이션 기간: ${config.simulationYears}년
- 반복 횟수: ${config.numSimulations}회
- 현재 순자산: ${(config.currentNetWorth / 10000).toFixed(0)}만원
- 월 소득: ${(config.monthlyIncome / 10000).toFixed(0)}만원
- 월 지출: ${(config.monthlyExpenses / 10000).toFixed(0)}만원

## 시뮬레이션 결과
- 최종 순자산 평균: ${(statistics.finalNetWorthMean / 10000).toFixed(0)}만원
- 최종 순자산 중앙값: ${(statistics.finalNetWorthMedian / 10000).toFixed(0)}만원
- 표준편차: ${(statistics.finalNetWorthStdDev / 10000).toFixed(0)}만원
- 성공 확률 (순자산 > 0): ${(statistics.probabilityOfSuccess * 100).toFixed(1)}%
- Value at Risk (5% 최악): ${(statistics.valueAtRisk / 10000).toFixed(0)}만원

## 백분위수 분석
- P10 (하위 10%): ${(percentiles.p10[percentiles.p10.length - 1] / 10000).toFixed(0)}만원
- P50 (중앙값): ${(percentiles.p50[percentiles.p50.length - 1] / 10000).toFixed(0)}만원
- P90 (상위 10%): ${(percentiles.p90[percentiles.p90.length - 1] / 10000).toFixed(0)}만원

${scenarioData ? `
## 시나리오 비교
- 낙관적 시나리오 최종 순자산: ${(scenarioData.bestCase.statistics.finalNetWorthMedian / 10000).toFixed(0)}만원
- 기본 시나리오 최종 순자산: ${(scenarioData.baseCase.statistics.finalNetWorthMedian / 10000).toFixed(0)}만원
- 비관적 시나리오 최종 순자산: ${(scenarioData.worstCase.statistics.finalNetWorthMedian / 10000).toFixed(0)}만원
` : ''}

다음 형식으로 분석 결과를 제공해주세요:

1. **요약** (2-3문장): 전체 시뮬레이션 결과의 핵심 내용
2. **주요 인사이트** (3-4개): 시뮬레이션에서 발견된 중요한 패턴이나 특징
3. **위험 요소** (2-3개): 주의해야 할 재무적 위험
4. **추천사항** (3-4개): 구체적이고 실행 가능한 재무 전략

JSON 형식으로만 답변해주세요:
{
  "summary": "요약 내용",
  "insights": ["인사이트1", "인사이트2", "인사이트3"],
  "risks": ["위험1", "위험2"],
  "recommendations": ["추천1", "추천2", "추천3"]
}
`;

  try {
    const response = await chatWithClaude(prompt, []);

    // JSON 파싱
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // 파싱 실패 시 기본값
    return {
      summary: response.substring(0, 200),
      insights: ['시뮬레이션 결과를 확인해주세요.'],
      risks: ['분석 중 오류가 발생했습니다.'],
      recommendations: ['재무 전문가와 상담하세요.'],
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    return {
      summary: 'AI 분석을 생성하는 중 오류가 발생했습니다.',
      insights: ['시뮬레이션 데이터를 직접 확인해주세요.'],
      risks: ['분석 생성 실패'],
      recommendations: ['나중에 다시 시도해주세요.'],
    };
  }
}
