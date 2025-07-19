import { useState, useEffect } from 'react';
import {
  FaPlus,
  FaSortAmountDown,
  FaSortAlphaDown,
  FaClock,
  FaCheck,
  FaEdit,
  FaTrash,
  FaCalendarCheck,
  FaExclamationTriangle,
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { showSuccess, showError, showWarning, showInfo } from '../utils/toast';
import S from '../styles/subscriptionPage.style';
import MOCKDATA from '../assets/mockData.js';

const alignStyle = {
  LATEST: 'latest',
  HIGHEST: 'highest',
  NAMING: 'naming',
};

function SubscriptionPage() {
  const [alignWay, setAlignWay] = useState(alignStyle.LATEST);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [formData, setFormData] = useState({
    mexpDec: '', // 구독 서비스 설명
    mexpAmt: '', // 금액
    mexpRptdd: '', // 지출해야 할 날짜 (예정일)
    mcatId: '', // 카테고리 ID
  });

  // Mock 카테고리 데이터
  // 카테고리 데이터 가져오기
  const [categories] = useState(MOCKDATA.mockCategory);

  // Mock 수입/지출 테이블 데이터 (수정된 구조)
  const [expenses, setExpenses] = useState(
    MOCKDATA.mockExpenseData.filter(() => {
      // 구독 데이터를 가져오기 위해 가계부 데이터 중, mexpType='E', mexpRpt: 'T'인 데이터들만 필터링 (mexpDt와 mexpRptdd도 해야 하는데 어떻게 할 지 잘 모르겠다)
      // 구독 리스트 추가될 때마다 데이터베이스에도 추가가 필요함(mexpDt와 mexpRptdd도 생각)
      // 가계부 데이터에 mexpRptdd 말고도 구독 주기(cycle) 속성도 있다고 하는데 이것도 생각해야 할듯
    }),
  );

  const today = new Date();

  // 지출해야 할 것 필터링 (MEXP_STATUS = 'PENDING' or 'OVERDUE', MEXP_RPT = 'T')
  const getPendingPayments = () => {
    const oneMonthFromNow = new Date(today);
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    return expenses.filter((expense) => {
      // 구독만 (MEXP_RPT = 'T')
      if (expense.mexpRpt !== 'T') return false;

      // 예정 또는 연체 상태만
      if (!['PENDING', 'OVERDUE'].includes(expense.mexpStatus)) return false;

      // 한달 이내 예정일만
      const dueDate = new Date(expense.mexpRptdd);
      return dueDate >= today && dueDate <= oneMonthFromNow;
    });
  };

  // 지출한 것 필터링 (MEXP_STATUS = 'COMPLETED', MEXP_RPT = 'T', 최근 일주일)
  const getCompletedPayments = () => {
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return expenses.filter((expense) => {
      // 구독만 (MEXP_RPT = 'T')
      if (expense.mexpRpt !== 'T') return false;

      // 완료된 것만
      if (expense.mexpStatus !== 'COMPLETED') return false;

      // 실제 지출일이 있고 최근 일주일 내
      if (!expense.mexpDt) return false;

      const expenseDate = new Date(expense.mexpDt);
      return expenseDate >= oneWeekAgo && expenseDate <= today;
    });
  };

  // 예정일과 현재 날짜 비교해서 상태 정보 계산
  const getDueStatus = (expense) => {
    const dueDate = new Date(expense.mexpRptdd);
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (expense.mexpStatus === 'OVERDUE') {
      return {
        color: '#FF4D4D',
        text: `${Math.abs(diffDays)}일 지남`,
        icon: <FaExclamationTriangle size={10} />,
      };
    }

    if (diffDays === 0) return { color: '#FF9800', text: '오늘', icon: <FaClock size={10} /> };
    if (diffDays <= 3)
      return { color: '#FF9800', text: `${diffDays}일 후`, icon: <FaClock size={10} /> };
    return { color: '#666', text: `${diffDays}일 후`, icon: <FaClock size={10} /> };
  };

  // 카테고리별 지출 차트 데이터 계산 (완료된 지출 기준)
  const getChartData = () => {
    const categoryTotals = {};

    getCompletedPayments().forEach((expense) => {
      const categoryName = expense.categoryName;
      if (!categoryTotals[categoryName]) {
        categoryTotals[categoryName] = {
          category: categoryName,
          amount: 0,
          color: expense.categoryColor,
        };
      }
      categoryTotals[categoryName].amount += expense.mexpAmt;
    });

    return Object.values(categoryTotals);
  };

  // 정렬 함수
  const getSortedPendingPayments = () => {
    const sorted = [...getPendingPayments()];
    switch (alignWay) {
      case alignStyle.HIGHEST:
        return sorted.sort((a, b) => b.mexpAmt - a.mexpAmt);
      case alignStyle.NAMING:
        return sorted.sort((a, b) => a.mexpDec.localeCompare(b.mexpDec));
      case alignStyle.LATEST:
      default:
        return sorted.sort((a, b) => new Date(a.mexpRptdd) - new Date(b.mexpRptdd));
    }
  };

  // 통계 계산
  const getTotalPendingAmount = () => {
    return getPendingPayments().reduce((total, expense) => total + expense.mexpAmt, 0);
  };

  const getTotalCompletedAmount = () => {
    return getCompletedPayments().reduce((total, expense) => total + expense.mexpAmt, 0);
  };

  const getOverdueCount = () => {
    return getPendingPayments().filter((expense) => expense.mexpStatus === 'OVERDUE').length;
  };

  // 지출 완료 처리
  const handleCompletePayment = (expense) => {
    try {
      const actualDate = today.toISOString().split('T')[0];

      // 1. 기존 PENDING/OVERDUE 레코드를 COMPLETED로 업데이트
      setExpenses((prev) =>
        prev.map((item) =>
          item.mexpId === expense.mexpId
            ? {
                ...item,
                mexpDt: actualDate, // 실제 지출한 날짜
                mexpStatus: 'COMPLETED',
              }
            : item,
        ),
      );

      // 2. 다음 달 PENDING 레코드 자동 생성
      const nextMonth = new Date(expense.mexpRptdd);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const newPendingExpense = {
        mexpId: Date.now(), // 임시 ID
        mexpMmemId: expense.mexpMmemId,
        mexpDt: null, // 아직 지출 안함
        mexpAmt: expense.mexpAmt,
        mexpDec: expense.mexpDec,
        mexpType: 'E',
        mexpRpt: 'T',
        mexpRptdd: nextMonth.toISOString().split('T')[0], // 다음 달 예정일
        mexpStatus: 'PENDING',
        mcatId: expense.mcatId,
        categoryName: expense.categoryName,
        categoryColor: expense.categoryColor,
      };

      setExpenses((prev) => [...prev, newPendingExpense]);

      showSuccess(`${expense.mexpDec} 결제가 완료되었습니다! 💳`);
    } catch (error) {
      showError('결제 처리 중 오류가 발생했습니다.');
      console.error('Payment completion error:', error);
    }
  };

  // 구독 추가/수정/삭제 함수들
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOrUpdateSubscription = (e) => {
    e.preventDefault();

    // 폼 유효성 검사
    if (!formData.mexpDec.trim()) {
      showError('구독 서비스 설명을 입력해주세요.');
      return;
    }

    if (!formData.mcatId) {
      showError('카테고리를 선택해주세요.');
      return;
    }

    if (!formData.mexpAmt || parseInt(formData.mexpAmt) <= 0) {
      showError('올바른 금액을 입력해주세요.');
      return;
    }

    if (!formData.mexpRptdd) {
      showError('지출 예정일을 선택해주세요.');
      return;
    }

    try {
      const selectedCategory = categories.find((cat) => cat.mcatId === parseInt(formData.mcatId));

      const expenseData = {
        mexpMmemId: 'user001',
        mexpDt: null, // 아직 지출 안함
        mexpAmt: parseInt(formData.mexpAmt),
        mexpDec: formData.mexpDec,
        mexpType: 'E',
        mexpRpt: 'T', // 반복 지출
        mexpRptdd: formData.mexpRptdd, // 지출 예정일
        mexpStatus: 'PENDING', // 예정 상태
        mcatId: parseInt(formData.mcatId),
        categoryName: selectedCategory.mcatName,
        categoryColor: selectedCategory.mcatColor,
      };

      if (editingSubscription) {
        // 수정 모드
        setExpenses((prev) =>
          prev.map((expense) =>
            expense.mexpId === editingSubscription.mexpId
              ? { ...expenseData, mexpId: editingSubscription.mexpId }
              : expense,
          ),
        );
        showSuccess(`${formData.mexpDec} 구독이 성공적으로 수정되었습니다! 🎉`);
      } else {
        // 추가 모드
        const newExpense = {
          ...expenseData,
          mexpId: Date.now(),
        };
        setExpenses((prev) => [...prev, newExpense]);
        showSuccess(`${formData.mexpDec} 구독이 성공적으로 추가되었습니다! ✨`);
      }

      // 폼 초기화 및 모달 닫기
      setIsModalOpen(false);
      setEditingSubscription(null);
      setFormData({
        mexpDec: '',
        mexpAmt: '',
        mexpRptdd: '',
        mcatId: '',
      });
    } catch (error) {
      showError('구독 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('Subscription error:', error);
    }
  };

  const handleEditSubscription = (expense) => {
    setEditingSubscription(expense);
    setFormData({
      mexpDec: expense.mexpDec,
      mexpAmt: expense.mexpAmt.toString(),
      mexpRptdd: expense.mexpRptdd,
      mcatId: expense.mcatId.toString(),
    });
    setIsModalOpen(true);
    showInfo(`${expense.mexpDec} 구독을 수정합니다.`);
  };

  const handleDeleteSubscription = (mexpId) => {
    const expense = expenses.find((item) => item.mexpId === mexpId);

    if (window.confirm(`'${expense?.mexpDec}' 구독을 정말로 삭제하시겠습니까?`)) {
      try {
        setExpenses((prev) => prev.filter((item) => item.mexpId !== mexpId));
        showSuccess(`${expense?.mexpDec} 구독이 삭제되었습니다.`);
      } catch (error) {
        showError('구독 삭제 중 오류가 발생했습니다.');
        console.error('Delete error:', error);
      }
    }
  };

  const handleOpenAddModal = () => {
    setEditingSubscription(null);
    setFormData({
      mexpDec: '',
      mexpAmt: '',
      mexpRptdd: '',
      mcatId: '',
    });
    setIsModalOpen(true);
    showInfo('새로운 구독을 추가해보세요! ✨');
  };

  // 정렬 방식 변경 핸들러
  const handleSortChange = (newSortType) => {
    setAlignWay(newSortType);

    const sortMessages = {
      [alignStyle.LATEST]: '결제 예정일순으로 정렬되었습니다 📅',
      [alignStyle.HIGHEST]: '높은 금액순으로 정렬되었습니다 💰',
      [alignStyle.NAMING]: '이름순으로 정렬되었습니다 🔤',
    };

    showInfo(sortMessages[newSortType]);
  };

  // 연체 알림
  useEffect(() => {
    const overdueCount = getOverdueCount();
    if (overdueCount > 0) {
      setTimeout(() => {
        showWarning(`${overdueCount}개의 구독료가 연체되었습니다! 확인해주세요. ⚠️`);
      }, 1000);
    }
  }, []);

  return (
    <S.PageContainer>
      {/* 헤더 */}
      <S.Header>
        <h1>구독 관리</h1>
        <p>정기 구독 서비스를 관리하고 지출을 추적하세요 (수정된 가계부 테이블 활용)</p>
      </S.Header>

      <S.GridContainer>
        {/* 왼쪽: 구독 리스트 */}
        <S.LeftColumn>
          {/* 정렬 버튼들 */}
          <S.SortButtonContainer>
            <S.SortButton
              $isActive={alignWay === alignStyle.LATEST}
              onClick={() => handleSortChange(alignStyle.LATEST)}
            >
              <FaClock size={12} />
              결제예정일순
            </S.SortButton>
            <S.SortButton
              $isActive={alignWay === alignStyle.HIGHEST}
              onClick={() => handleSortChange(alignStyle.HIGHEST)}
            >
              <FaSortAmountDown size={12} />
              높은 금액순
            </S.SortButton>
            <S.SortButton
              $isActive={alignWay === alignStyle.NAMING}
              onClick={() => handleSortChange(alignStyle.NAMING)}
            >
              <FaSortAlphaDown size={12} />
              이름순
            </S.SortButton>
          </S.SortButtonContainer>

          {/* 지출해야 할 것 */}
          <S.SubscriptionListContainer>
            <h3>💰 지출해야 할 것 (STATUS: PENDING/OVERDUE)</h3>
            <S.SubscriptionList>
              {getSortedPendingPayments().map((expense) => {
                const dueStatus = getDueStatus(expense);
                return (
                  <S.SubscriptionCard
                    key={expense.mexpId}
                    $isPaid={false}
                    style={{
                      borderColor: expense.mexpStatus === 'OVERDUE' ? '#FF4D4D' : '#FF9800',
                    }}
                  >
                    <S.SubscriptionCardContent>
                      <S.SubscriptionInfo>
                        <S.CategoryDot $color={expense.categoryColor} />
                        <S.SubscriptionTextInfo>
                          <h4>{expense.mexpDec}</h4>
                          <p>
                            {expense.categoryName} • 예정일: {expense.mexpRptdd}
                          </p>
                          <p className="sub-info" style={{ color: dueStatus.color }}>
                            {dueStatus.icon} {dueStatus.text} • ID: {expense.mexpId}
                          </p>
                        </S.SubscriptionTextInfo>
                      </S.SubscriptionInfo>
                      <S.SubscriptionRightSection>
                        <S.AmountInfo $isPaid={false}>
                          <div className="amount">{expense.mexpAmt.toLocaleString()}원</div>
                          <div className="status" style={{ color: dueStatus.color }}>
                            {expense.mexpStatus === 'OVERDUE' ? '연체됨' : '결제 필요'}
                          </div>
                        </S.AmountInfo>
                        <S.ActionButtons>
                          <S.ActionButton
                            $variant="paid"
                            onClick={() => handleCompletePayment(expense)}
                            title="결제 완료"
                          >
                            <FaCalendarCheck size={10} />
                          </S.ActionButton>
                          <S.ActionButton
                            $variant="edit"
                            onClick={() => handleEditSubscription(expense)}
                            title="수정"
                          >
                            <FaEdit size={10} />
                          </S.ActionButton>
                          <S.ActionButton
                            $variant="delete"
                            onClick={() => handleDeleteSubscription(expense.mexpId)}
                            title="삭제"
                          >
                            <FaTrash size={10} />
                          </S.ActionButton>
                        </S.ActionButtons>
                      </S.SubscriptionRightSection>
                    </S.SubscriptionCardContent>
                  </S.SubscriptionCard>
                );
              })}
            </S.SubscriptionList>
          </S.SubscriptionListContainer>

          {/* 지출한 것 */}
          <S.SubscriptionListContainer style={{ marginTop: '20px' }}>
            <h3>✅ 지출한 것 (STATUS: COMPLETED, 최근 일주일)</h3>
            <S.SubscriptionList>
              {getCompletedPayments().map((expense) => {
                const dueDate = new Date(expense.mexpRptdd);
                const actualDate = new Date(expense.mexpDt);
                const delayDays = Math.ceil((actualDate - dueDate) / (1000 * 60 * 60 * 24));

                return (
                  <S.SubscriptionCard key={expense.mexpId} $isPaid={true}>
                    <S.SubscriptionCardContent>
                      <S.SubscriptionInfo>
                        <S.CategoryDot $color={expense.categoryColor} />
                        <S.SubscriptionTextInfo>
                          <h4>{expense.mexpDec}</h4>
                          <p>
                            {expense.categoryName} • 지출일: {expense.mexpDt}
                          </p>
                          <p className="sub-info">
                            예정일: {expense.mexpRptdd}
                            {delayDays > 0 && (
                              <span style={{ color: '#FF9800', marginLeft: '8px' }}>
                                ({delayDays}일 늦음)
                              </span>
                            )}
                            {delayDays < 0 && (
                              <span style={{ color: '#4CAF50', marginLeft: '8px' }}>
                                ({Math.abs(delayDays)}일 빠름)
                              </span>
                            )}
                          </p>
                        </S.SubscriptionTextInfo>
                      </S.SubscriptionInfo>
                      <S.SubscriptionRightSection>
                        <S.AmountInfo $isPaid={true}>
                          <div className="amount">{expense.mexpAmt.toLocaleString()}원</div>
                          <div className="status">지출 완료</div>
                        </S.AmountInfo>
                        <S.ActionButtons>
                          <S.ActionButton $variant="paid" disabled>
                            <FaCheck size={10} />
                          </S.ActionButton>
                        </S.ActionButtons>
                      </S.SubscriptionRightSection>
                    </S.SubscriptionCardContent>
                  </S.SubscriptionCard>
                );
              })}
            </S.SubscriptionList>
          </S.SubscriptionListContainer>
        </S.LeftColumn>

        {/* 오른쪽: 통계 및 차트 */}
        <S.RightColumn>
          {/* 지출 예정 통계 */}
          <S.StatsCard>
            <h3>📅 이번 달 지출 예정</h3>
            <div className="total-amount">{getTotalPendingAmount().toLocaleString()}원</div>
            <div className="breakdown">
              <div style={{ color: '#FF9800' }}>
                예정: {getPendingPayments().filter((e) => e.mexpStatus === 'PENDING').length}개
              </div>
              <div style={{ color: '#FF4D4D' }}>연체: {getOverdueCount()}개</div>
            </div>
          </S.StatsCard>

          {/* 최근 지출 통계 */}
          <S.StatsCard>
            <h3>💸 최근 일주일 지출</h3>
            <div className="total-amount">{getTotalCompletedAmount().toLocaleString()}원</div>
            <div className="breakdown">
              <div className="paid">완료: {getCompletedPayments().length}개</div>
            </div>
          </S.StatsCard>

          {/* 카테고리별 지출 차트 */}
          <S.ChartContainer>
            <h3>카테고리별 지출 (최근 일주일)</h3>
            {getChartData().length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={getChartData()} barSize={30}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" fontSize={12} tick={{ fill: '#666' }} />
                  <YAxis
                    fontSize={12}
                    tick={{ fill: '#666' }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(value) => [`${value.toLocaleString()}원`, '지출']}
                    labelStyle={{ color: '#333' }}
                  />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {getChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                최근 지출 내역이 없습니다.
              </div>
            )}
          </S.ChartContainer>

          {/* 구독 추가 버튼 */}
          <S.AddButton onClick={handleOpenAddModal}>
            <FaPlus size={16} />새 구독 추가
          </S.AddButton>
        </S.RightColumn>
      </S.GridContainer>

      {/* 구독 추가/수정 모달 */}
      {isModalOpen && (
        <S.ModalOverlay>
          <S.ModalContent>
            <h2>{editingSubscription ? '구독 수정' : '구독 추가'}</h2>
            <form onSubmit={handleAddOrUpdateSubscription}>
              <S.FormGroup>
                <S.Label>구독 서비스 설명 (MEXP_DEC)</S.Label>
                <S.Input
                  type="text"
                  name="mexpDec"
                  value={formData.mexpDec}
                  onChange={handleFormChange}
                  required
                  placeholder="Netflix 구독료, Spotify Premium 등"
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.Label>카테고리 (MCAT_ID)</S.Label>
                <S.Select
                  name="mcatId"
                  value={formData.mcatId}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">카테고리 선택</option>
                  {categories.map((category) => (
                    <option key={category.mcatId} value={category.mcatId}>
                      {category.mcatName}
                    </option>
                  ))}
                </S.Select>
              </S.FormGroup>

              <S.FormGroup>
                <S.Label>월 구독료 (MEXP_AMT)</S.Label>
                <S.Input
                  type="number"
                  name="mexpAmt"
                  value={formData.mexpAmt}
                  onChange={handleFormChange}
                  required
                  placeholder="15000"
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.Label>지출 예정일 (MEXP_RPTDD)</S.Label>
                <S.Input
                  type="date"
                  name="mexpRptdd"
                  value={formData.mexpRptdd}
                  onChange={handleFormChange}
                  required
                />
              </S.FormGroup>

              <S.ButtonRow>
                <S.SubmitButton type="submit">
                  {editingSubscription ? '수정' : '추가'}
                </S.SubmitButton>
                <S.CancelButton type="button" onClick={() => setIsModalOpen(false)}>
                  취소
                </S.CancelButton>
              </S.ButtonRow>
            </form>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </S.PageContainer>
  );
}

export default SubscriptionPage;
