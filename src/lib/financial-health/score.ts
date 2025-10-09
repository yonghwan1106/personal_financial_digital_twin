/**
 * Financial Health Score Calculator
 * 재무 건강 점수 자동 계산 시스템 (100점 만점)
 */

export interface FinancialData {
  // 자산
  totalAssets: number; // 총 자산
  liquidAssets: number; // 유동 자산 (현금, 예금)
  investmentAssets: number; // 투자 자산

  // 부채
  totalLiabilities: number; // 총 부채
  shortTermDebt: number; // 단기 부채
  longTermDebt: number; // 장기 부채

  // 소득 및 지출
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyDebtPayment: number; // 월 부채 상환액

  // 기타
  age: number;
  hasEmergencyFund: boolean;
  monthsOfEmergencyFund: number; // 비상금 (개월 수)
}

export interface HealthScoreResult {
  totalScore: number; // 0-100
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  components: {
    assetHealth: { score: number; weight: number; description: string };
    debtManagement: { score: number; weight: number; description: string };
    cashFlowHealth: { score: number; weight: number; description: string };
    savingsRate: { score: number; weight: number; description: string };
    emergencyFund: { score: number; weight: number; description: string };
    debtToIncome: { score: number; weight: number; description: string };
  };
  insights: string[];
  recommendations: string[];
}

/**
 * 재무 건강 점수 계산
 */
export function calculateFinancialHealthScore(data: FinancialData): HealthScoreResult {
  // 1. 자산 건전성 (20점)
  const assetHealth = calculateAssetHealth(data);

  // 2. 부채 관리 (20점)
  const debtManagement = calculateDebtManagement(data);

  // 3. 현금 흐름 건전성 (15점)
  const cashFlowHealth = calculateCashFlowHealth(data);

  // 4. 저축률 (15점)
  const savingsRate = calculateSavingsRate(data);

  // 5. 비상 자금 (15점)
  const emergencyFund = calculateEmergencyFund(data);

  // 6. 소득 대비 부채 비율 (DTI) (15점)
  const debtToIncome = calculateDebtToIncome(data);

  // 총점 계산 (가중 평균)
  const totalScore =
    assetHealth.score * assetHealth.weight +
    debtManagement.score * debtManagement.weight +
    cashFlowHealth.score * cashFlowHealth.weight +
    savingsRate.score * savingsRate.weight +
    emergencyFund.score * emergencyFund.weight +
    debtToIncome.score * debtToIncome.weight;

  // 등급 계산
  const grade = calculateGrade(totalScore);

  // 인사이트 생성
  const insights = generateInsights(data, totalScore);

  // 추천사항 생성
  const recommendations = generateRecommendations(data, {
    assetHealth,
    debtManagement,
    cashFlowHealth,
    savingsRate,
    emergencyFund,
    debtToIncome,
  });

  return {
    totalScore: Math.round(totalScore * 10) / 10,
    grade,
    components: {
      assetHealth,
      debtManagement,
      cashFlowHealth,
      savingsRate,
      emergencyFund,
      debtToIncome,
    },
    insights,
    recommendations,
  };
}

/**
 * 1. 자산 건전성 평가 (20점)
 */
function calculateAssetHealth(data: FinancialData): {
  score: number;
  weight: number;
  description: string;
} {
  const { totalAssets, liquidAssets, totalLiabilities } = data;

  const netWorth = totalAssets - totalLiabilities;
  let score = 0;

  // 순자산 평가
  if (netWorth > 0) {
    score += 50; // 순자산이 양수면 기본 50점
    // 순자산 규모에 따라 추가 점수
    if (netWorth > 100000000) score += 30; // 1억 이상
    else if (netWorth > 50000000) score += 20; // 5천만 이상
    else if (netWorth > 10000000) score += 10; // 1천만 이상
  } else {
    score = 0; // 순자산이 음수면 0점
  }

  // 유동 자산 비율 평가
  const liquidityRatio = totalAssets > 0 ? liquidAssets / totalAssets : 0;
  if (liquidityRatio >= 0.3) score += 20; // 30% 이상
  else if (liquidityRatio >= 0.2) score += 15;
  else if (liquidityRatio >= 0.1) score += 10;
  else score += 5;

  const finalScore = Math.min(score, 100);

  return {
    score: finalScore,
    weight: 0.2,
    description: `순자산: ${(netWorth / 10000).toFixed(0)}만원, 유동성 비율: ${(liquidityRatio * 100).toFixed(1)}%`,
  };
}

/**
 * 2. 부채 관리 평가 (20점)
 */
function calculateDebtManagement(data: FinancialData): {
  score: number;
  weight: number;
  description: string;
} {
  const { totalAssets, totalLiabilities } = data;

  let score = 100;

  if (totalLiabilities === 0) {
    // 부채가 없으면 만점
    return {
      score: 100,
      weight: 0.2,
      description: '부채 없음 (우수)',
    };
  }

  // 부채 비율 (Debt Ratio) = 총 부채 / 총 자산
  const debtRatio = totalAssets > 0 ? totalLiabilities / totalAssets : 1;

  if (debtRatio <= 0.3) score = 100; // 30% 이하
  else if (debtRatio <= 0.5) score = 80;
  else if (debtRatio <= 0.7) score = 60;
  else if (debtRatio <= 0.9) score = 40;
  else score = 20;

  return {
    score,
    weight: 0.2,
    description: `부채 비율: ${(debtRatio * 100).toFixed(1)}%`,
  };
}

/**
 * 3. 현금 흐름 건전성 평가 (15점)
 */
function calculateCashFlowHealth(data: FinancialData): {
  score: number;
  weight: number;
  description: string;
} {
  const { monthlyIncome, monthlyExpenses } = data;

  const monthlySavings = monthlyIncome - monthlyExpenses;
  let score = 0;

  if (monthlySavings > 0) {
    score = 100; // 흑자면 만점
  } else if (monthlySavings === 0) {
    score = 50; // 수지균형
  } else {
    score = 0; // 적자면 0점
  }

  return {
    score,
    weight: 0.15,
    description: `월 순저축: ${(monthlySavings / 10000).toFixed(0)}만원`,
  };
}

/**
 * 4. 저축률 평가 (15점)
 */
function calculateSavingsRate(data: FinancialData): {
  score: number;
  weight: number;
  description: string;
} {
  const { monthlyIncome, monthlyExpenses } = data;

  if (monthlyIncome === 0) {
    return {
      score: 0,
      weight: 0.15,
      description: '소득 정보 없음',
    };
  }

  const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
  let score = 0;

  if (savingsRate >= 30) score = 100;
  else if (savingsRate >= 20) score = 80;
  else if (savingsRate >= 10) score = 60;
  else if (savingsRate >= 5) score = 40;
  else if (savingsRate >= 0) score = 20;
  else score = 0;

  return {
    score,
    weight: 0.15,
    description: `저축률: ${savingsRate.toFixed(1)}%`,
  };
}

/**
 * 5. 비상 자금 평가 (15점)
 */
function calculateEmergencyFund(data: FinancialData): {
  score: number;
  weight: number;
  description: string;
} {
  const { monthsOfEmergencyFund } = data;

  let score = 0;

  if (monthsOfEmergencyFund >= 6) score = 100; // 6개월 이상
  else if (monthsOfEmergencyFund >= 3) score = 70; // 3-6개월
  else if (monthsOfEmergencyFund >= 1) score = 40; // 1-3개월
  else score = 0;

  return {
    score,
    weight: 0.15,
    description: `비상 자금: ${monthsOfEmergencyFund}개월분`,
  };
}

/**
 * 6. 소득 대비 부채 비율 (DTI) 평가 (15점)
 */
function calculateDebtToIncome(data: FinancialData): {
  score: number;
  weight: number;
  description: string;
} {
  const { monthlyIncome, monthlyDebtPayment } = data;

  if (monthlyIncome === 0) {
    return {
      score: 0,
      weight: 0.15,
      description: '소득 정보 없음',
    };
  }

  const dti = (monthlyDebtPayment / monthlyIncome) * 100;
  let score = 0;

  if (dti === 0) score = 100; // 부채 상환 없음
  else if (dti <= 20) score = 90;
  else if (dti <= 30) score = 70;
  else if (dti <= 40) score = 50; // 위험 수준
  else if (dti <= 50) score = 30;
  else score = 0; // 매우 위험

  return {
    score,
    weight: 0.15,
    description: `DTI: ${dti.toFixed(1)}%`,
  };
}

/**
 * 등급 계산
 */
function calculateGrade(score: number): 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F' {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 75) return 'C+';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/**
 * 인사이트 생성
 */
function generateInsights(data: FinancialData, totalScore: number): string[] {
  const insights: string[] = [];

  const netWorth = data.totalAssets - data.totalLiabilities;
  const savingsRate = ((data.monthlyIncome - data.monthlyExpenses) / data.monthlyIncome) * 100;

  insights.push(`전체 재무 건강 점수는 ${totalScore.toFixed(1)}점입니다.`);

  if (totalScore >= 90) {
    insights.push('매우 우수한 재무 상태를 유지하고 있습니다.');
  } else if (totalScore >= 70) {
    insights.push('양호한 재무 상태이지만 개선의 여지가 있습니다.');
  } else {
    insights.push('재무 건전성 개선이 필요합니다.');
  }

  if (netWorth > 0) {
    insights.push(`현재 순자산은 ${(netWorth / 10000).toFixed(0)}만원입니다.`);
  } else {
    insights.push('순자산이 음수입니다. 부채 감소가 시급합니다.');
  }

  if (savingsRate >= 20) {
    insights.push(`저축률 ${savingsRate.toFixed(1)}%로 우수합니다.`);
  } else if (savingsRate < 0) {
    insights.push('매월 적자가 발생하고 있습니다.');
  }

  return insights;
}

/**
 * 추천사항 생성
 */
function generateRecommendations(data: FinancialData, components: any): string[] {
  const recommendations: string[] = [];

  // 비상 자금
  if (components.emergencyFund.score < 70) {
    recommendations.push(
      `비상 자금을 최소 3개월분 이상 확보하세요. 현재 ${data.monthsOfEmergencyFund}개월분입니다.`
    );
  }

  // 부채 관리
  if (components.debtManagement.score < 60) {
    recommendations.push('부채 비율이 높습니다. 우선적으로 고금리 부채 상환을 시작하세요.');
  }

  // 저축률
  if (components.savingsRate.score < 60) {
    recommendations.push('저축률을 최소 10% 이상으로 높이세요. 고정 지출을 줄이는 것부터 시작하세요.');
  }

  // DTI
  if (components.debtToIncome.score < 50) {
    recommendations.push('DTI가 40% 이상입니다. 부채 재조정이나 소득 증대를 고려하세요.');
  }

  // 현금 흐름
  if (components.cashFlowHealth.score < 50) {
    recommendations.push('매월 적자가 발생하고 있습니다. 지출 관리를 강화하세요.');
  }

  // 기본 추천
  if (recommendations.length === 0) {
    recommendations.push('현재 재무 상태를 잘 유지하고 있습니다. 장기 투자를 고려해보세요.');
  }

  return recommendations;
}
