/**
 * 어보 (EOBO) MVP - 어종 및 이벤트 마스터 데이터
 * - 한국 주요 10대 낚시 대상 어종의 100% 실제 실물 사진 매칭 (위키미디어 생물학 공식 아카이브)
 * - 국립수산과학원 표준 기준 체장-연령 산출 파라미터
 * - 수산자원관리법 금어기 및 포획금지체장 데이터
 * - 특허 연계 스폰서/지자체 낚시 챌린지 이벤트
 */

const FISH_DATABASE = [
  {
    id: 'olive_flounder',
    name: '넙치 (광어)',
    scientificName: 'Paralichthys olivaceus',
    englishName: 'Olive Flounder',
    category: '바다',
    family: '넙치과',
    habitat: '전 연안 (서해, 남해, 동해 연안의 모래 및 펄 바닥)',
    depth: '수심 10 ~ 100m',
    waterTemp: '12 ~ 22℃',
    ageFormula: (lengthCm) => {
      if (lengthCm < 20) return '1년 미만 (유어)';
      if (lengthCm < 35) return '1년생';
      if (lengthCm < 47) return '2년생';
      if (lengthCm < 58) return '3년생';
      if (lengthCm < 68) return '4년생';
      if (lengthCm < 78) return '5~6년생';
      return '7년생 이상 (대형어)';
    },
    prohibitedLength: 35,
    prohibitedPeriod: '연중 (35cm 미만)',
    cookingTip: '회(찰진 식감), 미역국, 매운탕, 스테이크',
    fishingTips: '루어 웜, 다운샷, 생미끼(빙어/미꾸라지/생새우)',
    season: '9월 ~ 12월 (가을/초겨울 피크)',
    badgeColor: '#38bdf8',
    iconEmoji: '🐟',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Paralichthys_olivaceus.jpg/640px-Paralichthys_olivaceus.jpg',
    description: '눈이 왼쪽으로 쏠려 있어 "좌광우도"로 쉽게 구분합니다. 바닥에 납작하게 엎드려 모래색으로 위장하며 낚시인들에게 최고의 손맛과 입맛을 주는 대표 어종입니다.'
  },
  {
    id: 'black_rockfish',
    name: '조피볼락 (우럭)',
    scientificName: 'Sebastes schlegelii',
    englishName: 'Korean Rockfish',
    category: '바다',
    family: '양볼락과',
    habitat: '서해, 남해, 동해 중남부의 암초 지대 및 인공어초',
    depth: '수심 5 ~ 80m',
    waterTemp: '10 ~ 20℃',
    ageFormula: (lengthCm) => {
      if (lengthCm < 15) return '1년 미만';
      if (lengthCm < 23) return '1년생';
      if (lengthCm < 30) return '2~3년생';
      if (lengthCm < 38) return '4~5년생';
      if (lengthCm < 45) return '6~7년생';
      return '8년생 이상 (대물)';
    },
    prohibitedLength: 23,
    prohibitedPeriod: '연중 (23cm 미만)',
    cookingTip: '우럭 매운탕(진한 육수), 통구이, 회, 맑은탕(지리)',
    fishingTips: '오징어살, 지렁이, 웜 지그헤드, 어초 침선 낚시',
    season: '4월 ~ 6월, 10월 ~ 12월',
    badgeColor: '#64748b',
    iconEmoji: '🐡',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Sebastes_schlegelii.jpg/640px-Sebastes_schlegelii.jpg',
    description: '한국인이 가장 사랑하는 횟감이자 탕거리 어종. 암초 틈에 몸을 숨기다 빠르게 먹이를 덮치는 탐식성이 있어 묵직한 손맛을 자랑합니다.'
  },
  {
    id: 'red_seabream',
    name: '참돔',
    scientificName: 'Pagrus major',
    englishName: 'Red Seabream',
    category: '바다',
    family: '도미과',
    habitat: '남해, 서해 남부, 제주도 전역의 수중 암초와 자갈 바닥',
    depth: '수심 30 ~ 150m',
    waterTemp: '15 ~ 25℃',
    ageFormula: (lengthCm) => {
      if (lengthCm < 20) return '1년 미만';
      if (lengthCm < 30) return '1~2년생 (상사리)';
      if (lengthCm < 45) return '3~4년생';
      if (lengthCm < 60) return '5~6년생 (중형)';
      if (lengthCm < 75) return '7~9년생 (대물)';
      return '10년생 이상 (바다의 여왕)';
    },
    prohibitedLength: 24,
    prohibitedPeriod: '연중 (24cm 미만)',
    cookingTip: '도미 머리구이, 숙회(마스까와), 도미 솥밥, 도미 맑은탕',
    fishingTips: '타이라바(참돔 루어), 텐야, 찌낚시(크릴 미끼)',
    season: '5월 ~ 11월',
    badgeColor: '#f43f5e',
    iconEmoji: '🐠',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Pagrus_major.jpg/640px-Pagrus_major.jpg',
    description: '선홍색 비늘에 푸른 에메랄드 반점이 수놓아진 "바다의 여왕". 경사스러운 날 빠지지 않는 고급 어종으로 강력한 당길 힘을 선사합니다.'
  },
  {
    id: 'black_porgy',
    name: '감성돔',
    scientificName: 'Acanthopagrus schlegelii',
    englishName: 'Black Porgy',
    category: '바다',
    family: '도미과',
    habitat: '남해안 갯바위, 서해 중남부, 동해 남부의 거친 여밭 및 방파제',
    depth: '수심 5 ~ 40m',
    waterTemp: '12 ~ 24℃',
    ageFormula: (lengthCm) => {
      if (lengthCm < 17) return '1년 미만';
      if (lengthCm < 25) return '2년생 (삐드락)';
      if (lengthCm < 32) return '3년생';
      if (lengthCm < 40) return '4~5년생';
      if (lengthCm < 50) return '6~8년생 (대물 감성돔)';
      return '9년생 이상 (환상의 5짜)';
    },
    prohibitedLength: 25,
    prohibitedPeriod: '5월 1일 ~ 5월 31일 (산란기 금어기)',
    cookingTip: '감성돔 회(겨울철 최고), 감성돔 맑은탕, 구이',
    fishingTips: '바다 찌낚시, 크릴, 옥수수, 게 미끼, 밑밥 동조',
    season: '10월 ~ 익년 2월 (겨울 갯바위 낚시의 꽃)',
    badgeColor: '#0ea5e9',
    iconEmoji: '🐟',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Acanthopagrus_schlegelii_by_OpencFl.jpg/640px-Acanthopagrus_schlegelii_by_OpencFl.jpg',
    description: '바다 찌낚시의 최고봉. 경계심이 매우 강하고 예민하여 바다의 "은빛 전사"라 불립니다. 겨울철 쫀득한 육질은 일품입니다.'
  },
  {
    id: 'japanese_seabass',
    name: '농어',
    scientificName: 'Lateolabrax japonicus',
    englishName: 'Japanese Seabass',
    category: '바다',
    family: '농어과',
    habitat: '서해, 남해 연안, 기수역, 방파제 테트라포드, 여밭',
    depth: '수심 표층 ~ 30m',
    waterTemp: '15 ~ 25℃',
    ageFormula: (lengthCm) => {
      if (lengthCm < 30) return '1년 미만 (깔따구)';
      if (lengthCm < 45) return '1~2년생';
      if (lengthCm < 60) return '3~4년생';
      if (lengthCm < 75) return '5~6년생 (따오기급)';
      return '7년생 이상 (미터급 거물)';
    },
    prohibitedLength: 30,
    prohibitedPeriod: '연중 (30cm 미만)',
    cookingTip: '농어 회, 농어 스테이크, 맑은 뼛국(여름 보양식)',
    fishingTips: '플로팅 미노우, 싱킹 펜슬, 지그헤드 바이브레이션',
    season: '6월 ~ 10월 (여름 대표 어종)',
    badgeColor: '#10b981',
    iconEmoji: '🦈',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Lateolabrax_japonicus_by_OpencFl.jpg/640px-Lateolabrax_japonicus_by_OpencFl.jpg',
    description: '"여름 농어는 바라만 봐도 보약"이라는 말이 있을 정도로 여름철 최고 진미. 빠른 유영력과 바늘털이 점프로 짜릿한 스릴을 줍니다.'
  },
  {
    id: 'largehead_hairtail',
    name: '갈치',
    scientificName: 'Trichiurus lepturus',
    englishName: 'Largehead Hairtail',
    category: '바다',
    family: '갈치과',
    habitat: '제주도 연근해, 남해 및 서해 중남부 수역',
    depth: '수심 20 ~ 150m (야간 표층 부상)',
    waterTemp: '16 ~ 26℃',
    ageFormula: (lengthCm) => {
      if (lengthCm < 50) return '1년생 미만 (풀치)';
      if (lengthCm < 70) return '1~2년생 (2.5지)';
      if (lengthCm < 90) return '2~3년생 (3.5지)';
      if (lengthCm < 110) return '4년생 (4지 이상)';
      return '5년생 이상 (용갈치, 5지 대물)';
    },
    prohibitedLength: 18,
    prohibitedPeriod: '7월 1일 ~ 7월 31일',
    cookingTip: '은갈치 통구이, 갈치조림, 갈치회(싱싱한 은분 제거 후)',
    fishingTips: '야간 집어등 루어(메탈지그/물결채비), 꽁치 미끼 생미끼 채비',
    season: '8월 ~ 11월',
    badgeColor: '#e2e8f0',
    iconEmoji: '🗡️',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Trichiurus_lepturus_01.jpg/640px-Trichiurus_lepturus_01.jpg',
    description: '칼 모양을 닮아 이름 붙여진 은빛 생선. 야간에 곧추선 채 유영하는 독특한 생태를 지니며 밤낚시의 황제로 불립니다.'
  },
  {
    id: 'chub_mackerel',
    name: '고등어',
    scientificName: 'Scomber japonicus',
    englishName: 'Chub Mackerel',
    category: '바다',
    family: '고등어과',
    habitat: '동해, 남해, 서해 전 연안의 표층 및 중층',
    depth: '수심 표층 ~ 50m',
    waterTemp: '14 ~ 22℃',
    ageFormula: (lengthCm) => {
      if (lengthCm < 18) return '6개월 미만';
      if (lengthCm < 25) return '1년생';
      if (lengthCm < 32) return '2년생';
      if (lengthCm < 38) return '3년생';
      return '4년생 이상';
    },
    prohibitedLength: 21,
    prohibitedPeriod: '4월 ~ 5월 중 1개월 (지자체 고시)',
    cookingTip: '고등어 자반구이, 고등어 묵은지조림, 시메사바(초절임)',
    fishingTips: '카드 채비, 메탈지그, 크릴 밑밥 찌낚시',
    season: '8월 ~ 11월 (가을 고등어)',
    badgeColor: '#0284c7',
    iconEmoji: '🐟',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Scomber_japonicus.jpg/640px-Scomber_japonicus.jpg',
    description: '국민 생선 고등어. 등에 선명한 청록색 호랑이 무늬와 은백색 복부를 가지며, 떼를 지어 회유하며 바늘을 무는 순간 폭발적인 유영 속도로 손맛을 즐겁게 해줍니다.'
  },
  {
    id: 'largemouth_bass',
    name: '배스 (큰입배스)',
    scientificName: 'Micropterus salmoides',
    englishName: 'Largemouth Bass',
    category: '민물',
    family: '검정우럭과',
    habitat: '전국 저수지, 댐, 강 하류, 수로의 수초 및 장애물 지대',
    depth: '수심 0.5 ~ 10m',
    waterTemp: '15 ~ 28℃',
    ageFormula: (lengthCm) => {
      if (lengthCm < 20) return '1년생';
      if (lengthCm < 30) return '2년생';
      if (lengthCm < 40) return '3~4년생';
      if (lengthCm < 50) return '5~6년생 (런커)';
      return '7년생 이상 (빅베이트 대상어)';
    },
    prohibitedLength: 0,
    prohibitedPeriod: '없음 (사계절 루어낚시)',
    cookingTip: '서양식 버터구이, 어묵, 튀김 (생태계 보호를 위한 포획 장려)',
    fishingTips: '소프트베이트(프리리그, 네꼬리그), 크랭크베이트, 탑워터',
    season: '3월 ~ 11월 (봄 산란기/가을 대활성)',
    badgeColor: '#84cc16',
    iconEmoji: '🎣',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Micropterus_salmoides_USFWS.jpg/640px-Micropterus_salmoides_USFWS.jpg',
    description: '민물 루어낚시의 대명사. 화려한 점프 바늘털이와 강력한 공격성으로 세계에서 가장 인기 있는 스포츠 피싱 어종입니다.'
  },
  {
    id: 'crucian_carp',
    name: '붕어',
    scientificName: 'Carassius carassius',
    englishName: 'Crucian Carp',
    category: '민물',
    family: '잉어과',
    habitat: '전국 하천, 늪, 저수지 수초 지대',
    depth: '수심 1 ~ 4m',
    waterTemp: '15 ~ 25℃',
    ageFormula: (lengthCm) => {
      if (lengthCm < 15) return '1~2년생';
      if (lengthCm < 21) return '3년생 (7치)';
      if (lengthCm < 27) return '4~5년생 (9치)';
      if (lengthCm < 31) return '6~7년생 (월척 30.3cm)';
      return '8년생 이상 (사짜 대물)';
    },
    prohibitedLength: 0,
    prohibitedPeriod: '없음',
    cookingTip: '붕어 찜, 붕어즙, 어탕국수, 튀김',
    fishingTips: '민물 올림찌낚시, 글루텐 떡밥, 지렁이, 옥수수',
    season: '봄 산란철 (3~5월), 가을 (9~11월)',
    badgeColor: '#eab308',
    iconEmoji: '🎏',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Carassius_carassius_Prague_Vltava_2.jpg/640px-Carassius_carassius_Prague_Vltava_2.jpg',
    description: '한국 전통 민물낚시의 영원한 벗. 고요한 수면 위 찌가 솟아오르는 환상적인 찌올림은 붕어낚시만의 독보적인 묘미입니다.'
  },
  {
    id: 'pacific_cod',
    name: '대구',
    scientificName: 'Gadus macrocephalus',
    englishName: 'Pacific Cod',
    category: '바다',
    family: '대구과',
    habitat: '동해 전역 및 남해 진해만 (냉수성 회유 어종)',
    depth: '수심 30 ~ 250m 깊은 바다',
    waterTemp: '2 ~ 10℃',
    ageFormula: (lengthCm) => {
      if (lengthCm < 35) return '1년 미만';
      if (lengthCm < 50) return '1~2년생';
      if (lengthCm < 65) return '3~4년생';
      if (lengthCm < 80) return '5~6년생 (미터급 육박)';
      return '7년생 이상 (대구 중의 대구)';
    },
    prohibitedLength: 35,
    prohibitedPeriod: '1월 16일 ~ 2월 15일 (부산/경남/울산 등 해역별 고시)',
    cookingTip: '생대구 맑은탕(겨울 진미), 대구전, 대구 뽈찜',
    fishingTips: '동해 심해 메탈지그(메탈 300~500g), 슬로우 지깅',
    season: '12월 ~ 2월 (겨울 심해 지깅)',
    badgeColor: '#3b82f6',
    iconEmoji: '🐟',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Pacific_cod.jpg/640px-Pacific_cod.jpg',
    description: '입이 커서 대구(大口)라 불리는 겨울 바다의 귀족. 담백하고 시원한 살코기와 진한 국물 맛으로 겨울철 낚시인들의 심해 원정을 부릅니다.'
  }
];

const FISHING_EVENTS = [
  {
    id: 'ev-west-flounder',
    title: '서해안 가을 대광어 챌린지',
    sponsor: '다이와코리아 & 보령시',
    period: '2026.09.01 ~ 2026.11.30',
    targetSpecies: 'olive_flounder',
    targetSpeciesName: '넙치 (광어)',
    targetRegion: '서해',
    minSize: 50,
    rewardSummary: '최대 50,000 P + 낚시용품 30% 할인쿠폰',
    bannerGradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    description: '특허 [수학식 1] 가중치에 따라 어종(50%), 지역(20%), 시기(20%), 크기(10%)를 종합 평가하여 보상을 지급합니다.',
    rewards: [
      { tier: '최대 보상 (0.9 이상)', prize: '50,000 P + 다이와 30% 할인권 + 명예 배지' },
      { tier: '일반 보상 (0.7 ~ 0.9)', prize: '20,000 P + 라인/루어 용품 교환권' },
      { tier: '기본 보상 (0.7 미만)', prize: '5,000 P 참가 보상 포인트' }
    ]
  },
  {
    id: 'ev-gangneung-cod',
    title: '강릉 동해 심해 생태 모니터링 조사',
    sponsor: '국립수산연구원 & 강릉시',
    period: '2026.10.01 ~ 2026.12.31',
    targetSpecies: 'pacific_cod',
    targetSpeciesName: '대구 / 명태',
    targetRegion: '동해',
    minSize: 45,
    rewardSummary: '생태 연구 참여비 30,000 P 지급',
    bannerGradient: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
    description: '수산연구기관의 연안 냉수성 어종 자원 모니터링 참여 이벤트. 위조 방지 해시 검증 통과 시 보상 지급.',
    rewards: [
      { tier: '최대 보상 (0.9 이상)', prize: '연구 참여비 30,000 P + 수산청 감사장' },
      { tier: '일반 보상 (0.7 ~ 0.9)', prize: '연구 참여비 15,000 P' },
      { tier: '기본 보상 (0.7 미만)', prize: '5,000 P' }
    ]
  },
  {
    id: 'ev-south-porgy',
    title: '남해안 감성돔 윈터 챔피언십',
    sponsor: '시마노 피싱 & 여수시',
    period: '2026.10.15 ~ 2027.01.31',
    targetSpecies: 'black_porgy',
    targetSpeciesName: '감성돔',
    targetRegion: '남해',
    minSize: 40,
    rewardSummary: '최대 100,000 P + 낚시 리조트 숙박권',
    bannerGradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    description: '거친 갯바위의 은빛 전사 감성돔 4짜 이상에 도전하세요! 지역 관광 숙박 연계 바우처 제공.',
    rewards: [
      { tier: '최대 보상 (0.9 이상)', prize: '100,000 P + 여수 피싱리조트 1박 숙박권' },
      { tier: '일반 보상 (0.7 ~ 0.9)', prize: '30,000 P + 찌낚시 소품 세트' },
      { tier: '기본 보상 (0.7 미만)', prize: '5,000 P' }
    ]
  }
];

const INITIAL_CATCH_LOGS = [
  {
    id: 'log-101',
    speciesId: 'olive_flounder',
    speciesName: '넙치 (광어)',
    lengthCm: 62.5,
    weightKg: 2.8,
    estimatedAge: '4년생',
    date: '2026-10-18',
    time: '07:25',
    region: '서해',
    locationName: '충남 보령 오천항 앞바다 (어초)',
    latitude: 36.3882,
    longitude: 126.5147,
    tide: '7물 / 사리',
    weather: '맑음, 북동풍 4m/s, 파고 0.5m',
    bait: '스트레이트 웜 5인치 (모터오일 색상)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Paralichthys_olivaceus.jpg/640px-Paralichthys_olivaceus.jpg',
    confidence: 96.8,
    hashValid: true,
    eventMatched: 'ev-west-flounder',
    rewardScore: 0.94,
    rewardClaimed: true,
    comments: [
      {
        id: 'cmt-1',
        authorNickname: '제주 참돔러버',
        authorAvatar: '🐠',
        authorLevel: '타이라바 마스터',
        text: '와 6짜 대광어 축하드립니다! 오천항 몇 번 어초에서 낚으셨나요?',
        createdAt: '2026-10-18T09:30:00Z'
      },
      {
        id: 'cmt-2',
        authorNickname: '서해 대물사냥꾼',
        authorAvatar: '🦈',
        authorLevel: '프로 앵글러',
        text: '다운샷 5인치 웜 조합이 기가 막혔네요! 손맛 최고였겠습니다 👍',
        createdAt: '2026-10-18T10:15:00Z'
      }
    ]
  },
  {
    id: 'log-102',
    speciesId: 'black_rockfish',
    speciesName: '조피볼락 (우럭)',
    lengthCm: 32.0,
    weightKg: 0.7,
    estimatedAge: '2~3년생',
    date: '2026-10-14',
    time: '15:40',
    region: '서해',
    locationName: '인천 옹진군 덕적도 북단 여밭',
    latitude: 37.2612,
    longitude: 126.1345,
    tide: '3물',
    weather: '구름 조금, 북서풍 2m/s',
    bait: '생물 갯지렁이 & 꼴뚜기',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Sebastes_schlegelii.jpg/640px-Sebastes_schlegelii.jpg',
    confidence: 93.4,
    hashValid: true,
    eventMatched: null,
    rewardScore: 0.0,
    rewardClaimed: false,
    comments: [
      {
        id: 'cmt-3',
        authorNickname: '바다의 승부사',
        authorAvatar: '🎣',
        authorLevel: '프로 앵글러',
        text: '덕적도 여밭 우럭은 빵이 남다르네요! 회 맛도 끝내주겠습니다.',
        createdAt: '2026-10-14T18:00:00Z'
      }
    ]
  }
];

// =============================================================================
// 전국 27대 연안 및 내수면 어종 생태 명포인트 빅데이터
// =============================================================================
const FISHING_POINTS_DATA = [
  // 1. 서해안 (인천 ~ 전북)
  {
    id: 'pt-w-1',
    name: '인천 영흥도 진두항',
    region: '서해',
    subRegion: '인천/경기',
    x: 24,
    y: 26,
    primaryFish: ['조피볼락 (우럭)', '넙치 (광어)', '농어'],
    speciesIds: ['black_rockfish', 'olive_flounder', 'japanese_seabass'],
    depth: '15 ~ 35m',
    bestTide: '2물 ~ 5물',
    bait: '스트레이트 웜, 생새우, 미꾸라지',
    waterTemp: '16.5℃',
    activityStar: 5,
    description: '수도권 최대 바다 출조 기지. 침선 우럭과 여밭 대광어 다운샷 출조가 연중 성황을 이룹니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Sebastes_schlegelii.jpg/640px-Sebastes_schlegelii.jpg'
  },
  {
    id: 'pt-w-2',
    name: '안산 시화방조제 방아머리',
    region: '서해',
    subRegion: '인천/경기',
    x: 25,
    y: 28,
    primaryFish: ['우럭', '삼치', '망둥어'],
    speciesIds: ['black_rockfish'],
    depth: '5 ~ 15m',
    bestTide: '만조 전후 2시간',
    bait: '메탈지그, 청갯지렁이, 웜',
    waterTemp: '17.0℃',
    activityStar: 4,
    description: '워킹 루어 낚시의 성지. 조류 소통이 원활하여 가을철 삼치 캐스팅과 석축 우럭 탐사가 활발합니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Sebastes_schlegelii.jpg/640px-Sebastes_schlegelii.jpg'
  },
  {
    id: 'pt-w-3',
    name: '당진 왜목마을 & 삼길포항',
    region: '서해',
    subRegion: '충남',
    x: 23,
    y: 33,
    primaryFish: ['조피볼락 (우럭)', '노래미', '주꾸미'],
    speciesIds: ['black_rockfish'],
    depth: '8 ~ 20m',
    bestTide: '조금 ~ 4물',
    bait: '오징어살, 에기, 지렁이',
    waterTemp: '17.2℃',
    activityStar: 4,
    description: '삼길포 선상유람과 방파제 원투낚시, 가을철 주꾸미/갑오징어 에깅 명소입니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Sebastes_schlegelii.jpg/640px-Sebastes_schlegelii.jpg'
  },
  {
    id: 'pt-w-4',
    name: '태안 안면도 영목항',
    region: '서해',
    subRegion: '충남',
    x: 20,
    y: 39,
    primaryFish: ['넙치 (광어)', '갑오징어', '우럭'],
    speciesIds: ['olive_flounder', 'black_rockfish'],
    depth: '10 ~ 25m',
    bestTide: '5물 ~ 9물',
    bait: '에기 채비, 섀드웜, 생미끼',
    waterTemp: '17.8℃',
    activityStar: 5,
    description: '천수만과 서해 외연도를 잇는 관문. 가을철 대형 갑오징어와 미터급 광어가 배출되는 곳입니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Paralichthys_olivaceus.jpg/640px-Paralichthys_olivaceus.jpg'
  },
  {
    id: 'pt-w-5',
    name: '보령 오천항 & 대천항',
    region: '서해',
    subRegion: '충남',
    x: 22,
    y: 43,
    primaryFish: ['넙치 (광어)', '참돔', '주꾸미'],
    speciesIds: ['olive_flounder', 'red_seabream'],
    depth: '15 ~ 40m',
    bestTide: '6물 ~ 10물',
    bait: '다운샷 웜, 타이라바, 애자',
    waterTemp: '18.1℃',
    activityStar: 5,
    description: '대한민국 주꾸미·대광어 다운샷의 수도. 가을 시즌 전국 앵글러들의 발길이 끊이지 않는 곳입니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Paralichthys_olivaceus.jpg/640px-Paralichthys_olivaceus.jpg'
  },
  {
    id: 'pt-w-6',
    name: '서천 홍원항 & 마량진항',
    region: '서해',
    subRegion: '충남',
    x: 23,
    y: 48,
    primaryFish: ['도다리', '감성돔', '갑오징어'],
    speciesIds: ['black_porgy'],
    depth: '10 ~ 25m',
    bestTide: '3물 ~ 6물',
    bait: '혼무시(참갯지렁이), 왕눈이에기',
    waterTemp: '18.5℃',
    activityStar: 4,
    description: '동백정 앞 갯바위 감성돔 찌낚시와 봄 도다리, 가을 갑오징어 선상 배낚시가 유명합니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Acanthopagrus_schlegelii.jpg/640px-Acanthopagrus_schlegelii.jpg'
  },
  {
    id: 'pt-w-7',
    name: '군산 비응항 & 고군산군도',
    region: '서해',
    subRegion: '전북',
    x: 24,
    y: 53,
    primaryFish: ['참돔', '농어', '넙치 (광어)'],
    speciesIds: ['red_seabream', 'japanese_seabass', 'olive_flounder'],
    depth: '20 ~ 55m',
    bestTide: '4물 ~ 8물',
    bait: '타이라바, 바이브레이션, 미노우',
    waterTemp: '18.8℃',
    activityStar: 5,
    description: '선유도·말도·연도 해역의 거대한 조류 소통으로 대물 참돔 빠가와 농어 떼가 출몰하는 황금 어장입니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Pagrus_major.jpg/640px-Pagrus_major.jpg'
  },
  {
    id: 'pt-w-8',
    name: '부안 격포항 & 위도',
    region: '서해',
    subRegion: '전북',
    x: 23,
    y: 58,
    primaryFish: ['감성돔', '우럭', '참돔'],
    speciesIds: ['black_porgy', 'black_rockfish'],
    depth: '12 ~ 35m',
    bestTide: '5물 ~ 9물',
    bait: '크릴, 혼무시, 게미끼',
    waterTemp: '19.0℃',
    activityStar: 4,
    description: '변산반도 칠산바다의 거친 여밭 지형으로 가을 5짜 감성돔 찌낚시의 본산입니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Acanthopagrus_schlegelii.jpg/640px-Acanthopagrus_schlegelii.jpg'
  },

  // 2. 남해안 (전남 ~ 경남 ~ 부산)
  {
    id: 'pt-s-1',
    name: '목포 평화광장 & 북항',
    region: '남해',
    subRegion: '전남',
    x: 23,
    y: 72,
    primaryFish: ['갈치', '감성돔', '농어'],
    speciesIds: ['largehead_hairtail', 'black_porgy'],
    depth: '10 ~ 20m',
    bestTide: '조금 ~ 4물 (야간)',
    bait: '꽁치 썬 살, 물결웜 채비',
    waterTemp: '19.5℃',
    activityStar: 5,
    description: '목포 앞바다 갈치 축제의 본고장. 야간 집어등 아래 은빛 갈치 낚시가 일품입니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Trichiurus_lepturus_01.jpg/640px-Trichiurus_lepturus_01.jpg'
  },
  {
    id: 'pt-s-2',
    name: '완도 신지명사십리 & 청산도',
    region: '남해',
    subRegion: '전남',
    x: 29,
    y: 80,
    primaryFish: ['감성돔', '돌돔', '참돔'],
    speciesIds: ['black_porgy', 'red_seabream'],
    depth: '15 ~ 45m',
    bestTide: '4물 ~ 7물',
    bait: '성게, 참갯지렁이, 게미끼',
    waterTemp: '20.2℃',
    activityStar: 5,
    description: '남해 서부 최고의 갯바위 명소. 웅장한 여밭에서 대물 감성돔과 힘 좋은 참돔이 낚입니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Acanthopagrus_schlegelii.jpg/640px-Acanthopagrus_schlegelii.jpg'
  },
  {
    id: 'pt-s-3',
    name: '고흥 녹동항 & 거금도',
    region: '남해',
    subRegion: '전남',
    x: 36,
    y: 79,
    primaryFish: ['감성돔', '문어', '볼락'],
    speciesIds: ['black_porgy'],
    depth: '8 ~ 25m',
    bestTide: '조금 ~ 5물',
    bait: '왕눈이에기, 크릴, 청지렁이',
    waterTemp: '20.0℃',
    activityStar: 4,
    description: '득량만과 여자만을 아우르는 천혜의 낚시터. 굵은 돌문어와 찰진 감성돔 손맛을 보장합니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Acanthopagrus_schlegelii.jpg/640px-Acanthopagrus_schlegelii.jpg'
  },
  {
    id: 'pt-s-4',
    name: '여수 거문도 & 백도 해역',
    region: '남해',
    subRegion: '전남',
    x: 44,
    y: 83,
    primaryFish: ['갈치', '참돔', '벵에돔'],
    speciesIds: ['largehead_hairtail', 'red_seabream'],
    depth: '40 ~ 90m',
    bestTide: '무관 (선상/원도권)',
    bait: '생미끼, 메탈지그, 크릴',
    waterTemp: '21.5℃',
    activityStar: 5,
    description: '대한민국 원도권 낚시 1번지. 5지 이상 특대 드래곤 갈치와 대형 참돔의 본거지입니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Trichiurus_lepturus_01.jpg/640px-Trichiurus_lepturus_01.jpg'
  },
  {
    id: 'pt-s-5',
    name: '통영 욕지도 & 사량도',
    region: '남해',
    subRegion: '경남',
    x: 52,
    y: 78,
    primaryFish: ['참돔', '볼락', '무늬오징어'],
    speciesIds: ['red_seabream'],
    depth: '20 ~ 50m',
    bestTide: '4물 ~ 9물',
    bait: '타이라바, 야광에기, 청지렁이',
    waterTemp: '20.5℃',
    activityStar: 5,
    description: '한려수도의 심장부. 사계절 바다의 여왕 참돔 타이라바와 야간 락피싱 볼락 루어가 유명합니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Pagrus_major.jpg/640px-Pagrus_major.jpg'
  },
  {
    id: 'pt-s-6',
    name: '거제 구조라 & 지심도',
    region: '남해',
    subRegion: '경남',
    x: 58,
    y: 76,
    primaryFish: ['벵에돔', '감성돔', '무늬오징어'],
    speciesIds: ['black_porgy'],
    depth: '15 ~ 35m',
    bestTide: '2물 ~ 6물',
    bait: '빵가루, 크릴 경단, 팁런에기',
    waterTemp: '20.3℃',
    activityStar: 5,
    description: '동백섬 지심도 갯바위 벵에돔 찌낚시와 가을 팁런 무늬오징어 선상낚시의 명포인트입니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Acanthopagrus_schlegelii.jpg/640px-Acanthopagrus_schlegelii.jpg'
  },
  {
    id: 'pt-s-7',
    name: '부산 기장 대변항 & 오륙도',
    region: '남해',
    subRegion: '부산',
    x: 65,
    y: 72,
    primaryFish: ['고등어', '농어', '전갱이'],
    speciesIds: ['chub_mackerel', 'japanese_seabass'],
    depth: '12 ~ 30m',
    bestTide: '초들물 ~ 만조',
    bait: '카드채비, 메탈지그, 크릴',
    waterTemp: '19.8℃',
    activityStar: 4,
    description: '동해와 남해가 교차하는 해역. 가을철 기름 오른 고등어·전갱이 생활낚시와 농어 루어가 성황입니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Scomber_japonicus.jpg/640px-Scomber_japonicus.jpg'
  },

  // 3. 동해안 (울산 ~ 강원)
  {
    id: 'pt-e-1',
    name: '울산 방어진 & 간절곶',
    region: '동해',
    subRegion: '울산',
    x: 68,
    y: 67,
    primaryFish: ['방어', '부시리', '참돔'],
    speciesIds: ['red_seabream'],
    depth: '30 ~ 70m',
    bestTide: '조류가 빠른 사리물때',
    bait: '빅게임 메탈지그, 펜슬베이트',
    waterTemp: '18.9℃',
    activityStar: 5,
    description: '간절곶 앞바다의 강력한 조류대. 미터급 대방어 지깅과 부시리 파이팅이 펼쳐지는 곳입니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Pagrus_major.jpg/640px-Pagrus_major.jpg'
  },
  {
    id: 'pt-e-2',
    name: '포항 영일만항 & 호미곶',
    region: '동해',
    subRegion: '경북',
    x: 69,
    y: 59,
    primaryFish: ['삼치', '방어', '대구'],
    speciesIds: ['pacific_cod'],
    depth: '25 ~ 80m',
    bestTide: '아침 피딩 타임',
    bait: '롱 메탈지그, 스푼',
    waterTemp: '18.0℃',
    activityStar: 5,
    description: '영일만 북방파제와 호미곶 앞바다. 가을 대삼치 지깅과 겨울철 심해 대구 낚시의 출발점입니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Gadus_macrocephalus_NOAA.jpg/640px-Gadus_macrocephalus_NOAA.jpg'
  },
  {
    id: 'pt-e-3',
    name: '영덕 축산항 & 강구항',
    region: '동해',
    subRegion: '경북',
    x: 67,
    y: 51,
    primaryFish: ['무늬오징어', '가자미', '우럭'],
    speciesIds: ['black_rockfish'],
    depth: '15 ~ 45m',
    bestTide: '새벽 및 해질녘',
    bait: '에기, 청갯지렁이',
    waterTemp: '17.3℃',
    activityStar: 4,
    description: '영덕 블루로드 해안 바위 지대. 청정 바다에서 즐기는 에깅과 방파제 원투낚시 명소입니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Sebastes_schlegelii.jpg/640px-Sebastes_schlegelii.jpg'
  },
  {
    id: 'pt-e-4',
    name: '울진 후포항 & 왕돌초',
    region: '동해',
    subRegion: '경북',
    x: 66,
    y: 43,
    primaryFish: ['부시리', '대구', '방어'],
    speciesIds: ['pacific_cod'],
    depth: '40 ~ 130m',
    bestTide: '맑고 파도 잔잔한 날',
    bait: '200g+ 슬로우지그, 꼴뚜기',
    waterTemp: '16.8℃',
    activityStar: 5,
    description: '동해 최대 해저산맥 왕돌초. 괴물급 부시리와 대구 지깅의 성지로 불립니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Gadus_macrocephalus_NOAA.jpg/640px-Gadus_macrocephalus_NOAA.jpg'
  },
  {
    id: 'pt-e-5',
    name: '삼척 장호항 & 임원항',
    region: '동해',
    subRegion: '강원',
    x: 62,
    y: 34,
    primaryFish: ['임연수어', '가자미', '대구'],
    speciesIds: ['pacific_cod'],
    depth: '30 ~ 90m',
    bestTide: '아침 만조 전후',
    bait: '크릴 미끼, 편대 카드채비',
    waterTemp: '15.9℃',
    activityStar: 4,
    description: '한국의 나폴리 장호항. 겨울철 살 오른 어사가자미 선상 낚시와 대구 지깅이 인기입니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Gadus_macrocephalus_NOAA.jpg/640px-Gadus_macrocephalus_NOAA.jpg'
  },
  {
    id: 'pt-e-6',
    name: '강릉 주문진항 & 안목항',
    region: '동해',
    subRegion: '강원',
    x: 58,
    y: 26,
    primaryFish: ['대구', '피문어', '도루묵'],
    speciesIds: ['pacific_cod'],
    depth: '40 ~ 120m',
    bestTide: '사계절 (수온 12~16도)',
    bait: '대구 지그, 문어 볼락채비',
    waterTemp: '15.2℃',
    activityStar: 5,
    description: '특허 [0078] 심해 생태 모니터링 주 거점. 찬 한류수역에서 살이 단단한 대구와 대왕문어가 낚입니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Gadus_macrocephalus_NOAA.jpg/640px-Gadus_macrocephalus_NOAA.jpg'
  },
  {
    id: 'pt-e-7',
    name: '속초 동명항 & 대포항',
    region: '동해',
    subRegion: '강원',
    x: 55,
    y: 19,
    primaryFish: ['문어', '도자미', '우럭'],
    speciesIds: ['black_rockfish'],
    depth: '20 ~ 60m',
    bestTide: '파고 0.5m 이하의 맑은 날',
    bait: '반짝이 문어채비, 지렁이',
    waterTemp: '14.8℃',
    activityStar: 4,
    description: '설악산 풍경을 마주하는 강원 북부 명포인트. 쫀득한 식감의 동해 참문어 에깅이 성황입니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Sebastes_schlegelii.jpg/640px-Sebastes_schlegelii.jpg'
  },

  // 4. 제주권 (제주도 전역)
  {
    id: 'pt-j-1',
    name: '제주 모슬포항 & 차귀도',
    region: '제주',
    subRegion: '제주 서부',
    x: 23,
    y: 91,
    primaryFish: ['방어', '부시리', '참돔'],
    speciesIds: ['red_seabream'],
    depth: '35 ~ 85m',
    bestTide: '조류 거센 사리물때',
    bait: '빅베이트, 타이라바, 지깅',
    waterTemp: '22.4℃',
    activityStar: 5,
    description: '대한민국 방어 축제의 고향 모슬포. 거친 물살에서 힘을 키운 특대방어 파이팅이 최고조에 달합니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Pagrus_major.jpg/640px-Pagrus_major.jpg'
  },
  {
    id: 'pt-j-2',
    name: '서귀포 성산포항 & 우도',
    region: '제주',
    subRegion: '제주 동부',
    x: 34,
    y: 90,
    primaryFish: ['돌돔', '벵에돔', '무늬오징어'],
    speciesIds: ['black_porgy'],
    depth: '15 ~ 50m',
    bestTide: '들물 시기 (야간 에깅)',
    bait: '오분자기, 성게, 전갱이 생미끼',
    waterTemp: '22.8℃',
    activityStar: 5,
    description: '에메랄드빛 우도 갯바위. 6짜 대물 돌돔과 긴꼬리벵에돔, 대형 킬로급 무늬오징어가 반겨줍니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Acanthopagrus_schlegelii.jpg/640px-Acanthopagrus_schlegelii.jpg'
  },
  {
    id: 'pt-j-3',
    name: '제주 북부 애월 & 한림항',
    region: '제주',
    subRegion: '제주 북부',
    x: 28,
    y: 87,
    primaryFish: ['한치', '은갈치', '참돔'],
    speciesIds: ['largehead_hairtail', 'red_seabream'],
    depth: '20 ~ 60m',
    bestTide: '야간 집어등 낚시',
    bait: '이카메탈, 꽁치살 채비',
    waterTemp: '22.0℃',
    activityStar: 5,
    description: '여름밤을 수놓는 한치·갈치 불야성. 제주 북부 바다의 대표적인 선상 패밀리 피싱 포인트입니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Trichiurus_lepturus_01.jpg/640px-Trichiurus_lepturus_01.jpg'
  },

  // 5. 내수면 (민물 대표 수역)
  {
    id: 'pt-f-1',
    name: '춘천 의암호 & 소양호',
    region: '내수면',
    subRegion: '강원 내수면',
    x: 44,
    y: 20,
    primaryFish: ['배스 (큰입배스)', '쏘가리', '붕어'],
    speciesIds: ['largemouth_bass', 'crucian_carp'],
    depth: '2 ~ 12m',
    bestTide: '새벽 물안개 필 때',
    bait: '미노우, 지그헤드, 프리리그',
    waterTemp: '16.0℃',
    activityStar: 5,
    description: '민물 루어 낚시의 성지. 의암호 인공 수초섬과 소양호 바위 지대의 당찬 런커 배스와 쏘가리 포인트입니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Micropterus_salmoides_USFWS.jpg/640px-Micropterus_salmoides_USFWS.jpg'
  },
  {
    id: 'pt-f-2',
    name: '충주 충주호 & 탄금호',
    region: '내수면',
    subRegion: '충북 내수면',
    x: 45,
    y: 33,
    primaryFish: ['붕어', '배스', '쏘가리'],
    speciesIds: ['crucian_carp', 'largemouth_bass'],
    depth: '3 ~ 15m',
    bestTide: '해질녘 ~ 밤낚시',
    bait: '떡밥(글루텐), 지렁이, 웜',
    waterTemp: '16.5℃',
    activityStar: 5,
    description: '대물 토종 붕어 월척·사짜의 산실. 깊고 푸른 호수에서 펼쳐지는 정통 찌올림 붕어낚시의 최고봉입니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Carassius_carassius_1.jpg/640px-Carassius_carassius_1.jpg'
  }
];

