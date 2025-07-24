// src/assets/mockData.js
import { FaBell, FaTrophy, FaWallet, FaBookOpen } from 'react-icons/fa';
import { ROUTES } from '../route/routes';

// 알림 데이터 (MOONEY_NOTIFICATION 테이블 구조에 맞춤)
const mockNotificationsData = [
  {
    mnofId: 1,
    mnofMmemId: 'testuser123',
    mnofContent: '챌린지를 완료했습니다! 포인트를 획득하세요.',
    mnofType: 'challenge',
    mnofDt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
    mnofReadYn: 'N',
    // 프론트엔드 표시용 추가 필드 (실제 DB에는 없음)
    icon: FaTrophy,
    title: '챌린지 완료',
    path: ROUTES.CHALLENGE,
  },
  {
    mnofId: 2,
    mnofMmemId: 'testuser123',
    mnofContent: '이번 달 예산의 80%를 사용했습니다.',
    mnofType: 'expense',
    mnofDt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4시간 전
    mnofReadYn: 'Y',
    // 프론트엔드 표시용 추가 필드
    icon: FaWallet,
    title: '월 예산 80% 사용',
    path: ROUTES.ACCOUNT_BOOK,
  },
  {
    mnofId: 3,
    mnofMmemId: 'testuser123',
    mnofContent: '어제 소비에 대한 일기를 작성해보세요.',
    mnofType: 'diary',
    mnofDt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1일 전
    mnofReadYn: 'N',
    // 프론트엔드 표시용 추가 필드
    icon: FaBookOpen,
    title: '소비 일기 작성 알림',
    path: ROUTES.DIARY,
  },
  {
    mnofId: 4,
    mnofMmemId: 'testuser123',
    mnofContent: '가계부 차트 기능이 새롭게 추가되었습니다.',
    mnofType: 'system',
    mnofDt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2일 전
    mnofReadYn: 'Y',
    // 프론트엔드 표시용 추가 필드
    icon: FaBell,
    title: '새로운 기능 업데이트',
    path: '/chart',
  },
];

// 사용자 데이터 (MOONEY_MEMBER 테이블 구조에 맞춤)
const mockUserData = [
  {
    mmemId: 'testuser123',
    mmemPw: 'testuser123',
    mmemNick: '가계부마스터',
    mmemPphoto: null, // 프로필 사진이 없는 경우
    mmemRegd: new Date('1999-01-01'),
    mmemBir: new Date('1995-06-20'),
    mmemPnt: 15750, // 포인트
  },
  {
    mmemId: 'user001',
    mmemPw: 'user001',
    mmemNick: 'user000000',
    mmemPphoto: null,
    mmemRegd: new Date('1999-01-01'),
    mmemBir: new Date('2020-05-05'),
    mmemPnt: 11111,
  },
  {
    mmemId: 'user002',
    mmemPw: 'user002',
    mmemNick: 'user023456',
    mmemPphoto: null,
    mmemRegd: new Date('1999-01-01'),
    mmemBir: new Date('2020-05-09'),
    mmemPnt: 456,
  },
  {
    mmemId: 'admin',
    mmemPw: '1234',
    mmemNick: 'admin',
    mmemPphoto: null,
    mmemRegd: new Date('1999-01-01'),
    mmemBir: new Date('2020-05-05'),
    mmemPnt: 987654,
  },
];

// 카테고리 데이터 (MOONEY_CATEGORY 테이블 구조에 맞춤)
const mockCategory = [
  { mcatId: 1, mcatName: '엔터테인먼트', mcatColor: '#FF6384' },
  { mcatId: 2, mcatName: '업무/생산성', mcatColor: '#36A2EB' },
  { mcatId: 3, mcatName: '클라우드 저장소', mcatColor: '#FFCE56' },
  { mcatId: 4, mcatName: '쇼핑', mcatColor: '#8BC34A' },
  { mcatId: 5, mcatName: '기타', mcatColor: '#9C27B0' },
  { mcatId: 6, mcatName: '식비', mcatColor: '#FF9F40' },
  { mcatId: 7, mcatName: '교통비', mcatColor: '#4BC0C0' },
  { mcatId: 8, mcatName: '통신비', mcatColor: '#9966FF' },
  { mcatId: 9, mcatName: '건강/의료', mcatColor: '#FF6B6B' },
  { mcatId: 10, mcatName: '교육', mcatColor: '#4ECDC4' },
];

const mockExpenseData = [
  // === 구독 예정 (PENDING) - 현재 달 예정 ===
  {
    mexpId: 1,
    mexpMmemId: 'user001',
    mexpDt: null, // 아직 지출하지 않음
    mexpAmt: 17000,
    mexpDec: 'Netflix 구독료',
    mexpType: 'E', // Expense (지출)
    mexpRpt: 'T', // True (반복)
    mexpRptdd: new Date('2025-07-25'),
    mexpStatus: 'PENDING',
    mexpFrequency: 'MONTHLY', // 월간
    mcatId: 1, // 엔터테인먼트
  },
  {
    mexpId: 2,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 10900,
    mexpDec: 'Spotify Premium',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: new Date('2025-07-28'),
    mexpStatus: 'PENDING',
    mexpFrequency: 'MONTHLY',
    mcatId: 1, // 엔터테인먼트
  },
  {
    mexpId: 3,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 29000,
    mexpDec: 'Adobe Creative Cloud',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: new Date('2025-08-15'),
    mexpStatus: 'PENDING',
    mexpFrequency: 'MONTHLY',
    mcatId: 2, // 업무/생산성
  },
  {
    mexpId: 4,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 2900,
    mexpDec: 'Google Drive 스토리지',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: new Date('2025-08-01'),
    mexpStatus: 'PENDING',
    mexpFrequency: 'MONTHLY',
    mcatId: 3, // 클라우드 저장소
  },
  {
    mexpId: 5,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 4990,
    mexpDec: '쿠팡 와우 멤버십',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: new Date('2025-07-20'),
    mexpStatus: 'OVERDUE', // 연체
    mexpFrequency: 'MONTHLY',
    mcatId: 4, // 쇼핑
  },

  // === 추가 구독 서비스 (PENDING) ===
  {
    mexpId: 7,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 12900,
    mexpDec: 'YouTube Premium',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: new Date('2025-07-30'),
    mexpStatus: 'PENDING',
    mexpFrequency: 'MONTHLY',
    mcatId: 1, // 엔터테인먼트
  },
  {
    mexpId: 8,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 16500,
    mexpDec: '웨이브(Wavve) 구독',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: new Date('2025-08-05'),
    mexpStatus: 'PENDING',
    mexpFrequency: 'MONTHLY',
    mcatId: 1, // 엔터테인먼트
  },
  {
    mexpId: 9,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 9900,
    mexpDec: '멜론 스트리밍',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: new Date('2025-08-10'),
    mexpStatus: 'PENDING',
    mexpFrequency: 'MONTHLY',
    mcatId: 1, // 엔터테인먼트
  },
  {
    mexpId: 10,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 55000,
    mexpDec: 'Microsoft 365',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: new Date('2025-08-20'),
    mexpStatus: 'PENDING',
    mexpFrequency: 'MONTHLY',
    mcatId: 2, // 업무/생산성
  },
  {
    mexpId: 11,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 149000,
    mexpDec: 'Figma Professional',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: new Date('2025-07-24'),
    mexpStatus: 'PENDING',
    mexpFrequency: 'MONTHLY',
    mcatId: 2, // 업무/생산성
  },
  {
    mexpId: 12,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 8900,
    mexpDec: 'Notion Pro',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: new Date('2025-07-22'),
    mexpStatus: 'PENDING',
    mexpFrequency: 'MONTHLY',
    mcatId: 2, // 업무/생산성
  },

  // === 구독 완료 (COMPLETED) - 최근 결제한 것들 ===
  {
    mexpId: 101,
    mexpMmemId: 'user001',
    mexpDt: new Date('2025-07-12'), // 실제 지출일
    mexpAmt: 17000,
    mexpDec: 'Netflix 구독료',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: new Date('2025-06-25'), // 원래 예정일
    mexpStatus: 'COMPLETED',
    mexpFrequency: 'MONTHLY',
    mcatId: 1, // 엔터테인먼트
  },
  {
    mexpId: 102,
    mexpMmemId: 'user001',
    mexpDt: new Date('2025-07-10'),
    mexpAmt: 2900,
    mexpDec: 'Google Drive 스토리지',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: new Date('2025-07-01'),
    mexpStatus: 'COMPLETED',
    mexpFrequency: 'MONTHLY',
    mcatId: 3, // 클라우드 저장소
  },
  {
    mexpId: 103,
    mexpMmemId: 'user001',
    mexpDt: new Date('2025-07-13'),
    mexpAmt: 10900,
    mexpDec: 'Spotify Premium',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: new Date('2025-06-28'),
    mexpStatus: 'COMPLETED',
    mexpFrequency: 'MONTHLY',
    mcatId: 1, // 엔터테인먼트
  },
  {
    mexpId: 104,
    mexpMmemId: 'user001',
    mexpDt: new Date('2025-07-23'),
    mexpAmt: 17000,
    mexpDec: '넷플릭스 구독',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: new Date('2025-08-20'),
    mexpStatus: 'COMPLETED',
    mexpFrequency: 'MONTHLY',
    mcatId: 1,
  },

  // === 다른 사용자 구독 데이터 ===
  {
    mexpId: 201,
    mexpMmemId: 'testuser123',
    mexpDt: null,
    mexpAmt: 9900,
    mexpDec: '카카오톡 이모티콘 플러스',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: new Date('2025-07-24'),
    mexpStatus: 'PENDING',
    mexpFrequency: 'MONTHLY',
    mcatId: 1, // 엔터테인먼트
  },
  {
    mexpId: 202,
    mexpMmemId: 'testuser123',
    mexpDt: null,
    mexpAmt: 39000,
    mexpDec: 'ChatGPT Plus',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: new Date('2025-08-03'),
    mexpStatus: 'PENDING',
    mexpFrequency: 'MONTHLY',
    mcatId: 2, // 업무/생산성
  },
  {
    mexpId: 203,
    mexpMmemId: 'testuser123',
    mexpDt: new Date('2025-07-14'),
    mexpAmt: 16500,
    mexpDec: '웨이브(Wavve) 구독',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: new Date('2025-07-05'),
    mexpStatus: 'COMPLETED',
    mexpFrequency: 'MONTHLY',
    mcatId: 1, // 엔터테인먼트
  },

  // === 일반 지출 데이터 (비반복, 가계부용) ===
  {
    mexpId: 301,
    mexpMmemId: 'user001',
    mexpDt: new Date('2025-07-15'),
    mexpAmt: 50000,
    mexpDec: '마트 장보기',
    mexpType: 'E',
    mexpRpt: 'F', // False (비반복)
    mexpRptdd: null, // 비반복이므로 예정일 없음
    mexpStatus: 'COMPLETED',
    mexpFrequency: null, // 비반복이므로 주기 없음
    mcatId: 6, // 식비
  },
  {
    mexpId: 302,
    mexpMmemId: 'user001',
    mexpDt: new Date('2025-07-16'),
    mexpAmt: 25000,
    mexpDec: '점심 외식',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mexpFrequency: null,
    mcatId: 6, // 식비
  },
  {
    mexpId: 303,
    mexpMmemId: 'user001',
    mexpDt: new Date('2025-07-17'),
    mexpAmt: 80000,
    mexpDec: '주유비',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mexpFrequency: null,
    mcatId: 7, // 교통비
  },
  {
    mexpId: 304,
    mexpMmemId: 'user001',
    mexpDt: new Date('2025-07-18'),
    mexpAmt: 15000,
    mexpDec: '커피숍',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mexpFrequency: null,
    mcatId: 6, // 식비
  },
  {
    mexpId: 305,
    mexpMmemId: 'user001',
    mexpDt: new Date('2025-07-19'),
    mexpAmt: 120000,
    mexpDec: '온라인 쇼핑',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mexpFrequency: null,
    mcatId: 4, // 쇼핑
  },
  {
    mexpId: 306,
    mexpMmemId: 'user001',
    mexpDt: new Date('2025-07-20'),
    mexpAmt: 98765,
    mexpDec: '온라인 쇼핑',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mexpFrequency: null,
    mcatId: 4, // 쇼핑
  },
  {
    mexpId: 307,
    mexpMmemId: 'user001',
    mexpDt: new Date('2025-07-19'),
    mexpAmt: 321654,
    mexpDec: '통신비',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mexpFrequency: null,
    mcatId: 8, // 쇼핑
  },

  // === 수입 데이터 (Income) ===
  {
    mexpId: 401,
    mexpMmemId: 'user001',
    mexpDt: new Date('2025-07-01'),
    mexpAmt: 3500000,
    mexpDec: '월급',
    mexpType: 'I', // Income (수입)
    mexpRpt: 'T',
    mexpRptdd: new Date('2025-08-01'),
    mexpStatus: 'COMPLETED',
    mexpFrequency: 'MONTHLY',
    mcatId: 5, // 기타 (수입은 보통 기타로 분류)
  },
  {
    mexpId: 402,
    mexpMmemId: 'user001',
    mexpDt: new Date('2025-07-10'),
    mexpAmt: 500000,
    mexpDec: '부업 수입',
    mexpType: 'I',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mexpFrequency: null,
    mcatId: 5, // 기타
  },
  {
    mexpId: 403,
    mexpMmemId: 'testuser123',
    mexpDt: new Date('2025-07-01'),
    mexpAmt: 2800000,
    mexpDec: '월급',
    mexpType: 'I',
    mexpRpt: 'T',
    mexpRptdd: new Date('2025-08-01'),
    mexpStatus: 'COMPLETED',
    mexpFrequency: 'MONTHLY',
    mcatId: 5, // 기타
  },

  // === 챌린지 페이지용 더미 데이터 (최근 소비 데이터 추가) ===
  {
    mexpId: 501,
    mexpMmemId: 'user001',
    mexpDt: new Date('2025-01-01'),
    mexpAmt: 50000,
    mexpDec: '신년 외식',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mexpFrequency: null,
    mcatId: 6, // 식비
  },
  {
    mexpId: 502,
    mexpMmemId: 'user001',
    mexpDt: new Date('2025-01-02'),
    mexpAmt: 30000,
    mexpDec: '마트 장보기',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mexpFrequency: null,
    mcatId: 6, // 식비
  },
  {
    mexpId: 503,
    mexpMmemId: 'user001',
    mexpDt: new Date('2025-01-03'),
    mexpAmt: 20000,
    mexpDec: '카페',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mexpFrequency: null,
    mcatId: 6, // 식비
  },
  {
    mexpId: 504,
    mexpMmemId: 'user001',
    mexpDt: new Date('2025-01-04'),
    mexpAmt: 45000,
    mexpDec: '온라인 쇼핑',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mexpFrequency: null,
    mcatId: 4, // 쇼핑
  },
  {
    mexpId: 505,
    mexpMmemId: 'user001',
    mexpDt: new Date('2025-01-05'),
    mexpAmt: 25000,
    mexpDec: '교통비',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mexpFrequency: null,
    mcatId: 7, // 교통비
  },
  {
    mexpId: 506,
    mexpMmemId: 'user001',
    mexpDt: new Date('2024-12-15'),
    mexpAmt: 150000,
    mexpDec: '연말 모임',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mexpFrequency: null,
    mcatId: 6, // 식비
  },
  {
    mexpId: 507,
    mexpMmemId: 'user001',
    mexpDt: new Date('2024-12-20'),
    mexpAmt: 200000,
    mexpDec: '선물 구매',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mexpFrequency: null,
    mcatId: 4, // 쇼핑
  },
  {
    mexpId: 508,
    mexpMmemId: 'user001',
    mexpDt: new Date('2024-11-10'),
    mexpAmt: 80000,
    mexpDec: '의료비',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mexpFrequency: null,
    mcatId: 9, // 건강/의료
  },
  {
    mexpId: 509,
    mexpMmemId: 'user001',
    mexpDt: new Date('2025-02-22'),
    mexpAmt: 1110000,
    mexpDec: '의료비',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mexpFrequency: null,
    mcatId: 9, // 건강/의료
  },
  {
    mexpId: 510,
    mexpMmemId: 'user001',
    mexpDt: new Date('2025-07-22'),
    mexpAmt: 1110000,
    mexpDec: '의료비',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mexpFrequency: null,
    mcatId: 9, // 건강/의료
  },
];

// 일기 데이터 (MOONEY_DIARY 테이블 구조에 맞춤)
const mockDiaryData = [
  {
    mdiaId: 1,
    mdiaMmemId: 'user001',
    mdiaDate: new Date('2025-07-20'),
    mdiaContent:
      '오늘은 Netflix 구독료를 결제했다. 매달 나가는 돈이지만 집에서 보는 재미가 있어서 아깝지 않다.',
  },
  {
    mdiaId: 2,
    mdiaMmemId: 'user001',
    mdiaDate: new Date('2025-07-19'),
    mdiaContent:
      '온라인 쇼핑으로 12만원을 썼다. 필요한 물건들이었지만 조금 더 신중하게 구매할 걸 그랬다.',
  },
  {
    mdiaId: 3,
    mdiaMmemId: 'testuser123',
    mdiaDate: new Date('2025-07-18'),
    mdiaContent:
      '커피숍에서 1만 5천원 사용. 친구와 오랜만에 만나서 이야기하느라 시간 가는 줄 몰랐다.',
  },
];

// 챌린지 데이터 (MOONEY_CHALLENGE 테이블 구조에 맞춤)
const mockChallengeData = [
  {
    mchlId: 1,
    mchlMmemId: 'user001',
    mchlName: '1월 절약 챌린지',
    mchlTargetAmount: 600000,
    mchlStartDate: new Date('2025-01-01'),
    mchlEndDate: new Date('2025-01-31'),
    mchlReward: 100,
    mchlContents: '1월 한 달 동안 60만원 이하로 소비하기',
  },
  {
    mchlId: 2,
    mchlMmemId: 'user001',
    mchlName: '12월 절약 챌린지',
    mchlTargetAmount: 500000,
    mchlStartDate: new Date('2024-12-01'),
    mchlEndDate: new Date('2024-12-31'),
    mchlReward: 150,
    mchlContents: '12월 연말 소비 줄이기',
  },
  {
    mchlId: 3,
    mchlMmemId: 'user001',
    mchlName: '11월 절약 챌린지',
    mchlTargetAmount: 400000,
    mchlStartDate: new Date('2024-11-01'),
    mchlEndDate: new Date('2024-11-30'),
    mchlReward: 100,
    mchlContents: '11월 식비 절약하기',
  },
  {
    mchlId: 4,
    mchlMmemId: 'user001',
    mchlName: '2월 절약 챌린지',
    mchlTargetAmount: 550000,
    mchlStartDate: new Date('2025-02-01'),
    mchlEndDate: new Date('2025-02-28'),
    mchlReward: 120,
    mchlContents: '2월 교통비 절약하기',
  },
  {
    mchlId: 5,
    mchlMmemId: 'user001',
    mchlName: '9월 절약 챌린지',
    mchlTargetAmount: 500000,
    mchlStartDate: new Date('2025-09-01'),
    mchlEndDate: new Date('2025-09-30'),
    mchlReward: 100,
    mchlContents: '9월 쇼핑 절약하기',
  },
  {
    mchlId: 6,
    mchlMmemId: 'user001',
    mchlName: '7월 말 일주일 절약 챌린지',
    mchlTargetAmount: 100000,
    mchlStartDate: new Date('2025-07-21'),
    mchlEndDate: new Date('2025-07-27'),
    mchlReward: 100,
    mchlContents: '7월 절약',
  },
];

const MOCKDATA = {
  // mockNotificationsData,
  mockUserData,
  mockCategory,
  mockExpenseData,
  mockDiaryData,
  mockChallengeData,
  mockNotificationsData,
};

export default MOCKDATA;
