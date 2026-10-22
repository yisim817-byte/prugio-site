// 작업지시서 10 (2026-10-22) · 입주자모집공고(주택관리번호 2026000496) 공고문 5·23·25면에서 뽑은 값.
// 화면의 표 숫자는 이 파일에서만 그린다. 금액(분양가 등)은 넣지 않는다.
export const NOTICE = {
  "version": "notice-v1-2026-10-22",
  "supply": {
    "buildings": 3,
    "floors": "지하 5층~지상 44층",
    "total": 868,
    "special": 514,
    "general": 354,
    "moveIn": "2031년 08월 예정",
    "modelHouse": "인천광역시 서해구 청라동 87-1",
    "modelHouseUnits": "84A·103A"
  },
  "types": [
    {
      "type": "84A",
      "exclusive": "84.9443",
      "residentialCommon": "37.2676",
      "supply": "122.2119",
      "otherCommon": "67.0610",
      "contract": "189.2729",
      "landShare": "15.6681",
      "units": 248,
      "special": 190,
      "general": 58,
      "lowestFloorPriority": 6
    },
    {
      "type": "84B",
      "exclusive": "84.9210",
      "residentialCommon": "36.7429",
      "supply": "121.6639",
      "otherCommon": "67.0427",
      "contract": "188.7066",
      "landShare": "15.6638",
      "units": 124,
      "special": 84,
      "general": 40,
      "lowestFloorPriority": 3
    },
    {
      "type": "84C",
      "exclusive": "84.8592",
      "residentialCommon": "35.4322",
      "supply": "120.2914",
      "otherCommon": "66.9939",
      "contract": "187.2853",
      "landShare": "15.6524",
      "units": 124,
      "special": 98,
      "general": 26,
      "lowestFloorPriority": 3
    },
    {
      "type": "84D",
      "exclusive": "84.9540",
      "residentialCommon": "36.9529",
      "supply": "121.9069",
      "otherCommon": "67.0687",
      "contract": "188.9756",
      "landShare": "15.6699",
      "units": 124,
      "special": 88,
      "general": 36,
      "lowestFloorPriority": 3
    },
    {
      "type": "103A",
      "exclusive": "103.8518",
      "residentialCommon": "43.1930",
      "supply": "147.0448",
      "otherCommon": "81.9881",
      "contract": "229.0329",
      "landShare": "19.1556",
      "units": 124,
      "special": 29,
      "general": 95,
      "lowestFloorPriority": 3
    },
    {
      "type": "103B",
      "exclusive": "103.9916",
      "residentialCommon": "44.2084",
      "supply": "148.2000",
      "otherCommon": "82.0984",
      "contract": "230.2984",
      "landShare": "19.1814",
      "units": 124,
      "special": 25,
      "general": 99,
      "lowestFloorPriority": 3
    }
  ],
  "specialSupply": {
    "columns": [
      "구분",
      "84A",
      "84B",
      "84C",
      "84D",
      "103A",
      "103B",
      "합계"
    ],
    "rows": [
      [
        "기관추천",
        19,
        13,
        15,
        13,
        0,
        0,
        60
      ],
      [
        "경제자유구역",
        26,
        11,
        13,
        12,
        13,
        11,
        86
      ],
      [
        "다자녀가구",
        24,
        12,
        12,
        12,
        12,
        12,
        84
      ],
      [
        "신혼부부",
        42,
        14,
        20,
        17,
        0,
        0,
        93
      ],
      [
        "노부모부양",
        8,
        4,
        4,
        4,
        4,
        2,
        26
      ],
      [
        "생애최초",
        45,
        18,
        22,
        20,
        0,
        0,
        105
      ],
      [
        "신생아",
        26,
        12,
        12,
        10,
        0,
        0,
        60
      ],
      [
        "합계",
        190,
        84,
        98,
        88,
        29,
        25,
        514
      ]
    ]
  },
  "schedule": [
    [
      "입주자모집공고 게시",
      "2026.10.22(목)"
    ],
    [
      "특별공급",
      "11.02(월)"
    ],
    [
      "일반공급 1순위",
      "11.03(화)"
    ],
    [
      "일반공급 2순위",
      "11.04(수)"
    ],
    [
      "당첨자 발표",
      "11.10(화)"
    ],
    [
      "당첨자 서류접수",
      "11.12(목)~11.16(월)"
    ],
    [
      "계약",
      "11.22(일)~11.24(화)"
    ]
  ],
  "deposit": {
    "basis": "입주자모집공고일 현재 주민등록표상 거주지역",
    "rows": [
      [
        "전용 84㎡ (85㎡ 이하)",
        "300만원",
        "250만원",
        "200만원"
      ],
      [
        "전용 103㎡ (135㎡ 이하)",
        "1,000만원",
        "700만원",
        "400만원"
      ]
    ],
    "columns": [
      "구분",
      "서울특별시",
      "인천광역시",
      "경기도"
    ]
  },
  "rules": {
    "region": "비규제지역",
    "priceCap": "분양가상한제 적용",
    "rewinLimit": "재당첨 제한 10년(이 단지 당첨 시)",
    "resale": "전매제한 3년(소유권이전등기일까지, 3년을 넘으면 3년)",
    "residence": "거주의무 없음",
    "regionPriority": "인천광역시 거주자 50% 우선 · 서울특별시·경기도 거주자 50%",
    "pointLottery84": "가점제 40% · 추첨제 60%",
    "pointLottery103": "추첨제 100%",
    "lotteryHomeless": "추첨제 물량의 75% 무주택세대구성원 우선"
  },
  "payment": {
    "deposit": "계약금 5%",
    "middle": "중도금 60%",
    "balance": "잔금 35%",
    "interest": "이자후불제"
  }
} as const;
