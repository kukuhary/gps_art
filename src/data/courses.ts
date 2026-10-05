import type { GpsArtCourse } from '../types/course';

export const INITIAL_COURSES: GpsArtCourse[] = [
  {
    id: 'songpa-puppy-run',
    title: '송파 올림픽 댕댕이런',
    subtitle: '방이동 블록과 올림픽공원 둘레길이 만드는 앉아있는 강아지',
    region: '서울',
    district: '송파구 방이동 · 올림픽공원',
    shapeCategory: '동물',
    shapeName: '강아지',
    distanceKm: 6.8,
    estimatedMinutes: 45,
    difficulty: '보통',
    startPointName: '몽촌토성역 1번 출구 평화의 문 광장',
    nearestStation: '8호선 몽촌토성역 / 9호선 한성백제역',
    accentColor: '#FF5500',
    secondaryColor: '#FFD1B8',
    description:
      '대한민국 러너들 사이에서 가장 사랑받는 대표적인 강아지 GPS 아트 코스입니다. 평화의 광장에서 출발해 귀와 코끝을 그린 뒤 방이동 격자 골목을 따라 앞발과 복슬복슬한 꼬리까지 완성합니다.',
    tags: ['강아지런', '올림픽공원', '입문자추천', '야간러닝명소'],
    likes: 342,
    createdAt: '2026-03-15',
    center: [37.5155, 127.1165],
    zoom: 14,
    coordinates: [
      // Start at neck/collar (Peace Gate area)
      [37.5182, 127.1135],
      // Snout & Nose going left-up
      [37.5192, 127.1095],
      [37.5206, 127.1088],
      [37.5218, 127.1105],
      // Forehead
      [37.5222, 127.1132],
      // Floppy Ear loop
      [37.5245, 127.1152],
      [37.5242, 127.1178],
      [37.5208, 127.1176],
      [37.5198, 127.1162],
      [37.5218, 127.1168],
      // Back of head & neck
      [37.5204, 127.1192],
      [37.5175, 127.1202],
      // Back & Cute curled tail
      [37.5145, 127.1225],
      [37.5158, 127.1255],
      [37.5142, 127.1268],
      [37.5125, 127.1242],
      // Hind leg
      [37.5092, 127.1230],
      [37.5086, 127.1195],
      [37.5110, 127.1192],
      // Belly
      [37.5116, 127.1150],
      // Front paws
      [37.5088, 127.1142],
      [37.5088, 127.1112],
      [37.5135, 127.1120],
      // Chest back to start
      [37.5162, 127.1128],
      [37.5182, 127.1135],
    ],
    decorations: [
      {
        id: 'dog-eye',
        type: 'eye',
        position: [37.5210, 127.1128],
        scale: 1.1,
      },
      {
        id: 'dog-nose',
        type: 'nose',
        position: [37.5205, 127.1089],
        scale: 1.15,
      },
      {
        id: 'dog-blush',
        type: 'blush',
        position: [37.5195, 127.1122],
        color: '#FF7890',
        scale: 1.1,
      },
      {
        id: 'dog-ear',
        type: 'ear',
        position: [37.5222, 127.1166],
        text: '귀 포인트',
      },
      {
        id: 'dog-sparkle',
        type: 'sparkle',
        position: [37.5154, 127.1260],
        text: '살랑 꼬리',
      },
    ],
    waypoints: [
      {
        index: 0,
        title: '출발 · 목줄 포인트 (평화의 광장)',
        description: '몽촌토성역 1번 출구 앞에서 코스를 시작합니다.',
      },
      {
        index: 2,
        title: '강아지 코끝 회전 구간',
        description: '성내천 진입 전 사거리에서 코 모양을 둥글게 돌아 나옵니다.',
      },
      {
        index: 6,
        title: '접힌 귀 디테일 구간',
        description: '강아지의 처진 귀 실루엣을 만드는 핵심 골목길입니다.',
      },
      {
        index: 14,
        title: '복슬 꼬리 반환점',
        description: '올림픽선수기자촌 아파트 사거리에서 꼬리를 말아 내려옵니다.',
      },
    ],
  },
  {
    id: 'seongsu-cat-run',
    title: '성수·서울숲 식빵 고양이런',
    subtitle: '서울숲 산책로와 성수동 카페거리를 잇는 쫑긋 귀 고양이',
    region: '서울',
    district: '성동구 서울숲 · 성수동',
    shapeCategory: '동물',
    shapeName: '고양이',
    distanceKm: 5.2,
    estimatedMinutes: 34,
    difficulty: '쉬움',
    startPointName: '서울숲역 3번 출구 언더스탠드에비뉴 앞',
    nearestStation: '수인분당선 서울숲역 / 2호선 뚝섬역',
    accentColor: '#8B5CF6',
    secondaryColor: '#DDD6FE',
    description:
      '뾰족한 양쪽 고양이 귀를 서울숲 메타세쿼이아 길과 뚝섬역 블록으로 그리고, 성수동 연무장길에서 동그랗게 식빵을 굽는 몸통과 말아 올린 꼬리를 완성하는 감성 코스입니다.',
    tags: ['고양이런', '성수동', '서울숲', '평탄한코스'],
    likes: 289,
    createdAt: '2026-04-02',
    center: [37.5438, 127.0468],
    zoom: 14,
    coordinates: [
      // Start at left cheek
      [37.5450, 127.0398],
      // Left pointed cat ear
      [37.5495, 127.0405],
      [37.5472, 127.0435],
      // Forehead flat
      [37.5472, 127.0472],
      // Right pointed cat ear
      [37.5496, 127.0502],
      [37.5450, 127.0510],
      // Right cheek & shoulder
      [37.5432, 127.0500],
      // Loaf body right side
      [37.5410, 127.0535],
      [37.5382, 127.0538],
      // Curled cat tail on right
      [37.5395, 127.0568],
      [37.5418, 127.0575],
      [37.5412, 127.0588],
      [37.5372, 127.0565],
      // Flat bottom of cat loaf
      [37.5370, 127.0490],
      [37.5370, 127.0415],
      // Left front paw tucked in
      [37.5392, 127.0392],
      [37.5425, 127.0402],
      [37.5450, 127.0398],
    ],
    decorations: [
      {
        id: 'cat-eye-l',
        type: 'eye',
        position: [37.5455, 127.0430],
        scale: 1.0,
      },
      {
        id: 'cat-eye-r',
        type: 'eye',
        position: [37.5455, 127.0478],
        scale: 1.0,
      },
      {
        id: 'cat-nose',
        type: 'nose',
        position: [37.5443, 127.0454],
        color: '#F43F5E',
        scale: 0.95,
      },
      {
        id: 'cat-whisker-l',
        type: 'whisker',
        position: [37.5442, 127.0412],
        rotation: -10,
      },
      {
        id: 'cat-whisker-r',
        type: 'whisker',
        position: [37.5442, 127.0496],
        rotation: 10,
      },
      {
        id: 'cat-blush-l',
        type: 'blush',
        position: [37.5440, 127.0425],
        color: '#FB7185',
      },
      {
        id: 'cat-blush-r',
        type: 'blush',
        position: [37.5440, 127.0483],
        color: '#FB7185',
      },
    ],
    waypoints: [
      {
        index: 0,
        title: '출발 · 서울숲 입구 (왼쪽 볼)',
        description: '서울숲역 3번 출구에서 북쪽 산책로 방향으로 진입합니다.',
      },
      {
        index: 1,
        title: '왼쪽 고양이 귀 꼭짓점',
        description: '삼각형 귀 모양이 살아나도록 예각으로 꺾어 내려옵니다.',
      },
      {
        index: 4,
        title: '오른쪽 고양이 귀 꼭짓점',
        description: '뚝섬역 교차로에서 두 번째 뾰족 귀를 완성합니다.',
      },
      {
        index: 10,
        title: '성수 카페거리 꼬리 컬링',
        description: '연무장길 끝단에서 고양이 꼬리를 한 바퀴 감아 돌아옵니다.',
      },
    ],
  },
  {
    id: 'gwanghwamun-royal-heart',
    title: '광화문·경복궁 로열 하트런',
    subtitle: '경복궁 담장과 삼청동·서촌을 감싸 안는 대칭 하트 코스',
    region: '서울',
    district: '종로구 광화문 · 삼청동 · 서촌',
    shapeCategory: '하트·심볼',
    shapeName: '하트',
    distanceKm: 4.8,
    estimatedMinutes: 32,
    difficulty: '쉬움',
    startPointName: '광화문역 6번 출구 앞 광화문광장 (하트 아래 꼭짓점)',
    nearestStation: '5호선 광화문역 / 3호선 경복궁역·안국역',
    accentColor: '#F43F5E',
    secondaryColor: '#FFE4E6',
    description:
      '광화문광장 남측을 하트의 뾰족한 끝점으로 삼아, 서촌 자하문로와 청와대 앞길(신무문), 삼청동 돌담길을 따라 실제 보행로를 달리며 완성하는 로맨틱 대칭 하트 코스입니다.',
    tags: ['하트런', '광화문', '경복궁돌담길', '실제길반영', '커플러닝'],
    likes: 418,
    createdAt: '2026-02-14',
    center: [37.5782, 126.9771],
    zoom: 14,
    coordinates: [
      // 1. 하트 아래 뾰족한 꼭짓점 (광화문광장 남측 / 세종대로)
      [37.5708, 126.9771],
      // 2. 세종문화회관 뒤편 대각선 길 (새문안로 9길 & 5길)
      [37.5715, 126.9754],
      [37.5724, 126.9748],
      [37.5732, 126.9745],
      [37.5746, 126.9740],
      // 3. 경복궁역 6번 출구 앞 (사직로 진입)
      [37.5758, 126.9735],
      // 4. 서촌 자하문로 북향 주로
      [37.5768, 126.9730],
      [37.5782, 126.9725],
      [37.5795, 126.9720],
      // 5. 통인시장 입구 교차로
      [37.5808, 126.9717],
      [37.5822, 126.9718],
      [37.5835, 126.9718],
      // 6. 청운효자동 자하문로 (왼쪽 하트 곡선 정점)
      [37.5846, 126.9725],
      [37.5855, 126.9732],
      // 7. 청와대 사랑채 & 영빈관 앞길
      [37.5842, 126.9742],
      [37.5838, 126.9752],
      // 8. 경복궁 신무문 정면 (하트 중앙 골)
      [37.5838, 126.9768],
      // 9. 청와대로 동편 주로 (춘추관 방향)
      [37.5838, 126.9782],
      [37.5839, 126.9795],
      [37.5836, 126.9804],
      // 10. 삼청동 카페거리 북향 (오른쪽 하트 곡선 정점)
      [37.5842, 126.9815],
      [37.5852, 126.9820],
      [37.5855, 126.9825],
      [37.5848, 126.9826],
      // 11. 삼청로 미술관·돌담길 남향 주로
      [37.5838, 126.9818],
      [37.5822, 126.9812],
      [37.5805, 126.9808],
      [37.5788, 126.9804],
      [37.5772, 126.9801],
      // 12. 동십자각 사거리 (경복궁 동남측 모퉁이)
      [37.5758, 126.9798],
      // 13. 중학천길 & 종로1길 남향 귀환로
      [37.5746, 126.9793],
      [37.5732, 126.9785],
      [37.5718, 126.9778],
      // 14. 하트 아래 꼭짓점 원점 복귀
      [37.5708, 126.9771],
    ],
    decorations: [
      {
        id: 'heart-eye-l',
        type: 'eye',
        position: [37.5795, 126.9745],
        scale: 1.05,
      },
      {
        id: 'heart-eye-r',
        type: 'eye',
        position: [37.5795, 126.9797],
        scale: 1.05,
      },
      {
        id: 'heart-blush-l',
        type: 'blush',
        position: [37.5778, 126.9735],
        color: '#FB7185',
      },
      {
        id: 'heart-blush-r',
        type: 'blush',
        position: [37.5778, 126.9805],
        color: '#FB7185',
      },
      {
        id: 'heart-sparkle',
        type: 'sparkle',
        position: [37.5848, 126.9820],
        text: '삼청동 카페거리',
      },
    ],
    waypoints: [
      {
        index: 0,
        title: '출발 · 하트 꼭짓점 (광화문광장 남측)',
        description: '광화문역 6번 출구 앞에서 세종문화회관 뒤편 대각선 골목길로 진입합니다.',
      },
      {
        index: 5,
        title: '서촌 진입 (경복궁역 교차로)',
        description: '사직로를 건너 자하문로를 따라 서촌 통인시장 방면으로 직진합니다.',
      },
      {
        index: 12,
        title: '왼쪽 하트 곡선 정점 (청운효자동)',
        description: '자하문로26길에서 우회전하여 청와대 사랑채 방면으로 완만하게 돌아 나옵니다.',
      },
      {
        index: 16,
        title: '하트 중앙 골 (경복궁 신무문 & 청와대 앞)',
        description: '신무문 정면에서 쏙 들어간 하트 중심 골짜기를 형성하며 춘추관으로 달립니다.',
      },
      {
        index: 22,
        title: '오른쪽 하트 곡선 정점 (삼청동 카페거리)',
        description: '삼청로 카페거리에서 부드럽게 유턴하듯 돌아 국립현대미술관 돌담길로 내려옵니다.',
      },
      {
        index: 29,
        title: '동십자각 & 중학천길 귀환',
        description: '경복궁 동남쪽 모퉁이 동십자각을 지나 중학천길을 따라 광화문광장 원점으로 완주합니다.',
      },
    ],
  },
  {
    id: 'daejeon-hanbat-retriever',
    title: '대전 한밭수목원 골든리트리버런',
    subtitle: '엑스포시민광장과 만년동 블록이 빚어낸 미소 짓는 대형견',
    region: '대전·충청',
    district: '대전 서구 만년동 · 한밭수목원',
    shapeCategory: '동물',
    shapeName: '강아지',
    distanceKm: 5.6,
    estimatedMinutes: 36,
    difficulty: '쉬움',
    startPointName: '엑스포시민광장 야외공연장 앞',
    nearestStation: '대전 1호선 정부청사역 3번 출구',
    accentColor: '#EAB308',
    secondaryColor: '#FEF08A',
    description:
      '전국에서 손꼽히는 평지 직교형 도로망을 가진 대전 만년동·한밭수목원 일대에서 달리는 골든리트리버 코스입니다. 단 한 번의 신호 대기 없이 수목원 산책로에서 귀와 머리를 완성할 수 있습니다.',
    tags: ['대전강아지런', '한밭수목원', '평지100%', '초보환영'],
    likes: 265,
    createdAt: '2026-03-22',
    center: [36.3665, 127.3865],
    zoom: 14,
    coordinates: [
      [36.3685, 127.3812],
      [36.3695, 127.3782],
      [36.3712, 127.3782],
      [36.3718, 127.3818],
      [36.3735, 127.3840],
      [36.3732, 127.3872],
      [36.3698, 127.3870],
      [36.3720, 127.3888],
      [36.3685, 127.3905],
      [36.3652, 127.3920],
      [36.3665, 127.3952],
      [36.3645, 127.3958],
      [36.3632, 127.3922],
      [36.3602, 127.3915],
      [36.3602, 127.3888],
      [36.3628, 127.3888],
      [36.3628, 127.3845],
      [36.3602, 127.3845],
      [36.3602, 127.3818],
      [36.3652, 127.3818],
      [36.3685, 127.3812],
    ],
    decorations: [
      {
        id: 'dj-eye',
        type: 'eye',
        position: [36.3708, 127.3822],
        scale: 1.05,
      },
      {
        id: 'dj-nose',
        type: 'nose',
        position: [36.3705, 127.3785],
        scale: 1.1,
      },
      {
        id: 'dj-blush',
        type: 'blush',
        position: [36.3692, 127.3825],
        color: '#F59E0B',
      },
      {
        id: 'dj-ear',
        type: 'ear',
        position: [36.3712, 127.3860],
        text: '수목원 귀 구간',
      },
    ],
    waypoints: [
      {
        index: 0,
        title: '출발 · 한밭수목원 서원 입구',
        description: '넓고 평탄한 수목원 보행로를 따라 주둥이 쪽으로 달립니다.',
      },
      {
        index: 5,
        title: '동원 수목원 귀 루프',
        description: '한밭수목원 동원 외곽을 돌아 복슬한 리트리버 귀를 만듭니다.',
      },
      {
        index: 10,
        title: '갑천변 꼬리 포인트',
        description: '갑천 자전거도로와 만나는 지점에서 꼬리를 흔들며 돌아옵니다.',
      },
    ],
  },
  {
    id: 'yeouido-whale-island',
    title: '여의도 한강 하늘고래런',
    subtitle: '여의도 윤중로와 샛강생태공원을 한 바퀴 도는 거대 고래 실루엣',
    region: '서울',
    district: '영등포구 여의도공원 · 한강공원',
    shapeCategory: '해양생물',
    shapeName: '고래',
    distanceKm: 7.5,
    estimatedMinutes: 48,
    difficulty: '보통',
    startPointName: '여의나루역 2번 출구 물빛광장',
    nearestStation: '5호선 여의나루역 / 9호선 국회의사당역',
    accentColor: '#0EA5E9',
    secondaryColor: '#BAE6FD',
    description:
      '섬 자체가 거대한 고래를 닮은 여의도의 지형을 100% 활용한 시그니처 한강 코스입니다. 국회의사당 둔치에서 둥근 고래 이마를 그리고, 63빌딩 앞 샛강 합류부에서 역동적인 고래 꼬리지느러미를 완성합니다.',
    tags: ['고래런', '여의도한바퀴', '신호없음', '한강뷰'],
    likes: 376,
    createdAt: '2026-04-10',
    center: [37.5262, 126.9268],
    zoom: 13,
    coordinates: [
      // Start at top blowhole (Yeouinaru)
      [37.5285, 126.9325],
      // Whale head & forehead (National Assembly)
      [37.5335, 126.9210],
      [37.5342, 126.9135],
      [37.5305, 126.9098],
      // Whale mouth / smile line cutting through Yeouido Park entrance
      [37.5268, 126.9145],
      [37.5252, 126.9195],
      [37.5270, 126.9125],
      // Belly along Saetgang Ecological Park
      [37.5218, 126.9175],
      [37.5182, 126.9265],
      // Flipper fin
      [37.5152, 126.9255],
      [37.5168, 126.9295],
      // Tail stock towards 63 Building
      [37.5175, 126.9378],
      // Whale Tail Flukes!
      [37.5142, 126.9422],
      [37.5185, 126.9415],
      [37.5228, 126.9438],
      [37.5210, 126.9388],
      // Back to Yeouinaru
      [37.5250, 126.9362],
      [37.5285, 126.9325],
    ],
    decorations: [
      {
        id: 'whale-eye',
        type: 'eye',
        position: [37.5295, 126.9168],
        scale: 1.15,
      },
      {
        id: 'whale-blush',
        type: 'blush',
        position: [37.5280, 126.9182],
        color: '#38BDF8',
      },
      {
        id: 'whale-spout',
        type: 'sparkle',
        position: [37.5358, 126.9225],
        text: '분수 물줄기!',
      },
    ],
    waypoints: [
      {
        index: 0,
        title: '출발 · 여의나루 물빛광장 (고래 등)',
        description: '한강 하류(국회의사당 방향)를 향해 시원하게 출발합니다.',
      },
      {
        index: 4,
        title: '여의도공원 진입 (고래 입꼬리)',
        description: '고래의 웃는 입 모양을 위해 여의도공원 교차로로 살짝 들어갔다 나옵니다.',
      },
      {
        index: 13,
        title: '63빌딩 앞 고래 꼬리지느러미',
        description: '샛강과 한강이 만나는 합수부에서 Y자 꼬리지느러미를 완성합니다.',
      },
    ],
  },
  {
    id: 'busan-gwangalli-dolphin',
    title: '부산 광안리·수영만 돌고래런',
    subtitle: '광안대교 야경을 배경으로 바다 위로 점프하는 돌고래',
    region: '부산·경남',
    district: '부산 수영구 광안리 · 민락수변공원',
    shapeCategory: '해양생물',
    shapeName: '돌고래',
    distanceKm: 7.9,
    estimatedMinutes: 50,
    difficulty: '보통',
    startPointName: '광안리해수욕장 만남의광장',
    nearestStation: '부산 2호선 광안역 / 금련산역',
    accentColor: '#06B6D4',
    secondaryColor: '#CFFAFE',
    description:
      '광안리 해변 산책로로 매끈한 돌고래의 배를 그리고, 수영강과 민락동 골목에서 솟아오르는 등지느러미와 귀여운 부리를 완성하는 부산 대표 오션뷰 GPS 아트입니다.',
    tags: ['부산러닝', '광안리해수욕장', '돌고래런', '오션뷰'],
    likes: 312,
    createdAt: '2026-04-18',
    center: [35.1558, 129.1215],
    zoom: 14,
    coordinates: [
      [35.1532, 129.1185],
      [35.1582, 129.1145],
      [35.1618, 129.1155],
      // Dorsal fin
      [35.1652, 129.1195],
      [35.1615, 129.1215],
      // Head & Dolphin Beak (Millak Waterside Park)
      [35.1605, 129.1275],
      [35.1588, 129.1312],
      [35.1572, 129.1305],
      [35.1575, 129.1268],
      // Flipper
      [35.1542, 129.1258],
      [35.1558, 129.1235],
      // Smooth curved belly along Gwangalli Beach
      [35.1525, 129.1202],
      [35.1488, 129.1155],
      // Tail fluke at Namcheon-dong
      [35.1462, 129.1125],
      [35.1485, 129.1112],
      [35.1505, 129.1142],
      [35.1532, 129.1185],
    ],
    decorations: [
      {
        id: 'dolphin-eye',
        type: 'eye',
        position: [35.1590, 129.1268],
        scale: 1.05,
      },
      {
        id: 'dolphin-blush',
        type: 'blush',
        position: [35.1580, 129.1255],
        color: '#22D3EE',
      },
      {
        id: 'dolphin-sparkle',
        type: 'sparkle',
        position: [35.1658, 129.1198],
        text: '등지느러미 포인트',
      },
    ],
    waypoints: [
      {
        index: 0,
        title: '출발 · 광안리 해변 중앙',
        description: '광안대교를 바라보며 수영역 방향으로 올라갑니다.',
      },
      {
        index: 3,
        title: '수영교차로 돌고래 등지느러미',
        description: '날렵한 등지느러미 각도를 살려 민락동 쪽으로 내려옵니다.',
      },
      {
        index: 6,
        title: '민락수변공원 돌고래 코끝',
        description: '바다와 마주하는 수변공원에서 돌고래 부리를 그립니다.',
      },
    ],
  },
  {
    id: 'banpo-trex-run',
    title: '반포·잠원 티라노 공룡런',
    subtitle: '잠원 한강공원과 신사동 가로수길로 그리는 다이내믹 티라노사우루스',
    region: '서울',
    district: '서초구 반포한강공원 · 잠원동 · 신사동',
    shapeCategory: '캐릭터·기타',
    shapeName: '공룡',
    distanceKm: 8.8,
    estimatedMinutes: 56,
    difficulty: '도전',
    startPointName: '반포한강공원 세빛섬 앞',
    nearestStation: '3·7·9호선 고속터미널역 / 3호선 신사역',
    accentColor: '#10B981',
    secondaryColor: '#A7F3D0',
    description:
      '신사동 가로수길 블록의 촘촘한 골목으로 티라노의 입과 이빨, 앙증맞은 앞발을 정교하게 묘사하고, 반포한강공원 자전거도로를 따라 긴 꼬리를 시원하게 뻗어내는 중급자 추천 코스입니다.',
    tags: ['공룡런', '티라노', '반포한강공원', '가로수길'],
    likes: 234,
    createdAt: '2026-04-05',
    center: [37.5162, 127.0085],
    zoom: 14,
    coordinates: [
      // Start at Sebitseom (tail tip)
      [37.5118, 126.9958],
      // Long dino back going up towards Jamwon
      [37.5155, 127.0025],
      [37.5205, 127.0095],
      // T-Rex Head top
      [37.5245, 127.0135],
      [37.5248, 127.0195],
      // Upper jaw & snout (Garosu-gil)
      [37.5218, 127.0215],
      // Open mouth zig-zag
      [37.5215, 127.0175],
      [37.5198, 127.0205],
      [37.5188, 127.0172],
      // Tiny cute T-Rex arms!
      [37.5165, 127.0170],
      [37.5165, 127.0198],
      [37.5152, 127.0198],
      [37.5152, 127.0165],
      // Belly & powerful hind leg
      [37.5125, 127.0155],
      [37.5082, 127.0165],
      [37.5080, 127.0118],
      [37.5115, 127.0115],
      // Under-tail back to Sebitseom
      [37.5105, 127.0028],
      [37.5118, 126.9958],
    ],
    decorations: [
      {
        id: 'dino-eye',
        type: 'eye',
        position: [37.5232, 127.0165],
        scale: 1.15,
      },
      {
        id: 'dino-blush',
        type: 'blush',
        position: [37.5220, 127.0152],
        color: '#34D399',
      },
      {
        id: 'dino-sparkle',
        type: 'sparkle',
        position: [37.5158, 127.0205],
        text: '하찮은 앞발!',
      },
    ],
    waypoints: [
      {
        index: 0,
        title: '출발 · 세빛섬 광장 (공룡 꼬리 끝)',
        description: '한강변을 따라 잠원한강공원 방향으로 달리기 시작합니다.',
      },
      {
        index: 5,
        title: '가로수길 티라노 턱 & 이빨 구간',
        description: '입을 벌린 공룡 모양이 나오는 핵심 지그재그 블록입니다.',
      },
      {
        index: 10,
        title: '티라노 짧은 앞발 디테일',
        description: '한 블록만 톡 튀어나오게 돌아 티라노 특유의 짧은 앞발을 그립니다.',
      },
    ],
  },
];
