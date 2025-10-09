/**
 * DSR (Debt Service Ratio) Risk Detection System
 * 총부채원리금상환비율 위험 감지 및 경고 시스템
 */

export interface DSRData {
  // 소득
  monthlyIncome: number;
  annualIncome: number;

  // 부채 상환
  monthlyDebtPayment: number; // 월 부채 원리금 상환액
  monthlyPrincipal: number; // 월 원금 상환
  monthlyInterest: number; // 월 이자 상환

  // 부채 세부 정보
  loans: Array<{
    loanType: string;
    balance: number;
    interestRate: number;
    monthlyPayment: number;
    remainingMonths: number;
  }>;

  // 기타
  otherMonthlyObligations: number; // 기타 월 고정 지출 (보험료, 통신비 등)
}

export interface DSRResult {
  dsr: number; // DSR 비율 (%)
  dti: number; // DTI 비율 (%)
  riskLevel: 'safe' | 'caution' | 'warning' | 'danger';
  riskScore: number; // 0-100 (높을수록 위험)
  alerts: DSRAlert[];
  recommendations: string[];
  projection: {
    // 현재 페이스 유지 시 예상
    monthsUntilDebtFree: number;
    totalInterestToPay: number;
    potentialSavings: number; // 조기 상환 시 절약 가능 금액
  };
}

export interface DSRAlert {
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  actionRequired: boolean;
}

/**
 * DSR 및 DTI 계산
 */
export function calculateDSR(data: DSRData): DSRResult {
  const { monthlyIncome, monthlyDebtPayment, otherMonthlyObligations, loans } = data;

  // DSR = (월 부채 원리금 상환액 + 기타 고정 지출) / 월 소득 × 100
  const dsr = monthlyIncome > 0
    ? ((monthlyDebtPayment + otherMonthlyObligations) / monthlyIncome) * 100
    : 0;

  // DTI (Debt-to-Income) = 월 부채 원리금 상환액 / 월 소득 × 100
  const dti = monthlyIncome > 0
    ? (monthlyDebtPayment / monthlyIncome) * 100
    : 0;

  // 위험 수준 결정
  const riskLevel = determineRiskLevel(dsr, dti);

  // 위험 점수 (0-100, 높을수록 위험)
  const riskScore = calculateRiskScore(dsr, dti, loans);

  // 경고 메시지 생성
  const alerts = generateAlerts(dsr, dti, riskLevel, loans);

  // 추천사항 생성
  const recommendations = generateRecommendations(dsr, dti, loans, monthlyIncome);

  // 부채 상환 예측
  const projection = calculateDebtProjection(loans, monthlyDebtPayment);

  return {
    dsr,
    dti,
    riskLevel,
    riskScore,
    alerts,
    recommendations,
    projection,
  };
}

/**
 * 위험 수준 결정
 */
function determineRiskLevel(dsr: number, dti: number): 'safe' | 'caution' | 'warning' | 'danger' {
  // 금융감독원 기준:
  // - DSR 40% 이하: 안전
  // - DSR 40-50%: 주의
  // - DSR 50-60%: 경고
  // - DSR 60% 이상: 위험

  if (dsr >= 60 || dti >= 50) return 'danger';
  if (dsr >= 50 || dti >= 40) return 'warning';
  if (dsr >= 40 || dti >= 30) return 'caution';
  return 'safe';
}

/**
 * 위험 점수 계산 (0-100)
 */
function calculateRiskScore(dsr: number, dti: number, loans: DSRData['loans']): number {
  let score = 0;

  // DSR 기준 점수 (최대 50점)
  if (dsr >= 70) score += 50;
  else if (dsr >= 60) score += 45;
  else if (dsr >= 50) score += 35;
  else if (dsr >= 40) score += 25;
  else if (dsr >= 30) score += 15;
  else score += (dsr / 30) * 15;

  // DTI 기준 점수 (최대 30점)
  if (dti >= 50) score += 30;
  else if (dti >= 40) score += 25;
  else if (dti >= 30) score += 20;
  else score += (dti / 30) * 20;

  // 고금리 대출 여부 (최대 20점)
  const highInterestLoans = loans.filter((loan) => loan.interestRate >= 15);
  if (highInterestLoans.length > 0) {
    score += Math.min(highInterestLoans.length * 5, 20);
  }

  return Math.min(Math.round(score), 100);
}

/**
 * 경고 메시지 생성
 */
function generateAlerts(
  dsr: number,
  dti: number,
  riskLevel: string,
  loans: DSRData['loans']
): DSRAlert[] {
  const alerts: DSRAlert[] = [];

  // DSR 경고
  if (dsr >= 60) {
    alerts.push({
      severity: 'critical',
      title: 'DSR 위험 수준 초과',
      message: `DSR이 ${dsr.toFixed(1)}%로 매우 높습니다. 금융감독원 권고 기준(40%)을 크게 초과하여 재무 위기 가능성이 높습니다.`,
      actionRequired: true,
    });
  } else if (dsr >= 50) {
    alerts.push({
      severity: 'warning',
      title: 'DSR 경고 수준',
      message: `DSR이 ${dsr.toFixed(1)}%로 높습니다. 부채 감축이 필요합니다.`,
      actionRequired: true,
    });
  } else if (dsr >= 40) {
    alerts.push({
      severity: 'warning',
      title: 'DSR 주의 필요',
      message: `DSR이 ${dsr.toFixed(1)}%입니다. 추가 대출을 자제하고 기존 부채 관리에 집중하세요.`,
      actionRequired: false,
    });
  }

  // DTI 경고
  if (dti >= 40) {
    alerts.push({
      severity: 'critical',
      title: 'DTI 위험 수준',
      message: `DTI가 ${dti.toFixed(1)}%로 소득 대비 부채 상환 부담이 큽니다.`,
      actionRequired: true,
    });
  }

  // 고금리 대출 경고
  const highInterestLoans = loans.filter((loan) => loan.interestRate >= 15);
  if (highInterestLoans.length > 0) {
    const totalHighInterestDebt = highInterestLoans.reduce((sum, loan) => sum + loan.balance, 0);
    alerts.push({
      severity: 'warning',
      title: '고금리 대출 존재',
      message: `연 15% 이상 고금리 대출이 ${highInterestLoans.length}건, 총 ${(totalHighInterestDebt / 10000).toFixed(0)}만원 있습니다. 대환 대출을 검토하세요.`,
      actionRequired: true,
    });
  }

  // 다중 채무 경고
  if (loans.length >= 5) {
    alerts.push({
      severity: 'warning',
      title: '다중 채무 주의',
      message: `${loans.length}개의 대출을 관리 중입니다. 대출 통합을 고려하세요.`,
      actionRequired: false,
    });
  }

  // 안전한 경우
  if (alerts.length === 0) {
    alerts.push({
      severity: 'info',
      title: '재무 건전성 양호',
      message: `DSR ${dsr.toFixed(1)}%, DTI ${dti.toFixed(1)}%로 건전한 수준입니다.`,
      actionRequired: false,
    });
  }

  return alerts;
}

/**
 * 추천사항 생성
 */
function generateRecommendations(
  dsr: number,
  dti: number,
  loans: DSRData['loans'],
  monthlyIncome: number
): string[] {
  const recommendations: string[] = [];

  // DSR 기반 추천
  if (dsr >= 60) {
    recommendations.push('긴급: 재무 전문가와 상담하여 부채 재조정 계획을 수립하세요.');
    recommendations.push('소득을 늘리거나 지출을 대폭 줄여 DSR을 40% 이하로 낮추는 것이 시급합니다.');
  } else if (dsr >= 50) {
    recommendations.push('DSR을 낮추기 위해 추가 대출을 중단하고 기존 부채 상환에 집중하세요.');
  } else if (dsr >= 40) {
    recommendations.push('DSR 40% 이상으로 추가 대출 승인이 어려울 수 있습니다. 부채 관리를 강화하세요.');
  }

  // 고금리 대출 추천
  const highInterestLoans = loans
    .filter((loan) => loan.interestRate >= 15)
    .sort((a, b) => b.interestRate - a.interestRate);

  if (highInterestLoans.length > 0) {
    const highestRateLoan = highInterestLoans[0];
    recommendations.push(
      `가장 금리가 높은 대출(연 ${highestRateLoan.interestRate.toFixed(1)}%)을 우선 상환하세요.`
    );
    recommendations.push('서민금융진흥원의 햇살론, 새희망홀씨 등 저금리 대환 대출을 검토하세요.');
  }

  // 소액 대출 우선 상환
  const smallLoans = loans.filter((loan) => loan.balance < 5000000).sort((a, b) => a.balance - b.balance);
  if (smallLoans.length > 0) {
    recommendations.push(
      `소액 대출(${(smallLoans[0].balance / 10000).toFixed(0)}만원)을 먼저 상환하여 대출 건수를 줄이세요.`
    );
  }

  // 부채 통합 추천
  if (loans.length >= 3) {
    recommendations.push('여러 대출을 하나로 통합하여 금리를 낮추고 관리를 간소화하세요.');
  }

  // 예산 관리 추천
  if (dti >= 30) {
    const targetPayment = monthlyIncome * 0.3;
    const reductionNeeded = loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0) - targetPayment;
    if (reductionNeeded > 0) {
      recommendations.push(
        `월 상환액을 ${(reductionNeeded / 10000).toFixed(0)}만원 줄이기 위해 대출 재조정을 검토하세요.`
      );
    }
  }

  // 기본 추천
  if (recommendations.length === 0) {
    recommendations.push('현재 부채 관리가 잘 되고 있습니다. 이 수준을 유지하세요.');
    recommendations.push('여유 자금이 있다면 조기 상환을 통해 이자 비용을 절감하세요.');
  }

  return recommendations;
}

/**
 * 부채 상환 예측
 */
function calculateDebtProjection(
  loans: DSRData['loans'],
  totalMonthlyPayment: number
): {
  monthsUntilDebtFree: number;
  totalInterestToPay: number;
  potentialSavings: number;
} {
  let totalBalance = loans.reduce((sum, loan) => sum + loan.balance, 0);
  let totalInterest = 0;
  let months = 0;

  // 단순 시뮬레이션 (평균 금리 적용)
  const avgInterestRate = loans.length > 0
    ? loans.reduce((sum, loan) => sum + loan.interestRate * loan.balance, 0) / totalBalance
    : 0;

  const monthlyInterestRate = avgInterestRate / 100 / 12;

  while (totalBalance > 0 && months < 600) {
    // 최대 50년
    const interest = totalBalance * monthlyInterestRate;
    const principal = totalMonthlyPayment - interest;

    if (principal <= 0) {
      // 원금 상환이 불가능한 경우
      return {
        monthsUntilDebtFree: Infinity,
        totalInterestToPay: Infinity,
        potentialSavings: 0,
      };
    }

    totalBalance -= principal;
    totalInterest += interest;
    months++;
  }

  // 조기 상환 시 절약 가능 금액 (20% 추가 상환 가정)
  const acceleratedPayment = totalMonthlyPayment * 1.2;
  let acceleratedBalance = loans.reduce((sum, loan) => sum + loan.balance, 0);
  let acceleratedInterest = 0;
  let acceleratedMonths = 0;

  while (acceleratedBalance > 0 && acceleratedMonths < 600) {
    const interest = acceleratedBalance * monthlyInterestRate;
    const principal = acceleratedPayment - interest;

    if (principal <= 0) break;

    acceleratedBalance -= principal;
    acceleratedInterest += interest;
    acceleratedMonths++;
  }

  const potentialSavings = totalInterest - acceleratedInterest;

  return {
    monthsUntilDebtFree: months,
    totalInterestToPay: totalInterest,
    potentialSavings: potentialSavings > 0 ? potentialSavings : 0,
  };
}

/**
 * DSR 개선 시뮬레이션
 */
export function simulateDSRImprovement(
  currentData: DSRData,
  scenarios: {
    increaseIncome?: number; // 소득 증가액
    reduceExpenses?: number; // 지출 감소액
    refinanceRate?: number; // 재융자 후 금리
    extraPayment?: number; // 추가 상환액
  }
): {
  currentDSR: number;
  improvedDSR: number;
  improvement: number;
  newRiskLevel: 'safe' | 'caution' | 'warning' | 'danger';
} {
  const currentResult = calculateDSR(currentData);
  const currentDSR = currentResult.dsr;

  let newMonthlyIncome = currentData.monthlyIncome;
  let newMonthlyPayment = currentData.monthlyDebtPayment;

  if (scenarios.increaseIncome) {
    newMonthlyIncome += scenarios.increaseIncome;
  }

  if (scenarios.reduceExpenses) {
    // 지출 감소는 부채 상환에 사용
    newMonthlyPayment += scenarios.reduceExpenses;
  }

  if (scenarios.refinanceRate) {
    // 재융자 시 월 상환액 재계산 (간단한 근사)
    const avgCurrentRate = currentData.loans.reduce((sum, loan) => sum + loan.interestRate, 0) / currentData.loans.length;
    const rateDiff = avgCurrentRate - scenarios.refinanceRate;
    newMonthlyPayment *= (1 - rateDiff / avgCurrentRate * 0.5); // 대략적인 감소
  }

  if (scenarios.extraPayment) {
    newMonthlyPayment += scenarios.extraPayment;
  }

  const improvedDSR = newMonthlyIncome > 0
    ? ((newMonthlyPayment + currentData.otherMonthlyObligations) / newMonthlyIncome) * 100
    : 0;

  const improvement = currentDSR - improvedDSR;
  const newRiskLevel = determineRiskLevel(improvedDSR, (newMonthlyPayment / newMonthlyIncome) * 100);

  return {
    currentDSR,
    improvedDSR,
    improvement,
    newRiskLevel,
  };
}
