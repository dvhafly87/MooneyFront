import { FaBell, FaBookOpen, FaTrophy, FaWallet } from 'react-icons/fa';
import { ROUTES } from '../route/routes';

const mockNotificationsData = [
  // 알림에 대한 기능- 챌린지 알림, 예상보다 많이 사용함 알림, 일기 작성 알림(이건 없어도 됨), 시스템 업데이트 알림, 구독 알림(연체, 구독료 지출 날짜) NotificationPanel과 연관됨
  {
    id: 1,
    type: 'challenge',
    icon: FaTrophy,
    title: '챌린지 목표 달성!',
    message: '이번 달 절약 챌린지를 성공적으로 완료했습니다.',
    time: '2시간 전',
    path: ROUTES.CHALLENGE,
    isRead: false,
  },
  {
    id: 2,
    type: 'expense',
    icon: FaWallet,
    title: '월 예산 80% 사용',
    message: '이번 달 예산의 80%를 사용했습니다.',
    time: '4시간 전',
    path: ROUTES.ACCOUNT_BOOK,
    isRead: true,
  },
  {
    id: 3,
    type: 'diary',
    icon: FaBookOpen,
    title: '소비 일기 작성 알림',
    message: '어제 소비에 대한 일기를 작성해보세요.',
    time: '1일 전',
    path: ROUTES.DIARY,
    isRead: false,
  },
  {
    id: 4,
    type: 'system',
    icon: FaBell,
    title: '새로운 기능 업데이트',
    message: '가계부 차트 기능이 새롭게 추가되었습니다.',
    time: '2일 전',
    path: '/chart',
    isRead: true,
  },
];

const mockUserData = [
  {
    id: 'testuser123',
    pw: 'testuser123',
    nick: '가계부마스터',
    pphoto: null, // 프로필 사진이 없는 경우
    regd: '2024-01-15T00:00:00Z',
    bir: '1995-06-20T00:00:00Z',
    ppnt: 15750, // 포인트
  },
  {
    id: 'user001',
    pw: 'user001',
    nick: 'user000000',
    pphoto: 'null',
    regd: '2025-07-08',
    bir: '2020-05-05',
    ppnt: 11111,
  },
  {
    id: 'user002',
    pw: 'user002',
    nick: 'user023456',
    pphoto: 'null',
    regd: '2025-07-09',
    bir: '2020-05-09',
    ppnt: 456,
  },
  {
    id: 'admin',
    pw: '1234',
    nick: 'addmin',
    pphoto: 'null',
    regd: '2025-07-08',
    bir: '2020-05-05',
    ppnt: 987654,
  },
];

const mockCategory = [
  { mcatId: 1, mcatName: '엔터테인먼트', mcatColor: '#FF6384' },
  { mcatId: 2, mcatName: '업무/생산성', mcatColor: '#36A2EB' },
  { mcatId: 3, mcatName: '클라우드 저장소', mcatColor: '#FFCE56' },
  { mcatId: 4, mcatName: '쇼핑', mcatColor: '#8BC34A' },
  { mcatId: 5, mcatName: '기타', mcatColor: '#9C27B0' },
];

const mockExpenseData = [
  // === 구독 예정 (PENDING) ===

  // mcatId로 카테고리의 데이터를 사용하도록
  {
    mexpId: 1,
    mexpMmemId: 'user001',
    mexpDt: null, // 아직 지출 안함
    mexpAmt: 17000,
    mexpDec: 'Netflix 구독료',
    mexpType: 'E',
    mexpRpt: 'T', // 반복 지출
    mexpRptdd: '2025-07-25', // 지출해야 할 날짜
    mexpStatus: 'PENDING',
    mcatId: 1,
    // categoryName: '엔터테인먼트',
    // categoryColor: '#FF6384',
  },
  {
    mexpId: 2,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 10900,
    mexpDec: 'Spotify Premium',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-07-28',
    mexpStatus: 'PENDING',
    mcatId: 1,
    // categoryName: '엔터테인먼트',
    // categoryColor: '#FF6384',
  },
  {
    mexpId: 3,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 29000,
    mexpDec: 'Adobe Creative Cloud',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-08-15', // 한달 넘음
    mexpStatus: 'PENDING',
    mcatId: 2,
    // categoryName: '업무/생산성',
    // categoryColor: '#36A2EB',
  },
  {
    mexpId: 4,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 2900,
    mexpDec: 'Google Drive 스토리지',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-08-01',
    mexpStatus: 'PENDING',
    mcatId: 3,
    // categoryName: '클라우드 저장소',
    // categoryColor: '#FFCE56',
  },
  {
    mexpId: 5,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 4990,
    mexpDec: '쿠팡 와우 멤버십',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-07-20', // 이미 지남 (OVERDUE 상태로 변경 예정)
    mexpStatus: 'OVERDUE',
    mcatId: 4,
    // categoryName: '쇼핑',
    // categoryColor: '#8BC34A',
  },
  {
    mexpId: 6,
    mexpMmemId: 'testuser123',
    mexpDt: '',
    mexpDec: '',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mcatId: 5,
  },

  // === 구독 완료 (COMPLETED) ===
  {
    mexpId: 101,
    mexpMmemId: 'user001',
    mexpDt: '2025-07-12', // 실제 지출한 날짜
    mexpAmt: 17000,
    mexpDec: 'Netflix 구독료',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-06-25', // 원래 예정일
    mexpStatus: 'COMPLETED',
    mcatId: 1,
    // categoryName: '엔터테인먼트',
    // categoryColor: '#FF6384',
  },
  {
    mexpId: 102,
    mexpMmemId: 'user001',
    mexpDt: '2025-07-10',
    mexpAmt: 2900,
    mexpDec: 'Google Drive 스토리지',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-07-01',
    mexpStatus: 'COMPLETED',
    mcatId: 3,
    // categoryName: '클라우드 저장소',
    // categoryColor: '#FFCE56',
  },

  // === 일반 지출 (참고용) ===
  {
    mexpId: 201,
    mexpMmemId: 'user001',
    mexpDt: '2025-07-15',
    mexpAmt: 50000,
    mexpDec: '마트 장보기',
    mexpType: 'E',
    mexpRpt: 'F', // 일회성
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mcatId: 5,
    // categoryName: '기타',
    // categoryColor: '#9C27B0',
  },
];

const MOCKDATA = { mockNotificationsData, mockUserData, mockCategory, mockExpenseData };

export default MOCKDATA;
