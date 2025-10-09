/**
 * Kakao Maps API Client
 * 위치 기반 소비 분석을 위한 Kakao Maps API 연동
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface AddressSearchResult {
  address_name: string;
  road_address_name: string;
  x: string; // longitude
  y: string; // latitude
  region_1depth_name: string; // 시/도
  region_2depth_name: string; // 구/군
  region_3depth_name: string; // 동/읍/면
}

export interface PlaceSearchResult {
  id: string;
  place_name: string;
  category_name: string;
  category_group_code: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string; // longitude
  y: string; // latitude
  place_url: string;
  distance: string;
}

export interface KakaoMapsConfig {
  apiKey: string;
  apiUrl?: string;
}

/**
 * Kakao Maps API 클라이언트
 */
export class KakaoMapsClient {
  private config: KakaoMapsConfig;
  private baseUrl: string;

  constructor(config: KakaoMapsConfig) {
    this.config = config;
    this.baseUrl = config.apiUrl || 'https://dapi.kakao.com';
  }

  /**
   * 주소로 좌표 검색 (Geocoding)
   */
  async searchAddressByKeyword(keyword: string): Promise<AddressSearchResult[]> {
    const response = await fetch(
      `${this.baseUrl}/v2/local/search/address.json?query=${encodeURIComponent(keyword)}`,
      {
        headers: {
          Authorization: `KakaoAK ${this.config.apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Kakao Maps API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.documents || [];
  }

  /**
   * 좌표로 주소 검색 (Reverse Geocoding)
   */
  async searchAddressByCoords(coords: Coordinates): Promise<AddressSearchResult | null> {
    const response = await fetch(
      `${this.baseUrl}/v2/local/geo/coord2address.json?x=${coords.longitude}&y=${coords.latitude}`,
      {
        headers: {
          Authorization: `KakaoAK ${this.config.apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Kakao Maps API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.documents?.[0] || null;
  }

  /**
   * 키워드로 장소 검색
   */
  async searchPlaces(
    keyword: string,
    coords?: Coordinates,
    radius?: number
  ): Promise<PlaceSearchResult[]> {
    let url = `${this.baseUrl}/v2/local/search/keyword.json?query=${encodeURIComponent(keyword)}`;

    if (coords) {
      url += `&x=${coords.longitude}&y=${coords.latitude}`;
    }

    if (radius) {
      url += `&radius=${radius}`; // 미터 단위
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${this.config.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Kakao Maps API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.documents || [];
  }

  /**
   * 카테고리별 장소 검색
   */
  async searchPlacesByCategory(
    category: string, // CE7: 카페, FD6: 음식점, CS2: 편의점, HP8: 병원, etc.
    coords: Coordinates,
    radius: number = 5000
  ): Promise<PlaceSearchResult[]> {
    const url = `${this.baseUrl}/v2/local/search/category.json?category_group_code=${category}&x=${coords.longitude}&y=${coords.latitude}&radius=${radius}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${this.config.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Kakao Maps API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.documents || [];
  }

  /**
   * 두 좌표 간 거리 계산 (미터 단위)
   */
  calculateDistance(coords1: Coordinates, coords2: Coordinates): number {
    const R = 6371e3; // 지구 반지름 (미터)
    const φ1 = (coords1.latitude * Math.PI) / 180;
    const φ2 = (coords2.latitude * Math.PI) / 180;
    const Δφ = ((coords2.latitude - coords1.latitude) * Math.PI) / 180;
    const Δλ = ((coords2.longitude - coords1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // 미터
  }

  /**
   * 카테고리 코드를 한국어 이름으로 변환
   */
  getCategoryName(code: string): string {
    const categories: Record<string, string> = {
      MT1: '대형마트',
      CS2: '편의점',
      PS3: '어린이집/유치원',
      SC4: '학교',
      AC5: '학원',
      PK6: '주차장',
      OL7: '주유소/충전소',
      SW8: '지하철역',
      BK9: '은행',
      CT1: '문화시설',
      AG2: '중개업소',
      PO3: '공공기관',
      AT4: '관광명소',
      AD5: '숙박',
      FD6: '음식점',
      CE7: '카페',
      HP8: '병원',
      PM9: '약국',
    };
    return categories[code] || code;
  }
}

/**
 * Kakao Maps 클라이언트 팩토리
 */
export function createKakaoMapsClient(): KakaoMapsClient {
  const config: KakaoMapsConfig = {
    apiKey: process.env.KAKAO_MAPS_API_KEY || '',
  };

  if (!config.apiKey) {
    throw new Error('KAKAO_MAPS_API_KEY is not defined in environment variables');
  }

  return new KakaoMapsClient(config);
}

/**
 * Mock 위치 데이터 생성 (개발/테스트용)
 */
export function generateMockLocationData(transactionDescription: string): {
  latitude: number;
  longitude: number;
  address: string;
  placeName: string;
  placeCategory: string;
  district: string;
  city: string;
} {
  // 서울 주요 지역 좌표
  const seoulLocations = [
    {
      district: '강남구',
      city: '서울특별시',
      latitude: 37.4979,
      longitude: 127.0276,
      address: '서울 강남구 역삼동',
    },
    {
      district: '종로구',
      city: '서울특별시',
      latitude: 37.5735,
      longitude: 126.9788,
      address: '서울 종로구 종로1가',
    },
    {
      district: '마포구',
      city: '서울특별시',
      latitude: 37.5415,
      longitude: 126.9525,
      address: '서울 마포구 합정동',
    },
    {
      district: '영등포구',
      city: '서울특별시',
      latitude: 37.5264,
      longitude: 126.8963,
      address: '서울 영등포구 여의도동',
    },
  ];

  const location = seoulLocations[Math.floor(Math.random() * seoulLocations.length)];

  // 거래 설명에 따라 카테고리 추측
  let placeCategory = '기타';
  if (transactionDescription.includes('스타벅스') || transactionDescription.includes('카페')) {
    placeCategory = '카페';
  } else if (
    transactionDescription.includes('이마트') ||
    transactionDescription.includes('쿠팡')
  ) {
    placeCategory = '쇼핑';
  } else if (transactionDescription.includes('GS25') || transactionDescription.includes('편의점')) {
    placeCategory = '편의점';
  } else if (
    transactionDescription.includes('맥도날드') ||
    transactionDescription.includes('식당')
  ) {
    placeCategory = '음식점';
  } else if (transactionDescription.includes('택시') || transactionDescription.includes('지하철')) {
    placeCategory = '교통';
  }

  return {
    ...location,
    placeName: transactionDescription,
    placeCategory,
    latitude: location.latitude + (Math.random() - 0.5) * 0.01, // 약간의 랜덤 오프셋
    longitude: location.longitude + (Math.random() - 0.5) * 0.01,
  };
}
