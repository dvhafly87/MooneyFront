// src/pages/SubscriptionPage.jsx
// 카테고리는 조회만 하고 관리는 가계부 페이지에서만 진행

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
import BACK_SUBSCRIPTION_API, { subscriptionUtils } from '../services/back/subscriptionApi.js';

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
    mexpDec: '',
    mexpAmt: '',
    mexpRptdd: '',
    mcatId: '',
  });
  const [categories, setCategories] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();

  // 현재 사용자 ID 가져오기
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

  // 구독 데이터 가져오기
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      console.log('🔍 구독 데이터 가져오기 시작...');

      const response = await BACK_SUBSCRIPTION_API.getSubscriptions();
      console.log('✅ 구독 데이터 가져오기 성공:', response.data);

      setAllExpenses(response.data);
    } catch (error) {
      showError('구독 데이터를 불러오는데 실패했습니다.');
      console.error('Fetch subscriptions error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 데이터 가져오기 (조회만)
  const fetchCategories = async () => {
    try {
      console.log('📂 카테고리 데이터 가져오기 시작...');

      const response = await BACK_SUBSCRIPTION_API.getCategories();
      console.log('✅ 카테고리 데이터 가져오기 성공:', response.data);

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

  // 지출해야 할 것 필터링
  const getPendingPayments = () => {
    return subscriptionUtils.getPendingPayments(allExpenses);
  };

  // 3일 내 지출 예정 필터링
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

  // 필터링된 지출 예정 데이터
  const getFilteredPendingPayments = () => {
    switch (filterWay) {
      case filterStyle.THREE_DAYS:
        return getThreeDaysPendingPayments();
      case filterStyle.ALL:
      default:
        return getPendingPayments();
    }
  };

  // 지출 완료된 것 필터링
  const getCompletedPayments = () => {
    const currentUserId = getCurrentUserId();
    return subscriptionUtils.getCompletedPayments(allExpenses, currentUserId);
  };

  // 정렬 함수
  const getSortedPendingPayments = () => {
    const filteredPayments = getFilteredPendingPayments();

    // OVERDUE와 PENDING 분리
    const overduePayments = filteredPayments.filter((expense) => expense.mexpStatus === 'OVERDUE');
    const pendingPayments = filteredPayments.filter((expense) => expense.mexpStatus === 'PENDING');

    // OVERDUE는 예정일이 오래된 순으로 정렬
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

  // 카테고리별 지출 차트 데이터
  const getChartData = () => {
    const completedPayments = getCompletedPayments();
    return subscriptionUtils.getChartData(completedPayments);
  };

  // 지출 완료 처리
  const handleCompletePayment = async (expense) => {
    try {
      console.log('💳 결제 완료 처리 시작:', expense.mexpId);

      const response = await BACK_SUBSCRIPTION_API.completePayment(expense.mexpId);

      // 서버에서 데이터 다시 가져오기
      await fetchSubscriptions();

      showSuccess(response.message || '결제가 완료되었습니다!');
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
        response = await BACK_SUBSCRIPTION_API.updateSubscription(
          editingSubscription.mexpId,
          formData,
        );
      } else {
        // 추가 모드
        response = await BACK_SUBSCRIPTION_API.addSubscription(formData);
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
      mcatId: expense.mcatId ? expense.mcatId.toString() : '',
    });
    setIsModalOpen(true);
    showInfo(`${expense.mexpDec} 구독을 수정합니다.`);
  };

  // 구독 삭제
  const handleDeleteSubscription = async (mexpId) => {
    const expense = allExpenses.find((item) => item.mexpId === mexpId);

    if (window.confirm(`'${expense?.mexpDec}' 구독을 정말로 삭제하시겠습니까?`)) {
      try {
        const response = await BACK_SUBSCRIPTION_API.deleteSubscription(mexpId);

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

  // 정렬 방식 변경
  const handleSortChange = (newSortType) => {
    setAlignWay(newSortType);

    const sortMessages = {
      [alignStyle.LATEST]: '결제 예정일순으로 정렬되었습니다 📅',
      [alignStyle.HIGHEST]: '높은 금액순으로 정렬되었습니다 💰',
      [alignStyle.NAMING]: '이름순으로 정렬되었습니다 🔤',
    };

    showInfo(sortMessages[newSortType]);
  };

  // 필터 방식 변경
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
  }, [loading, allExpenses]);

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

            <div
              style={{ width: '1px', height: '24px', backgroundColor: '#e0e0e0', margin: '0 8px' }}
            />

            <S.SortButton
              $isActive={filterWay === filterStyle.ALL}
              onClick={() => handleFilterChange(filterStyle.ALL)}
            >
              📋 전체
            </S.SortButton>
            <S.SortButton
              $isActive={filterWay === filterStyle.THREE_DAYS}
              onClick={() => handleFilterChange(filterStyle.THREE_DAYS)}
            >
              ⚡ 3일 내
            </S.SortButton>
          </S.SortButtonContainer>

          {/* 지출해야 할 것 */}
          <S.SubscriptionListContainer>
            <h3>
              💰 지출해야 할 것{filterWay === filterStyle.THREE_DAYS ? '(3 DAYS)' : '(전체)'}
              <span
                style={{ marginLeft: '8px', fontSize: '14px', color: '#666', fontWeight: 'normal' }}
              >
                {getSortedPendingPayments().length}개
              </span>
            </h3>
            <S.SubscriptionList>
              {getSortedPendingPayments().map((expense) => {
                const dueStatus = subscriptionUtils.getDueStatus(expense);
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

              {getSortedPendingPayments().length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    color: '#666',
                    padding: '40px 20px',
                    fontSize: '14px',
                  }}
                >
                  {filterWay === filterStyle.THREE_DAYS
                    ? '3일 내 지출 예정인 구독이 없습니다.'
                    : '지출 예정인 구독이 없습니다.'}
                </div>
              )}
            </S.SubscriptionList>
          </S.SubscriptionListContainer>

          {/* 지출 완료 */}
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
                <S.Label>구독 서비스 설명</S.Label>
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
                <S.Label>카테고리</S.Label>
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
                {categories.length === 0 && (
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    💡 카테고리가 없습니다. 가계부 페이지에서 카테고리를 먼저 추가해주세요.
                  </div>
                )}
              </S.FormGroup>

              <S.FormGroup>
                <S.Label>월 구독료 (원)</S.Label>
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
                <S.Label>지출 예정일</S.Label>
                <S.Input
                  type="date"
                  name="mexpRptdd"
                  value={formData.mexpRptdd}
                  onChange={handleFormChange}
                  required
                />
              </S.FormGroup>

              <S.ButtonRow>
                <S.SubmitButton type="submit" disabled={categories.length === 0}>
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
