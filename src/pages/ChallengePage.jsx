import { useState, useMemo, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const challengeStatus = {
  SUCCESS: '성공',
  FAIL: '실패',
  ONGOING: '진행중',
  PENDING: '시작 대기중',
};

function ChallengePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formCurrentAmount, setFormCurrentAmount] = useState(0);

  // 챌린지 추가 모달 initial Data
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    targetAmount: '',
    reward: '',
    contents: '',
  });

  // Mock 소비 데이터 (백엔드 MOONEY_EXPENSE 테이블에서 가져올 데이터)
  const mockExpenseData = useMemo(
    () => [
      { date: '2025-01-01', amount: 50000 },
      { date: '2025-01-02', amount: 30000 },
      { date: '2025-01-03', amount: 20000 },
      { date: '2025-01-04', amount: 45000 },
      { date: '2025-01-05', amount: 25000 },
      { date: '2025-01-06', amount: 35000 },
      { date: '2025-01-07', amount: 40000 },
      { date: '2025-01-08', amount: 55000 },
      { date: '2025-01-09', amount: 30000 },
      { date: '2025-01-10', amount: 70000 },
      { date: '2024-11-13', amount: 111111 },
      { date: '2024-12-12', amount: 500001 },
    ],
    [],
  );

  // 모든 챌린지 데이터 (실제로는 API에서 가져올 데이터)
  const [mockAllChallenges, setMockAllChallenges] = useState([
    {
      id: 1,
      title: '1월 절약 챌린지',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      targetAmount: 600000,
      reward: 100,
      contents: '1월 한 달 동안 60만원 이하로 소비하기',
    },
    {
      id: 2,
      title: '12월 절약 챌린지',
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      targetAmount: 500000,
      reward: 150,
      contents: '12월 연말 소비 줄이기',
    },
    {
      id: 3,
      title: '11월 절약 챌린지',
      startDate: '2024-11-01',
      endDate: '2024-11-30',
      targetAmount: 400000,
      reward: 100,
      contents: '11월 식비 절약하기',
    },
    {
      id: 4,
      title: '2월 절약 챌린지',
      startDate: '2025-02-01',
      endDate: '2025-02-28',
      targetAmount: 550000,
      reward: 120,
      contents: '2월 교통비 절약하기',
    },
    {
      id: 5,
      title: '9월 절약 챌린지',
      startDate: '2025-09-01',
      endDate: '2025-09-30',
      targetAmount: 500000,
      reward: 100,
      contents: '9월 쇼핑 절약하기',
    },
  ]);

  // startDate부터 현재(또는 endDate)까지의 지출 합계 계산
  const calculateCurrentAmount = useCallback(
    (startDate, endDate = null) => {
      const today = new Date();
      const challengeStartDate = new Date(startDate);

      // 시작일이 미래인 경우
      if (challengeStartDate > today) {
        return 0;
      }

      const challengeEndDate = endDate ? new Date(endDate) : today;
      const calculationEndDate = challengeEndDate < today ? challengeEndDate : today;

      return mockExpenseData
        .filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= challengeStartDate && expenseDate <= calculationEndDate;
        })
        .reduce((total, expense) => total + expense.amount, 0);
    },
    [mockExpenseData],
  );

  // 챌린지 상태 계산 함수
  const calculateChallengeStatus = useCallback((challenge, currentAmount) => {
    const today = new Date();
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);

    // 시작일이 미래인 경우
    if (startDate > today) {
      return challengeStatus.PENDING;
    }

    // 목표 금액 초과
    if (currentAmount > challenge.targetAmount) {
      return challengeStatus.FAIL;
    }

    // 챌린지 종료 + 목표 달성
    if (endDate <= today) {
      return challengeStatus.SUCCESS;
    }

    // 진행중
    return challengeStatus.ONGOING;
  }, []);

  // 기간 진행률 계산 함수
  const calculateTimeProgress = useCallback((startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= today) return 0;
    if (end <= today) return 100;

    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const passedDays = Math.ceil((today - start) / (1000 * 60 * 60 * 24));

    return Math.min((passedDays / totalDays) * 100, 100);
  }, []);

  // 남은 일수 계산 함수
  const calculateRemainingDays = useCallback((endDate) => {
    const today = new Date();
    const end = new Date(endDate);

    if (end <= today) return 0;
    return Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  }, []);

  // 모든 챌린지에 계산된 데이터 추가
  const challengesWithStatus = useMemo(() => {
    return mockAllChallenges.map((challenge) => {
      const currentAmount = calculateCurrentAmount(challenge.startDate, challenge.endDate);
      const status = calculateChallengeStatus(challenge, currentAmount);
      const gaugeBar =
        challenge.targetAmount > 0
          ? Math.min((currentAmount / challenge.targetAmount) * 100, 100)
          : 0;
      const timeProgress = calculateTimeProgress(challenge.startDate, challenge.endDate);
      const remainingDays = calculateRemainingDays(challenge.endDate);

      return {
        ...challenge,
        currentAmount,
        status,
        gaugeBar,
        timeProgress,
        remainingDays,
      };
    });
  }, [
    mockAllChallenges,
    calculateCurrentAmount,
    calculateChallengeStatus,
    calculateTimeProgress,
    calculateRemainingDays,
  ]);

  // 상태별로 챌린지 분류
  const { currentChallenge, previousChallenges, pendingChallenges } = useMemo(() => {
    const current = challengesWithStatus.find((c) => c.status === challengeStatus.ONGOING) || null;
    const previous = challengesWithStatus.filter(
      (c) => c.status === challengeStatus.SUCCESS || c.status === challengeStatus.FAIL,
    );
    const pending = challengesWithStatus.filter((c) => c.status === challengeStatus.PENDING);

    return {
      currentChallenge: current,
      previousChallenges: previous,
      pendingChallenges: pending,
    };
  }, [challengesWithStatus]);

  // 전체 챌린지 성공률 계산
  const successRate = useMemo(() => {
    if (previousChallenges.length === 0) return 0;

    const successCount = previousChallenges.filter(
      (challenge) => challenge.status === challengeStatus.SUCCESS,
    ).length;

    return Math.round((successCount / previousChallenges.length) * 100);
  }, [previousChallenges]);

  // 상태별 배경색 결정
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case challengeStatus.SUCCESS:
        return '#4CAF50';
      case challengeStatus.FAIL:
        return '#ff4444';
      case challengeStatus.ONGOING:
        return '#2196F3';
      case challengeStatus.PENDING:
        return '#FF9800';
      default:
        return '#666';
    }
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
    setFormCurrentAmount(0);
    setFormData({
      title: '',
      startDate: '',
      endDate: '',
      targetAmount: '',
      reward: '',
      contents: '',
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setFormCurrentAmount(0);
    setFormData({
      title: '',
      startDate: '',
      endDate: '',
      targetAmount: '',
      reward: '',
      contents: '',
    });
  }, []);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleStartDateChange = useCallback(
    (e) => {
      const selectedStartDate = e.target.value;
      handleFormChange(e);
      const calculatedAmount = calculateCurrentAmount(selectedStartDate);
      setFormCurrentAmount(calculatedAmount);
    },
    [handleFormChange, calculateCurrentAmount],
  );

  const validateForm = useCallback((formData) => {
    const { title, startDate, endDate, targetAmount, reward } = formData;

    if (!title.trim()) {
      toast.error('챌린지 이름을 입력해주세요.');
      return false;
    }

    if (!startDate) {
      toast.error('시작 날짜를 선택해주세요.');
      return false;
    }

    if (!endDate) {
      toast.error('종료 날짜를 선택해주세요.');
      return false;
    }

    if (!targetAmount || parseInt(targetAmount) <= 0) {
      toast.error('목표 금액을 올바르게 입력해주세요.');
      return false;
    }

    if (!(reward >= 10 && reward <= 200)) {
      toast.error('보상 포인트는 최소 10포인트, 최대 200포인트입니다.');
      return false;
    }
    // const start = new Date(startDate);
    // const end = new Date(endDate);

    // if (end <= start) {
    //   toast.error('종료 날짜는 시작 날짜보다 늦어야 합니다.');
    //   return false;
    // }

    return true;
  }, []);

  const handleCreateChallenge = useCallback(
    (e) => {
      e.preventDefault();

      if (!validateForm(formData)) {
        return;
      }

      const newChallenge = {
        id: Date.now(),
        title: formData.title,
        startDate: formData.startDate,
        endDate: formData.endDate,
        targetAmount: parseInt(formData.targetAmount),
        reward: parseInt(formData.reward) || 0,
        contents: formData.contents || '',
      };

      setMockAllChallenges((prev) => [...prev, newChallenge]);
      toast.success('챌린지가 성공적으로 생성되었습니다!');
      handleCloseModal();
    },
    [formData, validateForm, handleCloseModal],
  );

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '20px',
          width: '100%',
          height: '100%',
          padding: '20px',
        }}
      >
        {/* 왼쪽 */}
        <div style={{ width: '100%' }}>
          {/* 현재 진행중인 챌린지 카드 */}
          {currentChallenge ? (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '25px',
                marginBottom: '20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            >
              <h2 style={{ margin: '0 0 15px 0' }}>나의 챌린지</h2>
              <div
                style={{
                  backgroundColor: '#4A90E2',
                  color: 'white',
                  padding: '15px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                }}
              >
                <h3 style={{ margin: '0 0 5px 0' }}>{currentChallenge.title}</h3>
                <span>
                  {currentChallenge.startDate} ~ {currentChallenge.endDate}
                </span>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    목표 지출: {currentChallenge.targetAmount.toLocaleString()}원
                  </span>
                </div>

                {/* 기간 진행률 게이지바 */}
                <div style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                      기간 진행률
                    </span>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {currentChallenge.remainingDays > 0
                        ? `${currentChallenge.remainingDays}일 남음`
                        : '종료됨'}
                    </span>
                  </div>
                  <div
                    style={{
                      backgroundColor: '#f0f0f0',
                      height: '8px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '5px',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#9C27B0',
                        height: '100%',
                        width: `${currentChallenge.timeProgress}%`,
                        transition: 'width 1s ease',
                      }}
                    ></div>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#666',
                      textAlign: 'center',
                    }}
                  >
                    {Math.round(currentChallenge.timeProgress)}% 진행
                  </div>
                </div>

                {/* 지출 진행률 게이지바 */}
                <div style={{ marginBottom: '15px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                      지출 진행률
                    </span>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {Math.round(currentChallenge.gaugeBar)}%
                    </span>
                  </div>
                  <div
                    style={{
                      backgroundColor: '#e0e0e0',
                      height: '10px',
                      borderRadius: '5px',
                      overflow: 'hidden',
                      marginBottom: '5px',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: getStatusColor(currentChallenge.status),
                        height: '100%',
                        width: `${currentChallenge.gaugeBar}%`,
                        transition: 'width 1s ease',
                      }}
                    ></div>
                  </div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <span>현재 지출: {currentChallenge.currentAmount.toLocaleString()}원</span>
                </div>

                <div
                  style={{
                    color:
                      currentChallenge.targetAmount - currentChallenge.currentAmount >= 0
                        ? '#4CAF50'
                        : '#ff4444',
                    fontWeight: 'bold',
                  }}
                >
                  목표까지 남은 지출:{' '}
                  {(
                    currentChallenge.targetAmount - currentChallenge.currentAmount
                  ).toLocaleString()}
                  원
                </div>

                {currentChallenge.status !== challengeStatus.ONGOING && (
                  <div
                    style={{
                      marginTop: '10px',
                      padding: '5px 10px',
                      backgroundColor: getStatusColor(currentChallenge.status),
                      color: 'white',
                      borderRadius: '5px',
                      display: 'inline-block',
                    }}
                  >
                    {currentChallenge.status}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '25px',
                marginBottom: '20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                textAlign: 'center',
                color: '#666',
              }}
            >
              <h2 style={{ margin: '0 0 15px 0' }}>나의 챌린지</h2>
              <p>현재 진행중인 챌린지가 없습니다.</p>
              <p>새로운 챌린지를 만들어보세요!</p>
            </div>
          )}

          {/* 이전 진행 챌린지 */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ margin: '0 0 20px 0' }}>지금까지 진행한 챌린지</h3>
            {previousChallenges.length > 0 ? (
              previousChallenges.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '15px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    marginBottom: '15px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <h4 style={{ margin: '0', fontSize: '16px' }}>{item.title}</h4>
                    <span
                      style={{
                        backgroundColor: getStatusColor(item.status),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                    {item.startDate} ~ {item.endDate}
                  </p>
                  <div
                    style={{
                      backgroundColor: '#e0e0e0',
                      height: '6px',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: getStatusColor(item.status),
                        height: '100%',
                        width: `${Math.min(item.gaugeBar, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    사용 금액: {item.currentAmount.toLocaleString()} /{' '}
                    {item.targetAmount.toLocaleString()}원 ({Math.round(item.gaugeBar)}%)
                  </div>
                </div>
              ))
            ) : (
              <p style={{ margin: '0', color: '#666' }}>완료된 챌린지가 없습니다.</p>
            )}
          </div>
        </div>

        {/* 오른쪽 */}
        <div style={{ width: '100%' }}>
          <button
            onClick={handleOpenModal}
            style={{
              width: '100%',
              backgroundColor: '#4A90E2',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '15px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '20px',
            }}
          >
            + Challenge 추가
          </button>

          <div
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              borderRadius: '15px',
              padding: '25px',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            <p style={{ margin: '0 0 10px 0' }}>챌린지 성공률</p>
            <h2 style={{ margin: '0', fontSize: '36px' }}>{successRate}%</h2>
          </div>

          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '25px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              marginBottom: '20px',
            }}
          >
            <p style={{ margin: '0 0 10px 0', color: '#666' }}>현재 보유중인 포인트</p>
            <h3 style={{ margin: '0', fontSize: '24px' }}>1,250 P</h3>
          </div>

          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>시작 대기 중인 챌린지</h3>
            {pendingChallenges.length > 0 ? (
              pendingChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  style={{
                    padding: '12px',
                    border: '2px solid #FF9800',
                    borderRadius: '6px',
                    marginBottom: '10px',
                    backgroundColor: '#FFF3E0',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '5px',
                    }}
                  >
                    <h4 style={{ margin: '0', fontSize: '14px' }}>{challenge.title}</h4>
                    <span
                      style={{
                        backgroundColor: '#FF9800',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '10px',
                      }}
                    >
                      {challenge.status}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>
                    {challenge.startDate} ~ {challenge.endDate}
                  </p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                    목표: {challenge.targetAmount.toLocaleString()}원
                  </p>
                </div>
              ))
            ) : (
              <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                대기 중인 챌린지가 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 모달창 */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '30px',
              width: '450px',
              maxWidth: '90vw',
            }}
          >
            <h2 style={{ margin: '0 0 20px 0' }}>Challenge 추가</h2>
            <form onSubmit={handleCreateChallenge}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  챌린지 이름
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label
                    htmlFor="startDate"
                    style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
                  >
                    시작 날짜
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleStartDateChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    htmlFor="endDate"
                    style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
                  >
                    종료 날짜
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={formData.endDate}
                    onChange={handleFormChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  목표 금액 (원)
                </label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  보상 포인트
                </label>
                <input
                  type="number"
                  name="reward"
                  value={formData.reward}
                  onChange={handleFormChange}
                  placeholder="선택사항"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  챌린지 설명
                </label>
                <textarea
                  name="contents"
                  value={formData.contents}
                  onChange={handleFormChange}
                  placeholder="선택사항"
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  현재 소비 금액
                </label>
                <p
                  style={{
                    margin: '0',
                    padding: '10px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '5px',
                    color: '#666',
                  }}
                >
                  {formCurrentAmount.toLocaleString()}원
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#4A90E2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  생성
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#f0f0f0',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ToastContainer */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default ChallengePage;
