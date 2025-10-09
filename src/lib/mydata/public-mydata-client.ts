/**
 * Public MyData Client (행정안전부 공공 마이데이터)
 * 소득, 세금, 국민연금 정보 연동
 */

export interface PublicMyDataConfig {
  apiKey: string;
  apiUrl: string;
}

export interface NationalPensionData {
  insured_id: string; // 가입자 번호
  insured_type: 'employee' | 'self-employed' | 'voluntary'; // 가입 유형
  join_date: string; // 가입일
  monthly_contribution: number; // 월 납입액
  accumulated_months: number; // 가입 개월수
  expected_pension_age: number; // 예상 수령 나이
  expected_monthly_pension: number; // 예상 월 수령액
}

export interface TaxData {
  year: number; // 과세 연도
  total_income: number; // 총 소득
  taxable_income: number; // 과세 표준
  income_tax: number; // 소득세
  local_income_tax: number; // 지방소득세
  total_tax: number; // 총 세액
  deductions: {
    standard_deduction: number; // 근로소득공제
    personal_deduction: number; // 인적공제
    special_deduction: number; // 특별공제
  };
}

export interface EmploymentInsuranceData {
  insured_id: string;
  employer_name: string;
  employment_start_date: string;
  employment_type: 'permanent' | 'temporary' | 'daily';
  monthly_wage: number;
  insured_period_months: number;
}

export interface ResidenceData {
  address: string;
  address_type: 'owned' | 'rented' | 'charter';
  move_in_date: string;
  monthly_rent?: number; // 월세
  charter_deposit?: number; // 전세금
  property_value?: number; // 부동산 가격 (소유 시)
}

export interface PublicMyDataProfile {
  user_id: string;
  national_pension?: NationalPensionData;
  tax_data?: TaxData[];
  employment_insurance?: EmploymentInsuranceData;
  residence?: ResidenceData;
  last_sync: string;
}

/**
 * 공공 마이데이터 클라이언트
 */
export class PublicMyDataClient {
  private config: PublicMyDataConfig;

  constructor(config: PublicMyDataConfig) {
    this.config = config;
  }

  /**
   * 국민연금 정보 조회
   */
  async getNationalPensionData(
    accessToken: string,
    residentNumber: string
  ): Promise<NationalPensionData> {
    const response = await fetch(`${this.config.apiUrl}/v1/pension/national`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-API-KEY': this.config.apiKey,
      },
      body: JSON.stringify({
        resident_number: residentNumber, // 주민등록번호 (암호화 필요)
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch national pension data: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * 세금 정보 조회 (국세청)
   */
  async getTaxData(
    accessToken: string,
    residentNumber: string,
    year: number
  ): Promise<TaxData> {
    const response = await fetch(`${this.config.apiUrl}/v1/tax/income`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-API-KEY': this.config.apiKey,
      },
      body: JSON.stringify({
        resident_number: residentNumber,
        year,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tax data: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * 고용보험 정보 조회
   */
  async getEmploymentInsuranceData(
    accessToken: string,
    residentNumber: string
  ): Promise<EmploymentInsuranceData> {
    const response = await fetch(`${this.config.apiUrl}/v1/insurance/employment`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-API-KEY': this.config.apiKey,
      },
      body: JSON.stringify({
        resident_number: residentNumber,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch employment insurance data: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * 주소 정보 조회 (주민등록)
   */
  async getResidenceData(
    accessToken: string,
    residentNumber: string
  ): Promise<ResidenceData> {
    const response = await fetch(`${this.config.apiUrl}/v1/residence`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-API-KEY': this.config.apiKey,
      },
      body: JSON.stringify({
        resident_number: residentNumber,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch residence data: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * 통합 공공 마이데이터 조회
   */
  async getPublicMyDataProfile(
    accessToken: string,
    residentNumber: string
  ): Promise<PublicMyDataProfile> {
    const currentYear = new Date().getFullYear();

    try {
      const [nationalPension, taxData, employmentInsurance, residence] = await Promise.allSettled([
        this.getNationalPensionData(accessToken, residentNumber),
        this.getTaxData(accessToken, residentNumber, currentYear - 1), // 전년도 세금
        this.getEmploymentInsuranceData(accessToken, residentNumber),
        this.getResidenceData(accessToken, residentNumber),
      ]);

      return {
        user_id: '', // 호출자가 설정
        national_pension: nationalPension.status === 'fulfilled' ? nationalPension.value : undefined,
        tax_data: taxData.status === 'fulfilled' ? [taxData.value] : undefined,
        employment_insurance:
          employmentInsurance.status === 'fulfilled' ? employmentInsurance.value : undefined,
        residence: residence.status === 'fulfilled' ? residence.value : undefined,
        last_sync: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Public MyData fetch error:', error);
      throw error;
    }
  }
}

/**
 * 공공 마이데이터 클라이언트 팩토리
 */
export function createPublicMyDataClient(): PublicMyDataClient {
  const config: PublicMyDataConfig = {
    apiKey: process.env.PUBLIC_MYDATA_API_KEY || '',
    apiUrl: process.env.PUBLIC_MYDATA_API_URL || 'https://api.mois.go.kr/mydata',
  };

  return new PublicMyDataClient(config);
}

/**
 * Mock 공공 마이데이터 생성 (개발/테스트용)
 */
export function generateMockPublicMyData(userId: string): PublicMyDataProfile {
  return {
    user_id: userId,
    national_pension: {
      insured_id: 'NPS' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      insured_type: 'employee',
      join_date: '2015-01-01',
      monthly_contribution: 90000,
      accumulated_months: 108, // 9년
      expected_pension_age: 65,
      expected_monthly_pension: 800000,
    },
    tax_data: [
      {
        year: 2024,
        total_income: 50000000,
        taxable_income: 35000000,
        income_tax: 4500000,
        local_income_tax: 450000,
        total_tax: 4950000,
        deductions: {
          standard_deduction: 10000000,
          personal_deduction: 3000000,
          special_deduction: 2000000,
        },
      },
    ],
    employment_insurance: {
      insured_id: 'EI' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      employer_name: '(주)테크기업',
      employment_start_date: '2020-03-01',
      employment_type: 'permanent',
      monthly_wage: 4000000,
      insured_period_months: 57, // 약 5년
    },
    residence: {
      address: '서울특별시 강남구 테헤란로 123',
      address_type: 'charter',
      move_in_date: '2023-01-01',
      charter_deposit: 300000000,
    },
    last_sync: new Date().toISOString(),
  };
}
