import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { generateMockPublicMyData } from '@/lib/mydata/public-mydata-client';

/**
 * Public MyData 연동 (Mock)
 * POST /api/mydata/public
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Mock 공공 마이데이터 생성
    const publicMyData = generateMockPublicMyData(user.id);

    // 국민연금 정보 저장
    if (publicMyData.national_pension) {
      await supabase.from('mydata_pensions').upsert({
        user_id: user.id,
        organization_code: 'NPS',
        organization_name: '국민연금공단',
        pension_type: 'national',
        account_num: publicMyData.national_pension.insured_id,
        accumulated_amount: publicMyData.national_pension.monthly_contribution * publicMyData.national_pension.accumulated_months,
        monthly_contribution: publicMyData.national_pension.monthly_contribution,
        expected_pension: publicMyData.national_pension.expected_monthly_pension,
      });
    }

    // 세금 정보 저장
    if (publicMyData.tax_data && publicMyData.tax_data.length > 0) {
      const taxData = publicMyData.tax_data[0];
      await supabase.from('public_mydata_tax').upsert({
        user_id: user.id,
        year: taxData.year,
        total_income: taxData.total_income,
        taxable_income: taxData.taxable_income,
        income_tax: taxData.income_tax,
        local_income_tax: taxData.local_income_tax,
        total_tax: taxData.total_tax,
        deductions: taxData.deductions,
      });
    }

    // 고용보험 정보 저장
    if (publicMyData.employment_insurance) {
      await supabase.from('public_mydata_employment').upsert({
        user_id: user.id,
        insured_id: publicMyData.employment_insurance.insured_id,
        employer_name: publicMyData.employment_insurance.employer_name,
        employment_start_date: publicMyData.employment_insurance.employment_start_date,
        employment_type: publicMyData.employment_insurance.employment_type,
        monthly_wage: publicMyData.employment_insurance.monthly_wage,
        insured_period_months: publicMyData.employment_insurance.insured_period_months,
      });
    }

    // 주소 정보 저장
    if (publicMyData.residence) {
      await supabase.from('public_mydata_residence').upsert({
        user_id: user.id,
        address: publicMyData.residence.address,
        address_type: publicMyData.residence.address_type,
        move_in_date: publicMyData.residence.move_in_date,
        monthly_rent: publicMyData.residence.monthly_rent,
        charter_deposit: publicMyData.residence.charter_deposit,
        property_value: publicMyData.residence.property_value,
      });
    }

    // 사용자 소득 정보 업데이트 (고용보험 데이터 기반)
    if (publicMyData.employment_insurance) {
      await supabase
        .from('users')
        .update({
          monthly_income: publicMyData.employment_insurance.monthly_wage,
        })
        .eq('id', user.id);
    }

    return NextResponse.json({
      success: true,
      message: '공공 마이데이터 연동이 완료되었습니다.',
      data: publicMyData,
    });
  } catch (error) {
    console.error('Public MyData sync error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to sync public MyData',
      },
      { status: 500 }
    );
  }
}

/**
 * Public MyData 조회
 * GET /api/mydata/public
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // 국민연금 정보 조회
    const { data: pensionData } = await supabase
      .from('mydata_pensions')
      .select('*')
      .eq('user_id', user.id)
      .eq('pension_type', 'national')
      .single();

    // 세금 정보 조회
    const { data: taxData } = await supabase
      .from('public_mydata_tax')
      .select('*')
      .eq('user_id', user.id)
      .order('year', { ascending: false })
      .limit(1)
      .single();

    // 고용보험 정보 조회
    const { data: employmentData } = await supabase
      .from('public_mydata_employment')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // 주소 정보 조회
    const { data: residenceData } = await supabase
      .from('public_mydata_residence')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      data: {
        national_pension: pensionData || null,
        tax_data: taxData || null,
        employment_insurance: employmentData || null,
        residence: residenceData || null,
        has_public_mydata: !!(pensionData || taxData || employmentData || residenceData),
      },
    });
  } catch (error) {
    console.error('Public MyData fetch error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch public MyData',
      },
      { status: 500 }
    );
  }
}
