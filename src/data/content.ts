export const SITE_ID = "prugio-site";
export const OFFICIAL = "https://arkone-prugio.com";
export const img = (path: string) => `${OFFICIAL}${encodeURI(path)}`;

export const PROJECT_PHONE_DISPLAY = "1533-9014";
export const PROJECT_PHONE_TEL = "tel:15339014";

export type NavItem = {
  label: string;
  en: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const NAV: NavItem[] = [
  {
    label: "사업안내",
    en: "OVERVIEW",
    href: "/overview",
    children: [
      { label: "사업개요", href: "/overview" },
      { label: "히스토리", href: "/brand" },
      { label: "오시는길", href: "/contact" },
    ],
  },
  {
    label: "입지안내",
    en: "LOCATION",
    href: "/location",
    children: [{ label: "입지환경", href: "/location" }],
  },
  {
    label: "프리미엄",
    en: "PREMIUM",
    href: "/premium",
    children: [{ label: "프리미엄", href: "/premium" }],
  },
  {
    label: "청약안내",
    en: "INFORMATION",
    href: "/changeinfo",
    children: [
      { label: "변경된 청약제도", href: "/changeinfo" },
      { label: "특별공급 안내", href: "/docspecial" },
      { label: "일반공급 안내", href: "/docnormal" },
    ],
  },
  {
    label: "홍보센터",
    en: "MEDIA",
    href: "/news",
    children: [
      { label: "언론보도", href: "/news" },
      { label: "홍보영상", href: "/video" },
    ],
  },
  { label: "사전고객등록", en: "REGISTER", href: "/register" },
];

export const OVERVIEW_ROWS: [string, string][] = [
  ["대지위치", "인천광역시 서해구 청라동 86-1번지 (청라국제도시 주상복합용지 M5BL)"],
  ["대지면적", "35,306.00㎡ / 10,680.07py"],
  ["건축면적", "12,278.4410㎡"],
  ["연면적", "APT 173,952.7508㎡ · OT 245,645.4826㎡ · 상업시설 4,959.8424㎡"],
  ["건축규모", "지하 5층~지상 49층, 6개 동, 1,855가구"],
  ["주택형", "APT 868세대 전용 84㎡·103㎡ / OT 987실 전용 105㎡·121㎡·136㎡ / 상업시설 1~2층"],
  ["주차", "총 3,124대 (APT 1,389 · OT 1,695 · 상업 40)"],
];

export const HISTORY = [
  ["2026", "청라하늘대교 (개통), 하나드림타운 (예정)"],
  ["2028", "돔구장&스타필드 청라 (개장 예정)"],
  ["2029", "서울아산청라병원 (예정)"],
  ["2031", "영상문화복합단지 (계획)"],
  ["시기 미정", "7호선 국제업무단지역 (예정 · 개통 시기 미정), 청라 피크원 푸르지오 (예정), 청라 아크원 푸르지오 (예정)"],
];

export const PLACES = [
  {
    title: "현장",
    address: "인천광역시 서해구 청라동 86-1번지",
    naver: "https://naver.me/xSBYFSR0",
    kakao: "https://map.kakao.com/?map_type=TYPE_MAP&q=%EC%9D%B8%EC%B2%9C%20%EC%84%9C%ED%95%B4%EA%B5%AC%20%EC%B2%AD%EB%9D%BC%EB%8F%99%2086-1",
    map: img("/resources/img/sub/contact_map_img_1.v4.jpg"),
  },
  {
    title: "견본주택",
    address: "인천광역시 서해구 청라동 87-1번지",
    naver: "https://naver.me/xNpQLQ3L",
    kakao: "https://map.kakao.com/?map_type=TYPE_MAP&q=%EC%9D%B8%EC%B2%9C%20%EC%84%9C%ED%95%B4%EA%B5%AC%20%EC%B2%AD%EB%9D%BC%EB%8F%99%2087-1",
    map: img("/resources/img/sub/contact_map_img_1.v4.jpg"),
  },
  {
    title: "홍보관",
    address: "인천광역시 서해구 중봉대로 586번길 19, 홍익파크 1층 108·109호 (스타벅스 옆)",
    naver: "https://naver.me/xwmqyGWk",
    kakao: "https://map.kakao.com/?map_type=TYPE_MAP&q=%EC%9D%B8%EC%B2%9C%20%EC%84%9C%ED%95%B4%EA%B5%AC%20%EC%A4%91%EB%B4%89%EB%8C%80%EB%A1%9C586%EB%B2%88%EA%B8%B8%2019",
    map: img("/resources/img/sub/contact_map_img_2.v4.jpg"),
  },
];

export const LOCATION_BLOCKS = [
  ["서울-인천-경기를 잇는 쾌속교통망", "강남까지 바로 잇는 7호선 국제업무단지역(예정) · 개통 시기 미정, GTX-D·E (계획 단계 · 확정 아님), 청라하늘대교 개통, 수도권 제2순환도로 등"],
  ["완성되고 있는 핵심 개발비전", "하나드림타운 ('26년 예정), 영상문화복합단지 ('31년 계획), 인천로봇랜드 (예정), 청라시티타워 (계획) 등"],
  ["눈앞에 다가온 트렌디한 생활특권", "복합쇼핑몰+돔구장 형태의 스타필드 청라 ('28년 개장 예정), 서울아산청라병원 ('29년 예정), 코스트코 청라점 등"],
  ["단지 앞 안전한 통학길", "초교 신설 (예정), 중교 신설 (계획), 도보거리 경연초·중교, 청라달튼외국인학교"],
];

export const LOCATION_NOTES = [
  "서울 지하철 7호선 청라 연장선(예정 · 개통 시기 미정): 대도시권광역교통위원회 고시 제2022-01호",
  "9호선 직결(계획 단계 · 확정 아님): 보도자료 2023.11.21",
  "인천로봇랜드(28년 예정): 산업통상자원부고시 제2024-199호",
  "서울아산청라병원(29년 예정): 보도자료 2025.1.2",
  "돔구장&스타필드 청라(28년 개장 예정): 보도자료 2025.1.13",
  "하나드림타운(26년 예정): 보도자료 2026.5.26",
  "청라시티타워(계획): 보도자료 2024.12.26",
  "영상문화복합단지(31년 계획): 인천경제자유구역청 공고 제2022-176호",
  "I-CON City(계획): 보도자료 2026.01.21",
];

export const PREMIUM = [
  ["01", "총 2,911가구 푸르지오 브랜드타운", "최고 49층, 총 2,911가구(청라 피크원 푸르지오 포함 · 합산 규모, 단일 단지 아님)로 청라를 대표하는 대규모 브랜드타운", img("/resources/img/sub/premium_01_img_1.v4.jpg")],
  ["02", "국제업무단지의 센트럴 라이프", "청라의 중심으로 완성되는 국제업무단지의 특별한 주거 가치", img("/resources/img/sub/premium_02_img_1.v4.jpg")],
  ["03", "오션 · 시티뷰 조망 특화", "오션 · 시티뷰를 동시에 누리는 2면 또는 3면 개방구조 (일부 세대)", img("/resources/img/sub/premium_03_img_1.v4.jpg")],
  ["04", "높은 희소가치", "2017년 이후 10년 만의 분양가상한제 공급 아파트. 500세대 이상 대단지 기준.", img("/resources/img/sub/premium_04_img_1.v4.jpg")],
  ["05", "멀티 라이프 플랫폼", "팬트리 2개소 이상(일부 타입 제외). 멀티 발코니(OT)", img("/resources/img/sub/premium_05_img_1.v4.jpg")],
];

export const NEWS: { media: string; date: string; title: string; href: string }[] = [
  { media: "한경비즈니스", date: "2026.09.22", title: "청라 광역교통망 확충 추진… '청라 아크원 푸르지오' 공급 앞둬", href: "https://magazine.hankyung.com/business/article/202609220139b" },
  { media: "한국경제", date: "2026.09.18", title: "신규 분양 앞둔 청라국제도시, '지역 내 갈아타기' 수요 관심", href: "https://www.hankyung.com/article/202609182982O" },
  { media: "디지털타임스", date: "2026.09.15", title: "청라·송도·영종 ‘IFEZ 3축’ 기업 집적가속… ‘청라아크원푸르지오’ 분양", href: "https://www.dt.co.kr/article/12083999" },
  { media: "파이낸셜뉴스", date: "2026.09.11", title: "'금융맨' 2200명 몰려온다, 들썩이는 청라... '청라 아크원 푸르지오' 공급", href: "https://www.fnnews.com/news/202609111310464127" },
  { media: "매일경제", date: "2026.09.08", title: "“완판으로 입지·상품성 검증”…‘청라 아크원 푸르지오’ 공급 앞둬", href: "https://www.mk.co.kr/news/realestate/12146938" },
  { media: "디지털타임스", date: "2026.09.04", title: "대형 오피스텔에 ‘실내 발코니’까지… ‘청라아크원푸르지오’ 눈길", href: "https://www.dt.co.kr/article/12082093" },
  { media: "아시아경제", date: "2026.09.02", title: "비규제 반사이익 청라국제도시, '청라 아크원 푸르지오' 분양", href: "https://view.asiae.co.kr/article/2026090213134292808" },
  { media: "헤럴드경제", date: "2026.08.28", title: "가족 수요 두터운 경기·인천… 전용 84㎡ 이상 중·대형 아파트 선호", href: "https://biz.heraldcorp.com/article/10855211" },
  { media: "파이낸셜뉴스", date: "2026.08.25", title: "하나금융 본사 이전…청라, '국제금융도시' 위용", href: "https://www.fnnews.com/news/202608251043077381" },
  { media: "헤럴드경제", date: "2026.08.19", title: "창업기업 세제 혜택에 기업 유입 기대…청라 주거시장도 ‘주목’", href: "https://biz.heraldcorp.com/article/10845089" },
  { media: "이데일리", date: "2026.08.14", title: "대우건설 '청라 아크원 푸르지오' 분양 임박", href: "https://www.edaily.co.kr/News/Read?newsId=03548966645547320&mediaCodeNo=257" },
  { media: "한국경제", date: "2026.08.11", title: "건축비 인상에 분양가 상승세…분양가상한제 단지 관심", href: "https://www.hankyung.com/article/202608115771O" },
  { media: "매일경제", date: "2026.08.05", title: "“10년 만에 나오는 대단지 아파트”…‘청라 아크원 푸르지오’ 하반기 공급", href: "https://www.mk.co.kr/news/realestate/12117767" },
  { media: "핀포인트뉴스", date: "2026.07.23", title: "국제업무단지 들어서자 집값 ‘쑥’…청라 주거가치 상승 기대", href: "https://www.pinpointnews.co.kr/news/articleView.html?idxno=469756" },
  { media: "미디어펜", date: "2026.07.21", title: "부활한 주거형 오피스텔...실수요 관심 다시 커진다", href: "https://www.mediapen.com/news/view/1111274" },
  { media: "한국경제", date: "2026.07.16", title: "청라 국제업무단지 개발 본격화…M5블록 8180억 도급계약", href: "https://n.news.naver.com/mnews/article/015/0005310766?sid=101" },
  { media: "매일경제", date: "2026.07.10", title: "청라스마트시티, 대우건설과 도급계약 체결", href: "https://n.news.naver.com/mnews/article/009/0005705622?sid=101" },
  { media: "한국경제 TV", date: "2026.07.03", title: "청라 완판 흐름 잇나…하반기 후속 분양 단지 관심", href: "https://www.wowtv.co.kr/NewsCenter/News/Read?articleId=A202607030394&t=NN" },
];

export const DEPOSIT = [
  ["84㎡", "250만 원", "300만 원", "200만 원"],
  ["103㎡", "700만 원", "1,000만 원", "400만 원"],
  ["모든면적", "1,000만 원", "1,500만 원", "500만 원"],
];

export const SPECIAL_CAPS = [
  ["기관추천", "10% 이내", "84㎡"],
  ["경제자유구역", "10% 이내", "84㎡, 103㎡"],
  ["다자녀가구", "10% 이내", "84㎡, 103㎡"],
  ["신혼부부", "15% 이내", "84㎡"],
  ["생애최초", "17% 이내", "84㎡"],
  ["신생아(신설)", "10% 이내", "84㎡"],
  ["노부모부양", "3% 이내", "84㎡, 103㎡"],
];
