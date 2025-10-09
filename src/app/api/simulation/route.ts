import { NextRequest, NextResponse } from 'next/server';
import { analyzeSimulation } from '@/lib/claude/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      simulationYears,
      inflationRate,
      incomeGrowthRate,
      investmentReturnRate,
      events,
    } = body;

    // Default current financial state (would come from user's actual data in production)
    const currentIncome = 3500000;
    const currentExpenses = 2100000;
    const currentNetWorth = 45000000;

    // Call Claude API
    const analysis = await analyzeSimulation({
      currentIncome,
      currentExpenses,
      currentNetWorth,
      simulationYears,
      inflationRate,
      incomeGrowthRate,
      investmentReturnRate,
      events,
    });

    // Generate projection data
    const projectionData = [];
    let netWorth = currentNetWorth;

    for (let year = 0; year <= simulationYears; year++) {
      const yearlyIncome = currentIncome * 12 * Math.pow(1 + incomeGrowthRate / 100, year);
      const yearlyExpenses = currentExpenses * 12 * Math.pow(1 + inflationRate / 100, year);

      // Apply events
      let eventImpact = 0;
      events.forEach((event: any) => {
        if (event.year_offset === year) {
          eventImpact -= event.one_time_cost || 0;
          eventImpact += ((event.monthly_income_change || 0) * 12);
          eventImpact -= ((event.monthly_expense_change || 0) * 12);
        }
      });

      netWorth += (yearlyIncome - yearlyExpenses + eventImpact);
      netWorth *= (1 + investmentReturnRate / 100);

      projectionData.push({
        year: `${year}년`,
        netWorth: Math.round(netWorth),
        income: Math.round(yearlyIncome),
        expenses: Math.round(yearlyExpenses),
      });
    }

    return NextResponse.json({
      success: true,
      projectionData,
      analysis,
    });
  } catch (error: any) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || '시뮬레이션 실패' },
      { status: 500 }
    );
  }
}
