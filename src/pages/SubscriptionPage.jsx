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
import apiService from '../services/apiService';

const alignStyle = {
  LATEST: 'latest',
  HIGHEST: 'highest',
  NAMING: 'naming',
};

const filterStyle = {
  ALL: 'all',
  THREE_DAYS: 'three_days',
};

function SubscriptionPage() {
  const [alignWay, setAlignWay] = useState(alignStyle.LATEST);
  const [filterWay, setFilterWay] = useState(filterStyle.ALL);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [formData, setFormData] = useState({
    mexpDec: '', // 구독 서비스 설명
    mexpAmt: '', // 금액
    mexpRptdd: '', // 지출해야 할 날짜 (예정일)
    mcatId: '', // 카테고리 ID
  });
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();

  // 구독 데이터 가져오기
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await apiService.SUBSCRIPTION.getSubscriptions();
      setExpenses(response.data);
    } catch (error) {
      showError('구독 데이터를 불러오는데 실패했습니다.');
      console.error('Fetch subscriptions error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 데이터 가져오기
  const fetchCategories = async () => {
    try {
      const response = await apiService.SUBSCRIPTION.getCategories();
      setCategories(response.data);
    } catch (error) {
      showError('카테고리 데이터를 불러오는데 실패했습니다.');
      console.error('Fetch categories error:', error);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchSubscriptions(), fetchCategories()]);
    };
    loadInitialData();
  }, []);

  // 지출해야 할 것 필터링 (MEXP_STATUS = 'PENDING' or 'OVERDUE', MEXP_RPT = 'T')
  const getPendingPayments = () => {
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
  };

  // 3일 내 지출 예정 필터링 (3일 전부터 오늘까지)
  const getThreeDaysPendingPayments = () => {
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return getPendingPayments().filter((expense) => {
      const dueDate = new Date(expense.mexpRptdd);

      // OVERDUE는 항상 포함
      if (expense.mexpStatus === 'OVERDUE') {
        return true;
      }

      // PENDING: 3일 전부터 3일 후까지
      return dueDate >= threeDaysAgo && dueDate <= threeDaysFromNow;
    });
  };

  // 필터링된 지출 예정 데이터 가져오기
  const getFilteredPendingPayments = () => {
    switch (filterWay) {
      case filterStyle.THREE_DAYS:
        return getThreeDaysPendingPayments();
      case filterStyle.ALL:
      default:
        return getPendingPayments();
    }
  };

  // 지출한 것 필터링 (MEXP_STATUS = 'COMPLETED', MEXP_RPT = 'T', 최근 일주일)
  const getCompletedPayments = () => {
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return expenses.filter((expense) => {
      // 현재 로그인한 유저의 데이터만 (user001로 하드코딩되어 있음)
      if (expense.mexpMmemId !== 'user001') return false;

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

  // 정렬 함수 (OVERDUE 항상 최상단)
  const getSortedPendingPayments = () => {
    const filteredPayments = getFilteredPendingPayments();

    // OVERDUE와 PENDING 분리
    const overduePayments = filteredPayments.filter((expense) => expense.mexpStatus === 'OVERDUE');
    const pendingPayments = filteredPayments.filter((expense) => expense.mexpStatus === 'PENDING');

    // OVERDUE는 예정일이 오래된 순으로 정렬 (가장 늦은 것부터)
    const sortedOverdue = overduePayments.sort(
      (a, b) => new Date(a.mexpRptdd) - new Date(b.mexpRptdd),
    );

    // PENDING은 선택된 정렬 방식에 따라 정렬
    let sortedPending = [];
    switch (alignWay) {
      case alignStyle.HIGHEST:
        sortedPending = pendingPayments.sort((a, b) => b.mexpAmt - a.mexpAmt);
        break;
      case alignStyle.NAMING:
        sortedPending = pendingPayments.sort((a, b) => a.mexpDec.localeCompare(b.mexpDec));
        break;
      case alignStyle.LATEST:
      default:
        sortedPending = pendingPayments.sort(
          (a, b) => new Date(a.mexpRptdd) - new Date(b.mexpRptdd),
        );
        break;
    }

    // OVERDUE를 항상 맨 위에, 그 다음 PENDING
    return [...sortedOverdue, ...sortedPending];
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
  const handleCompletePayment = async (expense) => {
    try {
      const response = await apiService.SUBSCRIPTION.completePayment(expense.mexpId);

      // 로컬 상태 업데이트 대신 서버에서 데이터 다시 가져오기
      await fetchSubscriptions();

      showSuccess(response.message);
    } catch (error) {
      showError(error.message || '결제 처리 중 오류가 발생했습니다.');
      console.error('Payment completion error:', error);
    }
  };

  // 폼 변경 핸들러
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 구독 추가/수정 처리
  const handleAddOrUpdateSubscription = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (editingSubscription) {
        // 수정 모드
        response = await apiService.SUBSCRIPTION.updateSubscription(
          editingSubscription.mexpId,
          formData,
        );
      } else {
        // 추가 모드
        response = await apiService.SUBSCRIPTION.addSubscription(formData);
      }

      // 서버에서 최신 데이터 가져오기
      await fetchSubscriptions();

      // 폼 초기화 및 모달 닫기
      setIsModalOpen(false);
      setEditingSubscription(null);
      setFormData({
        mexpDec: '',
        mexpAmt: '',
        mexpRptdd: '',
        mcatId: '',
      });

      showSuccess(response.message);
    } catch (error) {
      showError(error.message || '구독 처리 중 오류가 발생했습니다.');
      console.error('Subscription error:', error);
    }
  };

  // 구독 수정 모드 시작
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

  // 구독 삭제
  const handleDeleteSubscription = async (mexpId) => {
    const expense = expenses.find((item) => item.mexpId === mexpId);

    if (window.confirm(`'${expense?.mexpDec}' 구독을 정말로 삭제하시겠습니까?`)) {
      try {
        const response = await apiService.SUBSCRIPTION.deleteSubscription(mexpId);

        // 서버에서 최신 데이터 가져오기
        await fetchSubscriptions();

        showSuccess(response.message);
      } catch (error) {
        showError(error.message || '구독 삭제 중 오류가 발생했습니다.');
        console.error('Delete error:', error);
      }
    }
  };

  // 구독 추가 모달 열기
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

  // 필터 방식 변경 핸들러
  const handleFilterChange = (newFilterType) => {
    setFilterWay(newFilterType);

    const filterMessages = {
      [filterStyle.ALL]: '전체 지출 예정 구독을 표시합니다 📋',
      [filterStyle.THREE_DAYS]: '3일 내 지출 예정 구독만 표시합니다 ⚡',
    };

    showInfo(filterMessages[newFilterType]);
  };

  // 연체 알림
  useEffect(() => {
    if (loading) return;

    const overdueCount = getOverdueCount();
    if (overdueCount > 0) {
      setTimeout(() => {
        showWarning(`${overdueCount}개의 구독료가 연체되었습니다! 확인해주세요. ⚠️`);
      }, 1000);
    }
  }, [loading, expenses]);

  if (loading) {
    return (
      <S.PageContainer>
        <div style={{ textAlign: 'center', padding: '100px', color: '#666' }}>
          구독 데이터를 불러오는 중...
        </div>
      </S.PageContainer>
    );
  }

  return (
    <S.PageContainer>
      {/* 헤더 */}
      <S.Header>
        <h1>구독 관리</h1>
        <p>정기 구독 서비스를 관리하고 지출을 추적하세요</p>
      </S.Header>

      <S.GridContainer>
        {/* 왼쪽: 구독 리스트 */}
        <S.LeftColumn>
          {/* 정렬 및 필터 버튼들 */}
          <S.SortButtonContainer>
            {/* 정렬 버튼들 */}
            <S.SortButton
              $isActive={alignWay === alignStyle.LATEST}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('버튼 클릭됨: LATEST');
                handleSortChange(alignStyle.LATEST);
              }}
              style={{
                pointerEvents: 'auto',
                zIndex: 10,
                position: 'relative',
              }}
            >
              <FaClock size={12} />
              결제예정일순
            </S.SortButton>
            <S.SortButton
              $isActive={alignWay === alignStyle.HIGHEST}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('버튼 클릭됨: HIGHEST');
                handleSortChange(alignStyle.HIGHEST);
              }}
              style={{
                pointerEvents: 'auto',
                zIndex: 10,
                position: 'relative',
              }}
            >
              <FaSortAmountDown size={12} />
              높은 금액순
            </S.SortButton>
            <S.SortButton
              $isActive={alignWay === alignStyle.NAMING}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('버튼 클릭됨: NAMING');
                handleSortChange(alignStyle.NAMING);
              }}
              style={{
                pointerEvents: 'auto',
                zIndex: 10,
                position: 'relative',
              }}
            >
              <FaSortAlphaDown size={12} />
              이름순
            </S.SortButton>

            {/* 구분선 */}
            <div
              style={{
                width: '1px',
                height: '24px',
                backgroundColor: '#e0e0e0',
                margin: '0 8px',
              }}
            ></div>

            {/* 필터 버튼들 */}
            <S.SortButton
              $isActive={filterWay === filterStyle.ALL}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('필터 클릭됨: ALL');
                handleFilterChange(filterStyle.ALL);
              }}
              style={{
                backgroundColor: filterWay === filterStyle.ALL ? '#e3f2fd' : 'white',
                pointerEvents: 'auto',
                zIndex: 10,
                position: 'relative',
              }}
            >
              📋 전체
            </S.SortButton>
            <S.SortButton
              $isActive={filterWay === filterStyle.THREE_DAYS}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('필터 클릭됨: THREE_DAYS');
                handleFilterChange(filterStyle.THREE_DAYS);
              }}
              style={{
                backgroundColor: filterWay === filterStyle.THREE_DAYS ? '#fff3e0' : 'white',
                color: filterWay === filterStyle.THREE_DAYS ? '#f57c00' : '#666',
                pointerEvents: 'auto',
                zIndex: 10,
                position: 'relative',
              }}
            >
              ⚡ 3일 내
            </S.SortButton>
          </S.SortButtonContainer>

          {/* 지출해야 할 것 */}
          <S.SubscriptionListContainer>
            <h3>
              💰 지출해야 할 것{filterWay === filterStyle.THREE_DAYS ? '(3 DAYS)' : '(전체)'}
              <span
                style={{
                  marginLeft: '8px',
                  fontSize: '14px',
                  color: '#666',
                  fontWeight: 'normal',
                }}
              >
                {getSortedPendingPayments().length}개
              </span>
            </h3>
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
                            {expense.categoryName} • 예정일:{' '}
                            {typeof expense.mexpRptdd === 'string'
                              ? expense.mexpRptdd
                              : expense.mexpRptdd.toISOString().split('T')[0]}
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
            <h3>✅ 지출 완료 (최근 3일)</h3>
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
                            {expense.categoryName} • 지출일:{' '}
                            {typeof expense.mexpDt === 'string'
                              ? expense.mexpDt
                              : expense.mexpDt.toISOString().split('T')[0]}
                          </p>
                          <p className="sub-info">
                            예정일:{' '}
                            {typeof expense.mexpRptdd === 'string'
                              ? expense.mexpRptdd
                              : expense.mexpRptdd.toISOString().split('T')[0]}
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

              {/* 지출 완료 데이터가 없을 때 */}
              {getCompletedPayments().length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    color: '#666',
                    padding: '40px 20px',
                    fontSize: '14px',
                  }}
                >
                  최근 3일간 지출 완료된 구독이 없습니다.
                </div>
              )}
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
            <h3>💸 최근 3일 지출</h3>
            <div className="total-amount">{getTotalCompletedAmount().toLocaleString()}원</div>
            <div className="breakdown">
              <div className="paid">완료: {getCompletedPayments().length}개</div>
            </div>
          </S.StatsCard>

          {/* 카테고리별 지출 차트 */}
          <S.ChartContainer>
            <h3>카테고리별 지출 (최근 3일)</h3>
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
                최근 3일간 지출 내역이 없습니다.
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
