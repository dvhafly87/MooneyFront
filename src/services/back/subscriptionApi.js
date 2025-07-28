// src/services/back/subscriptionApi.js

const SERVER_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7474';

/**
 * localStorage에서 현재 로그인된 사용자 ID 가져오기
 */
const getCurrentUserId = () => {
  try {
    const savedLoginState = localStorage.getItem('isYouLogined');
    if (savedLoginState) {
      const userData = JSON.parse(savedLoginState);
      return userData.id;
    }
    return null;
  } catch (error) {
    console.error('사용자 ID 가져오기 실패:', error);
    return null;
  }
};

/**
 * 응답 처리 헬퍼 함수
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Content-Type 확인
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  return await response.text();
};

/**
 * 구독 리스트 조회 API
 * AccountBookPage와 동일한 방식: GET /expenses/member/{memberId}에서 구독만 필터링
 */
const getSubscriptions = async () => {
  try {
    const memberId = getCurrentUserId();
    if (!memberId) {
      throw new Error('로그인이 필요합니다.');
    }

    console.log(`🔍 구독 리스트 조회: GET ${SERVER_URL}/expenses/member/${memberId}`);

    const response = await fetch(`${SERVER_URL}/expenses/member/${memberId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    // 204 No Content인 경우
    if (response.status === 204) {
      return {
        success: true,
        data: [],
      };
    }

    const allExpenses = await handleResponse(response);
    console.log('✅ 전체 지출 내역 조회 성공:', allExpenses.length);

    // 구독만 필터링 (MEXP_RPT = 'T', MEXP_TYPE = 'E')
    const subscriptions = allExpenses.filter(
      (expense) => expense.mexpRpt === 'T' && expense.mexpType === 'E',
    );

    console.log(`📋 구독 데이터 필터링 완료: ${subscriptions.length}개`);

    // 카테고리 이름과 색상 정보 추가
    const subscriptionsWithCategory = subscriptions.map((subscription) => ({
      ...subscription,
      categoryName: subscription.category?.mcatName || '기타',
      categoryColor: subscription.category?.mcatColor || '#AAAAAA',
      mcatId: subscription.category?.mcatId || null,
      // 날짜 형식 통일 (LocalDate는 문자열로 전달됨)
      mexpRptdd: subscription.mexpRptdd,
      mexpDt: subscription.mexpDt,
    }));

    return {
      success: true,
      data: subscriptionsWithCategory,
    };
  } catch (error) {
    console.error('❌ 구독 리스트 조회 실패:', error);
    throw new Error(error.message || '구독 데이터를 불러오는데 실패했습니다.');
  }
};

/**
 * 구독 추가 API
 * AccountBookPage와 동일한 방식: POST /expenses/member/{memberId}?mcatId={categoryId}
 */
const addSubscription = async (subscriptionData) => {
  try {
    const memberId = getCurrentUserId();
    if (!memberId) {
      throw new Error('로그인이 필요합니다.');
    }

    // 데이터 유효성 검사
    validateSubscriptionData(subscriptionData);

    const requestData = {
      mexpDt: null, // 아직 지출하지 않음
      mexpAmt: parseInt(subscriptionData.mexpAmt),
      mexpDec: subscriptionData.mexpDec.trim(),
      mexpType: 'E', // 지출
      mexpRpt: 'T', // 반복
      mexpRptdd: subscriptionData.mexpRptdd,
      mexpStatus: 'PENDING', // 예정 상태
      mexpFrequency: 'MONTHLY', // 월간 반복
    };

    console.log(
      `📝 구독 추가: POST ${SERVER_URL}/expenses/member/${memberId}?mcatId=${subscriptionData.mcatId}`,
      requestData,
    );

    const response = await fetch(
      `${SERVER_URL}/expenses/member/${memberId}?mcatId=${subscriptionData.mcatId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData),
      },
    );

    const createdExpense = await handleResponse(response);
    console.log('✅ 구독 추가 성공:', createdExpense);

    return {
      success: true,
      message: `${subscriptionData.mexpDec} 구독이 성공적으로 추가되었습니다!`,
      data: createdExpense,
    };
  } catch (error) {
    console.error('❌ 구독 추가 실패:', error);
    throw new Error(error.message || '구독 추가에 실패했습니다.');
  }
};

/**
 * 구독 삭제 API
 * 🔒 안전장치: PENDING/OVERDUE 상태의 구독만 삭제 가능
 */
const deleteSubscription = async (mexpId) => {
  try {
    console.log(`🗑️ 구독 삭제 요청: ${mexpId}`);

    // 1. 삭제 전 구독 상태 확인
    const subscriptions = await getSubscriptions();
    const targetSubscription = subscriptions.data.find((sub) => sub.mexpId === mexpId);

    if (!targetSubscription) {
      throw new Error('해당 구독을 찾을 수 없습니다.');
    }

    // 2. 상태 검증: PENDING/OVERDUE만 삭제 허용
    if (!['PENDING', 'OVERDUE'].includes(targetSubscription.mexpStatus)) {
      throw new Error('이미 지출 완료된 구독은 삭제할 수 없습니다.');
    }

    console.log(
      `🔍 삭제 가능한 구독 확인됨: ${targetSubscription.mexpDec} (${targetSubscription.mexpStatus})`,
    );

    // 3. 실제 삭제 실행
    const response = await fetch(`${SERVER_URL}/expenses/${mexpId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.status === 204) {
      console.log('✅ 구독 삭제 성공');
      return {
        success: true,
        message: `${targetSubscription.mexpDec} 구독이 삭제되었습니다.`,
      };
    }

    throw new Error(`HTTP error! status: ${response.status}`);
  } catch (error) {
    console.error('❌ 구독 삭제 실패:', error);
    throw new Error(error.message || '구독 삭제에 실패했습니다.');
  }
};

/**
 * 구독 수정 API
 * 🔒 안전장치: PENDING/OVERDUE 상태의 구독만 수정 가능
 */
const updateSubscription = async (mexpId, subscriptionData) => {
  try {
    // 데이터 유효성 검사
    validateSubscriptionData(subscriptionData);

    console.log(`✏️ 구독 수정 요청: ${mexpId}`);

    // 1. 수정 전 구독 상태 확인
    const subscriptions = await getSubscriptions();
    const targetSubscription = subscriptions.data.find((sub) => sub.mexpId === mexpId);

    if (!targetSubscription) {
      throw new Error('해당 구독을 찾을 수 없습니다.');
    }

    // 2. 상태 검증: PENDING/OVERDUE만 수정 허용
    if (!['PENDING', 'OVERDUE'].includes(targetSubscription.mexpStatus)) {
      throw new Error('이미 지출 완료된 구독은 수정할 수 없습니다.');
    }

    console.log(
      `🔍 수정 가능한 구독 확인됨: ${targetSubscription.mexpDec} (${targetSubscription.mexpStatus})`,
    );

    // 3. 기존 구독 삭제 (상태 검증은 이미 완료)
    const response = await fetch(`${SERVER_URL}/expenses/${mexpId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.status !== 204) {
      throw new Error(`삭제 실패: HTTP error! status: ${response.status}`);
    }

    // 4. 새 구독 생성
    const result = await addSubscription(subscriptionData);

    return {
      success: true,
      message: `${subscriptionData.mexpDec} 구독이 성공적으로 수정되었습니다!`,
      data: result.data,
    };
  } catch (error) {
    console.error('❌ 구독 수정 실패:', error);
    throw new Error(error.message || '구독 수정에 실패했습니다.');
  }
};

/**
 * 구독 결제 완료 처리 API
 * 개별 구독의 상태를 PENDING → COMPLETED로 변경하고 다음 달 구독 생성
 */
const completePayment = async (mexpId) => {
  try {
    const memberId = getCurrentUserId();
    if (!memberId) {
      throw new Error('로그인이 필요합니다.');
    }

    console.log(`💳 결제 완료 처리: ${mexpId} - 개별 처리 방식`);

    // 1. 기존 구독 정보 조회
    const subscriptions = await getSubscriptions();
    const targetSubscription = subscriptions.data.find((sub) => sub.mexpId === mexpId);

    if (!targetSubscription) {
      throw new Error('해당 구독을 찾을 수 없습니다.');
    }

    // 2. 기존 PENDING 구독 삭제
    await deleteSubscription(mexpId);

    // 3. COMPLETED 상태의 구독 생성 (현재 날짜로)
    const currentDate = new Date().toISOString().split('T')[0];
    const completedData = {
      mexpDt: currentDate, // 실제 지출일
      mexpAmt: targetSubscription.mexpAmt,
      mexpDec: targetSubscription.mexpDec,
      mexpType: 'E',
      mexpRpt: 'T',
      mexpRptdd: targetSubscription.mexpRptdd,
      mexpStatus: 'COMPLETED',
      mexpFrequency: 'MONTHLY',
    };

    await fetch(`${SERVER_URL}/expenses/member/${memberId}?mcatId=${targetSubscription.mcatId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(completedData),
    });

    // 4. 다음 달 PENDING 구독 생성
    const nextMonth = new Date(targetSubscription.mexpRptdd);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonthDate = nextMonth.toISOString().split('T')[0];

    const nextMonthData = {
      mexpDt: null,
      mexpAmt: targetSubscription.mexpAmt,
      mexpDec: targetSubscription.mexpDec,
      mexpType: 'E',
      mexpRpt: 'T',
      mexpRptdd: nextMonthDate,
      mexpStatus: 'PENDING',
      mexpFrequency: 'MONTHLY',
    };

    await fetch(`${SERVER_URL}/expenses/member/${memberId}?mcatId=${targetSubscription.mcatId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(nextMonthData),
    });

    console.log('✅ 결제 완료 처리 성공');

    return {
      success: true,
      message: '결제가 완료되었습니다!',
      data: { completed: true },
    };
  } catch (error) {
    console.error('❌ 결제 완료 처리 실패:', error);
    throw new Error(error.message || '결제 처리 중 오류가 발생했습니다.');
  }
};

/**
 * 카테고리 목록 조회 API (조회만)
 * AccountBookPage와 동일한 방식: GET /categories/member/{memberId}
 */
const getCategories = async () => {
  try {
    const memberId = getCurrentUserId();
    if (!memberId) {
      throw new Error('로그인이 필요합니다.');
    }

    console.log(`📂 카테고리 조회: GET ${SERVER_URL}/categories/member/${memberId}`);

    const response = await fetch(`${SERVER_URL}/categories/member/${memberId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.status === 204) {
      return {
        success: true,
        data: [],
      };
    }

    const categories = await handleResponse(response);
    console.log('✅ 카테고리 조회 성공:', categories);

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    console.error('❌ 카테고리 조회 실패:', error);
    throw new Error(error.message || '카테고리 정보를 불러올 수 없습니다.');
  }
};

/**
 * 구독 데이터 유효성 검사
 */
const validateSubscriptionData = (subscriptionData) => {
  if (!subscriptionData.mexpDec?.trim()) {
    throw new Error('구독 서비스 설명을 입력해주세요.');
  }

  if (!subscriptionData.mcatId) {
    throw new Error('카테고리를 선택해주세요.');
  }

  if (!subscriptionData.mexpAmt || parseInt(subscriptionData.mexpAmt) <= 0) {
    throw new Error('올바른 금액을 입력해주세요.');
  }

  if (!subscriptionData.mexpRptdd) {
    throw new Error('지출 예정일을 선택해주세요.');
  }
};

/**
 * 구독 상태 계산 유틸리티 함수들
 */
export const subscriptionUtils = {
  // 지출해야 할 것 필터링 (PENDING, OVERDUE)
  getPendingPayments: (expenses) => {
    const today = new Date();
    const oneMonthFromNow = new Date(today);
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return expenses.filter((expense) => {
      // 구독만 (MEXP_RPT = 'T')
      if (expense.mexpRpt !== 'T') return false;

      // 예정 또는 연체 상태만
      if (!['PENDING', 'OVERDUE'].includes(expense.mexpStatus)) return false;

      const dueDate = new Date(expense.mexpRptdd);

      // OVERDUE: 지출 예정일이 지났고, 일주일 전까지 표시
      if (expense.mexpStatus === 'OVERDUE') {
        return dueDate >= oneWeekAgo && dueDate < today;
      }

      // PENDING: 한달 이내 예정일
      return dueDate >= today && dueDate <= oneMonthFromNow;
    });
  },

  // 지출 완료된 것 필터링 (COMPLETED)
  getCompletedPayments: (expenses, memberId) => {
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return expenses.filter((expense) => {
      // 구독만 (MEXP_RPT = 'T')
      if (expense.mexpRpt !== 'T') return false;

      // 완료된 것만
      if (expense.mexpStatus !== 'COMPLETED') return false;

      // 실제 지출일이 있어야 함
      if (!expense.mexpDt) return false;

      // 실제 지출일이 3일 전부터 오늘까지
      const expenseDate = new Date(expense.mexpDt);
      return expenseDate >= threeDaysAgo && expenseDate <= today;
    });
  },

  // 예정일과 현재 날짜 비교해서 상태 정보 계산
  getDueStatus: (expense) => {
    const today = new Date();
    const dueDate = new Date(expense.mexpRptdd);
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (expense.mexpStatus === 'OVERDUE') {
      return {
        color: '#FF4D4D',
        text: `${Math.abs(diffDays)}일 지남`,
        icon: '⚠️',
      };
    }

    if (diffDays === 0) return { color: '#FF9800', text: '오늘', icon: '🕐' };
    if (diffDays <= 3) return { color: '#FF9800', text: `${diffDays}일 후`, icon: '🕐' };
    return { color: '#666', text: `${diffDays}일 후`, icon: '🕐' };
  },

  // 카테고리별 지출 차트 데이터 계산
  getChartData: (completedPayments) => {
    const categoryTotals = {};

    completedPayments.forEach((expense) => {
      const categoryName = expense.categoryName || '기타';
      if (!categoryTotals[categoryName]) {
        categoryTotals[categoryName] = {
          category: categoryName,
          amount: 0,
          color: expense.categoryColor || '#AAAAAA',
        };
      }
      categoryTotals[categoryName].amount += expense.mexpAmt;
    });

    return Object.values(categoryTotals);
  },
};

// 구독 전용 API 객체 생성 (카테고리 관리 기능 제외)
const BACK_SUBSCRIPTION_API = {
  getSubscriptions,
  addSubscription,
  updateSubscription,
  deleteSubscription,
  completePayment,
  getCategories, // 조회만
};

export default BACK_SUBSCRIPTION_API;
