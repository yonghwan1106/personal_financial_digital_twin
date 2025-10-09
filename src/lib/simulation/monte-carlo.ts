/**
 * Monte Carlo Simulation Engine
 * 확률적 미래 재무 상태 예측
 */

export interface MonteCarloConfig {
  simulationYears: number;
  numSimulations: number; // 시뮬레이션 반복 횟수 (기본 1000회)

  // 현재 재무 상태
  currentNetWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;

  // 변수별 평균 및 표준편차 (정규분포)
  inflationRate: { mean: number; stdDev: number };
  incomeGrowthRate: { mean: number; stdDev: number };
  investmentReturnRate: { mean: number; stdDev: number };
  expenseGrowthRate: { mean: number; stdDev: number };

  // 인생 이벤트
  events?: Array<{
    year: number;
    type: 'expense' | 'income';
    amount: number;
    description: string;
  }>;
}

export interface MonteCarloResult {
  years: number[];
  percentiles: {
    p10: number[]; // 10th percentile (pessimistic)
    p25: number[];
    p50: number[]; // median
    p75: number[];
    p90: number[]; // 90th percentile (optimistic)
  };
  statistics: {
    finalNetWorthMean: number;
    finalNetWorthMedian: number;
    finalNetWorthStdDev: number;
    probabilityOfSuccess: number; // 목표 달성 확률
    valueAtRisk: number; // VaR (5% 확률로 발생하는 최악의 시나리오)
  };
  allSimulations: number[][]; // 모든 시뮬레이션 결과 (시각화용)
}

/**
 * Box-Muller 변환을 사용한 정규분포 난수 생성
 */
function randomNormal(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z0 * stdDev + mean;
}

/**
 * 단일 시뮬레이션 실행
 */
function runSingleSimulation(config: MonteCarloConfig): number[] {
  const {
    simulationYears,
    currentNetWorth,
    monthlyIncome,
    monthlyExpenses,
    inflationRate,
    incomeGrowthRate,
    investmentReturnRate,
    expenseGrowthRate,
    events = [],
  } = config;

  const netWorthByYear: number[] = [currentNetWorth];
  let currentIncome = monthlyIncome;
  let currentExpenses = monthlyExpenses;
  let netWorth = currentNetWorth;

  for (let year = 1; year <= simulationYears; year++) {
    // 확률적 변수 샘플링 (정규분포)
    const inflation = randomNormal(inflationRate.mean, inflationRate.stdDev) / 100;
    const incomeGrowth = randomNormal(incomeGrowthRate.mean, incomeGrowthRate.stdDev) / 100;
    const investmentReturn = randomNormal(investmentReturnRate.mean, investmentReturnRate.stdDev) / 100;
    const expenseGrowth = randomNormal(expenseGrowthRate.mean, expenseGrowthRate.stdDev) / 100;

    // 소득 및 지출 조정
    currentIncome *= 1 + incomeGrowth;
    currentExpenses *= 1 + expenseGrowth;

    // 월 저축
    const monthlySavings = currentIncome - currentExpenses;
    const annualSavings = monthlySavings * 12;

    // 투자 수익
    const investmentGain = netWorth * investmentReturn;

    // 인생 이벤트 영향
    const yearEvents = events.filter((e) => e.year === year);
    const eventImpact = yearEvents.reduce((sum, e) => {
      return sum + (e.type === 'income' ? e.amount : -e.amount);
    }, 0);

    // 다음 연도 순자산
    netWorth = netWorth + annualSavings + investmentGain + eventImpact;

    // 음수 방지 (파산 시나리오)
    if (netWorth < 0) {
      netWorth = 0;
    }

    netWorthByYear.push(netWorth);
  }

  return netWorthByYear;
}

/**
 * Monte Carlo 시뮬레이션 실행
 */
export function runMonteCarloSimulation(config: MonteCarloConfig): MonteCarloResult {
  const { simulationYears, numSimulations } = config;

  // 모든 시뮬레이션 결과 저장
  const allSimulations: number[][] = [];

  for (let i = 0; i < numSimulations; i++) {
    const simulation = runSingleSimulation(config);
    allSimulations.push(simulation);
  }

  // 연도별 백분위수 계산
  const years: number[] = Array.from({ length: simulationYears + 1 }, (_, i) => i);
  const percentiles = {
    p10: [] as number[],
    p25: [] as number[],
    p50: [] as number[],
    p75: [] as number[],
    p90: [] as number[],
  };

  for (let yearIdx = 0; yearIdx <= simulationYears; yearIdx++) {
    const valuesAtYear = allSimulations.map((sim) => sim[yearIdx]).sort((a, b) => a - b);

    percentiles.p10.push(valuesAtYear[Math.floor(numSimulations * 0.1)]);
    percentiles.p25.push(valuesAtYear[Math.floor(numSimulations * 0.25)]);
    percentiles.p50.push(valuesAtYear[Math.floor(numSimulations * 0.5)]);
    percentiles.p75.push(valuesAtYear[Math.floor(numSimulations * 0.75)]);
    percentiles.p90.push(valuesAtYear[Math.floor(numSimulations * 0.9)]);
  }

  // 최종 연도 통계
  const finalValues = allSimulations.map((sim) => sim[simulationYears]).sort((a, b) => a - b);
  const finalNetWorthMean = finalValues.reduce((sum, val) => sum + val, 0) / numSimulations;
  const finalNetWorthMedian = finalValues[Math.floor(numSimulations * 0.5)];
  const variance =
    finalValues.reduce((sum, val) => sum + Math.pow(val - finalNetWorthMean, 2), 0) / numSimulations;
  const finalNetWorthStdDev = Math.sqrt(variance);

  // 성공 확률 계산 (순자산이 0 이상인 비율)
  const successCount = finalValues.filter((val) => val > 0).length;
  const probabilityOfSuccess = successCount / numSimulations;

  // VaR (Value at Risk) - 5% 확률로 발생하는 최악의 시나리오
  const valueAtRisk = finalValues[Math.floor(numSimulations * 0.05)];

  return {
    years,
    percentiles,
    statistics: {
      finalNetWorthMean,
      finalNetWorthMedian,
      finalNetWorthStdDev,
      probabilityOfSuccess,
      valueAtRisk,
    },
    allSimulations: allSimulations.slice(0, 100), // 시각화를 위해 100개만 반환
  };
}

/**
 * 시나리오 비교 분석
 */
export interface ScenarioComparison {
  baseCase: MonteCarloResult;
  bestCase: MonteCarloResult;
  worstCase: MonteCarloResult;
}

export function runScenarioComparison(baseConfig: MonteCarloConfig): ScenarioComparison {
  // Base Case
  const baseCase = runMonteCarloSimulation(baseConfig);

  // Best Case (낙관적 시나리오: 표준편차 낮춤, 평균 높임)
  const bestCaseConfig: MonteCarloConfig = {
    ...baseConfig,
    inflationRate: {
      mean: baseConfig.inflationRate.mean - 0.5,
      stdDev: baseConfig.inflationRate.stdDev * 0.5,
    },
    incomeGrowthRate: {
      mean: baseConfig.incomeGrowthRate.mean + 1,
      stdDev: baseConfig.incomeGrowthRate.stdDev * 0.5,
    },
    investmentReturnRate: {
      mean: baseConfig.investmentReturnRate.mean + 2,
      stdDev: baseConfig.investmentReturnRate.stdDev * 0.5,
    },
    expenseGrowthRate: {
      mean: baseConfig.expenseGrowthRate.mean - 0.5,
      stdDev: baseConfig.expenseGrowthRate.stdDev * 0.5,
    },
  };
  const bestCase = runMonteCarloSimulation(bestCaseConfig);

  // Worst Case (비관적 시나리오: 표준편차 높임, 평균 낮춤)
  const worstCaseConfig: MonteCarloConfig = {
    ...baseConfig,
    inflationRate: {
      mean: baseConfig.inflationRate.mean + 1,
      stdDev: baseConfig.inflationRate.stdDev * 1.5,
    },
    incomeGrowthRate: {
      mean: baseConfig.incomeGrowthRate.mean - 1,
      stdDev: baseConfig.incomeGrowthRate.stdDev * 1.5,
    },
    investmentReturnRate: {
      mean: baseConfig.investmentReturnRate.mean - 2,
      stdDev: baseConfig.investmentReturnRate.stdDev * 1.5,
    },
    expenseGrowthRate: {
      mean: baseConfig.expenseGrowthRate.mean + 1,
      stdDev: baseConfig.expenseGrowthRate.stdDev * 1.5,
    },
  };
  const worstCase = runMonteCarloSimulation(worstCaseConfig);

  return {
    baseCase,
    bestCase,
    worstCase,
  };
}

/**
 * 목표 달성 확률 계산
 */
export function calculateGoalProbability(
  simulations: number[][],
  targetAmount: number,
  targetYear: number
): number {
  const successCount = simulations.filter((sim) => sim[targetYear] >= targetAmount).length;
  return successCount / simulations.length;
}
