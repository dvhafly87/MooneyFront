import MOCKDATA from '../../assets/mockData.js';

/**
 * 로그인한 사용자 정보 가져오기
 */
const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      return user.mmemId || user.userId || user.id; // 여러 키 형태 지원
    }
    return 'user001'; // 기본값 (로그인 정보가 없을 때)
  } catch (error) {
    console.error('사용자 정보를 불러올 수 없습니다:', error);
    return 'user001'; // 에러 시 기본값
  }
};

/**
 * 특정 날짜의 소비 내역을 가져오는 Mock API
 * @param {Date} date - 조회할 날짜
 * @param {string} userId - 사용자 ID (선택사항)
 * @returns {Object} - 해당 날짜의 수입/지출 데이터와 카테고리별 집계
 */
const getExpensesByDate = (date, userId = null) => {
  const currentUserId = userId || getCurrentUser();
  const targetDate = new Date(date);

  // 해당 날짜의 완료된 거래만 필터링
  const dayExpenses = MOCKDATA.mockExpenseData.filter((expense) => {
    if (
      !expense.mexpDt ||
      expense.mexpMmemId !== currentUserId ||
      expense.mexpStatus !== 'COMPLETED'
    ) {
      return false;
    }

    const expenseDate = new Date(expense.mexpDt);

    return (
      expenseDate.getFullYear() === targetDate.getFullYear() &&
      expenseDate.getMonth() === targetDate.getMonth() &&
      expenseDate.getDate() === targetDate.getDate()
    );
  });

  // 수입과 지출 분리
  const income = dayExpenses
    .filter((expense) => expense.mexpType === 'I')
    .reduce((sum, expense) => sum + expense.mexpAmt, 0);

  const expenses = dayExpenses.filter((expense) => expense.mexpType === 'E');
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.mexpAmt, 0);

  // 카테고리별 집계 (지출만)
  const categoryData = {};
  expenses.forEach((expense) => {
    const category = MOCKDATA.mockCategory.find((cat) => cat.mcatId === expense.mcatId);
    const categoryName = category ? category.mcatName : '기타';
    const categoryColor = category ? category.mcatColor : '#9C27B0';

    if (!categoryData[categoryName]) {
      categoryData[categoryName] = {
        amount: 0,
        color: categoryColor,
        items: [],
      };
    }

    categoryData[categoryName].amount += expense.mexpAmt;
    categoryData[categoryName].items.push({
      description: expense.mexpDec,
      amount: expense.mexpAmt,
    });
  });

  // 차트용 데이터 생성
  const chartData = Object.entries(categoryData).map(([name, data]) => ({
    name,
    value: data.amount,
    color: data.color,
  }));

  // 날짜 출력용 문자열 포맷팅
  const dateString = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;

  return {
    date: dateString,
    income,
    totalExpense,
    expenses: expenses.map((expense) => ({
      id: expense.mexpId,
      description: expense.mexpDec,
      amount: expense.mexpAmt,
      category:
        MOCKDATA.mockCategory.find((cat) => cat.mcatId === expense.mcatId)?.mcatName || '기타',
    })),
    categoryData,
    chartData,
  };
};

/**
 * 특정 월의 모든 날짜별 소비 요약 데이터 가져오기
 * @param {number} year - 연도
 * @param {number} month - 월 (1-12)
 * @param {string} userId - 사용자 ID (선택사항)
 * @returns {Array} - 월별 일자별 소비 요약
 */
const getMonthlyExpenseSummary = (year, month, userId = null) => {
  const currentUserId = userId || getCurrentUser();
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const summary = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayData = getExpensesByDate(new Date(d), currentUserId);
    summary.push(dayData);
  }

  return summary;
};

/**
 * 현재 사용자 ID 가져오기
 */
const getCurrentUserId = () => {
  return getCurrentUser();
};

// Export API 객체
const MOCK_EXPENSE_API = {
  getCurrentUserId,
  getExpensesByDate,
  getMonthlyExpenseSummary,
};

export default MOCK_EXPENSE_API;
