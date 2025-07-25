// src/services/mock/mockChallenge.js
import MOCKDATA from '../../assets/mockData.js';

/**
 * 로그인한 사용자 정보 가져오기 (mockUser.js와 동일한 방식)
 */
const getCurrentUser = () => {
  try {
    // sessionStorage의 mockSession에서 userId 가져오기
    const mockSession = sessionStorage.getItem('mockSession');
    if (mockSession) {
      const sessionData = JSON.parse(mockSession);
      return sessionData.userId;
    }

    // localStorage의 userData에서 가져오기 (fallback)
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      return user.mmemId || user.userId || user.id;
    }

    return 'user001'; // 기본값
  } catch (error) {
    console.error('사용자 정보를 불러올 수 없습니다:', error);
    return 'user001';
  }
};

/**
 * 모든 챌린지 데이터 가져오기
 * @param {string} userId - 사용자 ID (선택사항)
 * @returns {Promise<Array>} - 사용자의 모든 챌린지 데이터
 */
const getAllChallenges = async (userId = null) => {
  await new Promise((resolve) => setTimeout(resolve, 300)); // API 지연 시뮬레이션

  const currentUserId = userId || getCurrentUser();

  const userChallenges = MOCKDATA.mockChallengeData
    .filter((challenge) => challenge.mchlMmemId === currentUserId)
    .map((challenge) => ({
      id: challenge.mchlId,
      title: challenge.mchlName,
      startDate: challenge.mchlStartDate.toISOString().split('T')[0], // YYYY-MM-DD 형식
      endDate: challenge.mchlEndDate.toISOString().split('T')[0],
      targetAmount: challenge.mchlTargetAmount,
      reward: challenge.mchlReward,
      contents: challenge.mchlContents,
    }));

  return {
    success: true,
    data: userChallenges,
  };
};

/**
 * 새로운 챌린지 생성
 * @param {Object} challengeData - 챌린지 데이터
 * @returns {Promise<Object>} - 생성 결과
 */
const createChallenge = async (challengeData) => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // API 지연 시뮬레이션

  const currentUserId = getCurrentUser();

  // 새로운 챌린지 ID 생성 (기존 최대 ID + 1)
  const maxId = Math.max(...MOCKDATA.mockChallengeData.map((c) => c.mchlId), 0);
  const newChallengeId = maxId + 1;

  // 새로운 챌린지 객체 생성
  const newChallenge = {
    mchlId: newChallengeId,
    mchlMmemId: currentUserId,
    mchlName: challengeData.title,
    mchlTargetAmount: parseInt(challengeData.targetAmount),
    mchlStartDate: new Date(challengeData.startDate),
    mchlEndDate: new Date(challengeData.endDate),
    mchlReward: parseInt(challengeData.reward) || 0,
    mchlContents: challengeData.contents || '',
  };

  // mockData에 추가 (실제로는 메모리에만 저장됨)
  MOCKDATA.mockChallengeData.push(newChallenge);

  return {
    success: true,
    message: '챌린지가 성공적으로 생성되었습니다.',
    data: {
      id: newChallengeId,
      title: newChallenge.mchlName,
      startDate: newChallenge.mchlStartDate.toISOString().split('T')[0],
      endDate: newChallenge.mchlEndDate.toISOString().split('T')[0],
      targetAmount: newChallenge.mchlTargetAmount,
      reward: newChallenge.mchlReward,
      contents: newChallenge.mchlContents,
    },
  };
};

/**
 * 챌린지 수정
 * @param {number} challengeId - 수정할 챌린지 ID
 * @param {Object} challengeData - 수정할 챌린지 데이터
 * @param {string} userId - 사용자 ID (선택사항)
 * @returns {Promise<Object>} - 수정 결과
 */
const updateChallenge = async (challengeId, challengeData, userId = null) => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // API 지연 시뮬레이션

  try {
    const currentUserId = userId || getCurrentUser();

    // 폼 유효성 검사
    if (!challengeData.title?.trim()) {
      throw new Error('챌린지 이름을 입력해주세요.');
    }

    if (!challengeData.startDate) {
      throw new Error('시작 날짜를 선택해주세요.');
    }

    if (!challengeData.endDate) {
      throw new Error('종료 날짜를 선택해주세요.');
    }

    if (!challengeData.targetAmount || parseInt(challengeData.targetAmount) <= 0) {
      throw new Error('올바른 목표 금액을 입력해주세요.');
    }

    if (challengeData.reward && (challengeData.reward < 10 || challengeData.reward > 200)) {
      throw new Error('보상 포인트는 최소 10포인트, 최대 200포인트입니다.');
    }

    const challengeIndex = MOCKDATA.mockChallengeData.findIndex(
      (challenge) => challenge.mchlId === challengeId && challenge.mchlMmemId === currentUserId,
    );

    if (challengeIndex === -1) {
      throw new Error('수정할 챌린지를 찾을 수 없습니다.');
    }

    // 기존 데이터 업데이트
    const updatedChallenge = {
      ...MOCKDATA.mockChallengeData[challengeIndex],
      mchlName: challengeData.title,
      mchlTargetAmount: parseInt(challengeData.targetAmount),
      mchlStartDate: new Date(challengeData.startDate),
      mchlEndDate: new Date(challengeData.endDate),
      mchlReward: parseInt(challengeData.reward) || 0,
      mchlContents: challengeData.contents || '',
    };

    MOCKDATA.mockChallengeData[challengeIndex] = updatedChallenge;

    return {
      success: true,
      message: `${challengeData.title} 챌린지가 성공적으로 수정되었습니다!`,
      data: {
        id: updatedChallenge.mchlId,
        title: updatedChallenge.mchlName,
        startDate: updatedChallenge.mchlStartDate.toISOString().split('T')[0],
        endDate: updatedChallenge.mchlEndDate.toISOString().split('T')[0],
        targetAmount: updatedChallenge.mchlTargetAmount,
        reward: updatedChallenge.mchlReward,
        contents: updatedChallenge.mchlContents,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * 특정 기간의 소비 내역 계산
 * @param {string} startDate - 시작 날짜 (YYYY-MM-DD)
 * @param {string} endDate - 종료 날짜 (YYYY-MM-DD, 선택사항)
 * @param {string} userId - 사용자 ID (선택사항)
 * @returns {Promise<Object>} - 해당 기간의 총 소비 금액
 */
const getExpenseAmount = async (startDate, endDate = null, userId = null) => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const currentUserId = userId || getCurrentUser();
  const today = new Date();
  const challengeStartDate = new Date(startDate);

  // 시작일이 미래인 경우
  if (challengeStartDate > today) {
    return {
      success: true,
      data: { amount: 0 },
    };
  }

  const challengeEndDate = endDate ? new Date(endDate) : today;
  const calculationEndDate = challengeEndDate < today ? challengeEndDate : today;

  // 해당 기간의 지출 데이터 필터링
  const periodExpenses = MOCKDATA.mockExpenseData.filter((expense) => {
    if (
      !expense.mexpDt ||
      expense.mexpMmemId !== currentUserId ||
      expense.mexpStatus !== 'COMPLETED' ||
      expense.mexpType !== 'E' // 지출만
    ) {
      return false;
    }

    const expenseDate = new Date(expense.mexpDt);
    return expenseDate >= challengeStartDate && expenseDate <= calculationEndDate;
  });

  const totalAmount = periodExpenses.reduce((total, expense) => total + expense.mexpAmt, 0);

  return {
    success: true,
    data: { amount: totalAmount },
  };
};

/**
 * 챌린지 삭제
 * @param {number} challengeId - 삭제할 챌린지 ID
 * @param {string} userId - 사용자 ID (선택사항)
 * @returns {Promise<Object>} - 삭제 결과
 */
const deleteChallenge = async (challengeId, userId = null) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    const currentUserId = userId || getCurrentUser();

    const challengeIndex = MOCKDATA.mockChallengeData.findIndex(
      (challenge) => challenge.mchlId === challengeId && challenge.mchlMmemId === currentUserId,
    );

    if (challengeIndex === -1) {
      return {
        success: false,
        message: '삭제할 챌린지를 찾을 수 없습니다.',
      };
    }

    const deletedChallenge = MOCKDATA.mockChallengeData[challengeIndex];

    // mockData에서 제거
    MOCKDATA.mockChallengeData.splice(challengeIndex, 1);

    return {
      success: true,
      message: `${deletedChallenge.mchlName} 챌린지가 삭제되었습니다.`,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || '챌린지 삭제 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 특정 챌린지 조회
 * @param {number} challengeId - 챌린지 ID
 * @param {string} userId - 사용자 ID (선택사항)
 * @returns {Promise<Object>} - 챌린지 데이터
 */
const getChallengeById = async (challengeId, userId = null) => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const currentUserId = userId || getCurrentUser();

  const challenge = MOCKDATA.mockChallengeData.find(
    (c) => c.mchlId === challengeId && c.mchlMmemId === currentUserId,
  );

  if (!challenge) {
    return {
      success: false,
      message: '챌린지를 찾을 수 없습니다.',
    };
  }

  return {
    success: true,
    data: {
      id: challenge.mchlId,
      title: challenge.mchlName,
      startDate: challenge.mchlStartDate.toISOString().split('T')[0],
      endDate: challenge.mchlEndDate.toISOString().split('T')[0],
      targetAmount: challenge.mchlTargetAmount,
      reward: challenge.mchlReward,
      contents: challenge.mchlContents,
    },
  };
};

/**
 * 사용자의 포인트 조회
 * @param {string} userId - 사용자 ID (선택사항)
 * @returns {Promise<Object>} - 포인트 데이터
 */
const getUserPoints = async (userId = null) => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const currentUserId = userId || getCurrentUser();

  const user = MOCKDATA.mockUserData.find((u) => u.mmemId === currentUserId);

  if (!user) {
    return {
      success: false,
      message: '사용자를 찾을 수 없습니다.',
    };
  }

  return {
    success: true,
    data: { points: user.mmemPnt },
  };
};

/**
 * 챌린지 성공률 계산
 * @param {string} userId - 사용자 ID (선택사항)
 * @returns {Promise<Object>} - 성공률 데이터
 */
const getChallengeSuccessRate = async (userId = null) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const currentUserId = userId || getCurrentUser();
  const today = new Date();

  // 완료된 챌린지들만 필터링 (종료일이 오늘보다 이전)
  const completedChallenges = MOCKDATA.mockChallengeData.filter(
    (challenge) =>
      challenge.mchlMmemId === currentUserId && new Date(challenge.mchlEndDate) < today,
  );

  if (completedChallenges.length === 0) {
    return {
      success: true,
      data: { successRate: 0, totalChallenges: 0, successfulChallenges: 0 },
    };
  }

  // 각 챌린지의 성공/실패 여부를 계산해야 하지만,
  // 간단하게 하기 위해 Mock에서는 랜덤하게 성공률을 생성
  // 실제로는 각 챌린지별로 소비 금액을 계산해서 판단해야 함
  const successfulChallenges = Math.floor(completedChallenges.length * 0.7); // 70% 성공률로 가정
  const successRate = Math.round((successfulChallenges / completedChallenges.length) * 100);

  return {
    success: true,
    data: {
      successRate,
      totalChallenges: completedChallenges.length,
      successfulChallenges,
    },
  };
};

// Export API 객체
const MOCK_CHALLENGE_API = {
  getAllChallenges,
  createChallenge,
  updateChallenge, // 🔥 새로 추가
  getExpenseAmount,
  deleteChallenge,
  getChallengeById,
  getUserPoints,
  getChallengeSuccessRate,
};

export default MOCK_CHALLENGE_API;
