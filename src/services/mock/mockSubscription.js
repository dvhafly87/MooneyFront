import MOCKDATA from '../../assets/mockData.js';

// 현재 로그인한 사용자 ID 가져오기
const getCurrentUserId = () => {
  const mockSession = sessionStorage.getItem('mockSession');
  if (!mockSession) {
    throw new Error('로그인이 필요합니다.');
  }

  const sessionData = JSON.parse(mockSession);
  return sessionData.userId;
};

// 구독 관련 데이터 필터링 (MEXP_RPT = 'T', MEXP_TYPE = 'E')
const getSubscriptionExpenses = (userId) => {
  return MOCKDATA.mockExpenseData.filter(
    (expense) =>
      expense.mexpMmemId === userId && expense.mexpRpt === 'T' && expense.mexpType === 'E',
  );
};

// 카테고리 정보 추가 (categoryName, categoryColor) + 날짜 문자열 변환
const addCategoryInfo = (expenses) => {
  return expenses.map((expense) => {
    const category = MOCKDATA.mockCategory.find((cat) => cat.mcatId === expense.mcatId);
    return {
      ...expense,
      categoryName: category ? category.mcatName : '기타',
      categoryColor: category ? category.mcatColor : '#999999',
      // 날짜를 문자열로 변환 (Date 객체인 경우)
      mexpRptdd:
        expense.mexpRptdd instanceof Date
          ? expense.mexpRptdd.toISOString().split('T')[0]
          : expense.mexpRptdd,
      mexpDt:
        expense.mexpDt instanceof Date
          ? expense.mexpDt.toISOString().split('T')[0]
          : expense.mexpDt,
    };
  });
};

//? 구독 리스트 조회 API
const getSubscriptions = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    const currentUserId = getCurrentUserId();
    const subscriptionExpenses = getSubscriptionExpenses(currentUserId);
    const subscriptionsWithCategory = addCategoryInfo(subscriptionExpenses);

    return {
      success: true,
      data: subscriptionsWithCategory,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

//? 구독 추가 API
const addSubscription = async (subscriptionData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const currentUserId = getCurrentUserId();

    // 폼 유효성 검사
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

    const selectedCategory = MOCKDATA.mockCategory.find(
      (cat) => cat.mcatId === parseInt(subscriptionData.mcatId),
    );

    if (!selectedCategory) {
      throw new Error('존재하지 않는 카테고리입니다.');
    }

    const newSubscription = {
      mexpId: Date.now(), // 임시 ID 생성
      mexpMmemId: currentUserId,
      mexpDt: null, // 아직 지출하지 않음
      mexpAmt: parseInt(subscriptionData.mexpAmt),
      mexpDec: subscriptionData.mexpDec,
      mexpType: 'E', // Expense (지출)
      mexpRpt: 'T', // True (반복)
      mexpRptdd: subscriptionData.mexpRptdd,
      mexpStatus: 'PENDING', // 예정 상태
      mexpFrequency: 'MONTHLY', // 월간
      mcatId: parseInt(subscriptionData.mcatId),
      categoryName: selectedCategory.mcatName,
      categoryColor: selectedCategory.mcatColor,
    };

    // mockData에 추가
    MOCKDATA.mockExpenseData.push(newSubscription);

    return {
      success: true,
      message: `${subscriptionData.mexpDec} 구독이 성공적으로 추가되었습니다!`,
      data: newSubscription,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

//? 구독 수정 API
const updateSubscription = async (mexpId, subscriptionData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const currentUserId = getCurrentUserId();

    // 폼 유효성 검사
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

    const expenseIndex = MOCKDATA.mockExpenseData.findIndex(
      (expense) => expense.mexpId === mexpId && expense.mexpMmemId === currentUserId,
    );

    if (expenseIndex === -1) {
      throw new Error('수정할 구독을 찾을 수 없습니다.');
    }

    const selectedCategory = MOCKDATA.mockCategory.find(
      (cat) => cat.mcatId === parseInt(subscriptionData.mcatId),
    );

    if (!selectedCategory) {
      throw new Error('존재하지 않는 카테고리입니다.');
    }

    // 기존 데이터 업데이트
    const updatedExpense = {
      ...MOCKDATA.mockExpenseData[expenseIndex],
      mexpAmt: parseInt(subscriptionData.mexpAmt),
      mexpDec: subscriptionData.mexpDec,
      mexpRptdd: subscriptionData.mexpRptdd,
      mcatId: parseInt(subscriptionData.mcatId),
      categoryName: selectedCategory.mcatName,
      categoryColor: selectedCategory.mcatColor,
    };

    MOCKDATA.mockExpenseData[expenseIndex] = updatedExpense;

    return {
      success: true,
      message: `${subscriptionData.mexpDec} 구독이 성공적으로 수정되었습니다!`,
      data: updatedExpense,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

//? 구독 삭제 API
const deleteSubscription = async (mexpId) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    const currentUserId = getCurrentUserId();

    const expenseIndex = MOCKDATA.mockExpenseData.findIndex(
      (expense) => expense.mexpId === mexpId && expense.mexpMmemId === currentUserId,
    );

    if (expenseIndex === -1) {
      throw new Error('삭제할 구독을 찾을 수 없습니다.');
    }

    const deletedExpense = MOCKDATA.mockExpenseData[expenseIndex];
    MOCKDATA.mockExpenseData.splice(expenseIndex, 1);

    return {
      success: true,
      message: `${deletedExpense.mexpDec} 구독이 삭제되었습니다.`,
      data: deletedExpense,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

//? 구독 결제 완료 처리 API
const completePayment = async (mexpId) => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  try {
    const currentUserId = getCurrentUserId();
    const today = new Date();

    const expenseIndex = MOCKDATA.mockExpenseData.findIndex(
      (expense) =>
        expense.mexpId === mexpId &&
        expense.mexpMmemId === currentUserId &&
        ['PENDING', 'OVERDUE'].includes(expense.mexpStatus),
    );

    if (expenseIndex === -1) {
      throw new Error('결제 처리할 구독을 찾을 수 없습니다.');
    }

    const expense = MOCKDATA.mockExpenseData[expenseIndex];
    const actualDate = today.toISOString().split('T')[0];

    // 1. 기존 PENDING/OVERDUE 레코드를 COMPLETED로 업데이트
    MOCKDATA.mockExpenseData[expenseIndex] = {
      ...expense,
      mexpDt: actualDate, // 실제 지출한 날짜
      mexpStatus: 'COMPLETED',
    };

    // 2. 다음 달 PENDING 레코드 자동 생성
    const nextMonth = new Date(expense.mexpRptdd);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const newPendingExpense = {
      mexpId: Date.now() + 1, // 임시 ID (중복 방지)
      mexpMmemId: expense.mexpMmemId,
      mexpDt: null, // 아직 지출 안함
      mexpAmt: expense.mexpAmt,
      mexpDec: expense.mexpDec,
      mexpType: 'E',
      mexpRpt: 'T',
      mexpRptdd: nextMonth.toISOString().split('T')[0], // 다음 달 예정일
      mexpStatus: 'PENDING',
      mexpFrequency: 'MONTHLY',
      mcatId: expense.mcatId,
      categoryName: expense.categoryName,
      categoryColor: expense.categoryColor,
    };

    MOCKDATA.mockExpenseData.push(newPendingExpense);

    return {
      success: true,
      message: `${expense.mexpDec} 결제가 완료되었습니다!`,
      data: {
        completedExpense: MOCKDATA.mockExpenseData[expenseIndex],
        newPendingExpense: newPendingExpense,
      },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

//? 카테고리 목록 조회 API
const getCategories = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  try {
    return {
      success: true,
      data: MOCKDATA.mockCategory,
    };
  } catch (error) {
    throw new Error('카테고리 정보를 불러올 수 없습니다.');
  }
};

// MOCK_SUBSCRIPTION_API 객체 생성
const MOCK_SUBSCRIPTION_API = {
  getSubscriptions,
  addSubscription,
  updateSubscription,
  deleteSubscription,
  completePayment,
  getCategories,
};

export default MOCK_SUBSCRIPTION_API;
