/**
 * 응답 처리 헬퍼 함수
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

/**
 * 모든 챌린지 데이터 가져오기
 * 세션 쿠키를 통해 서버에서 자동으로 현재 사용자 식별
 * @returns {Promise<Object>} - 사용자의 모든 챌린지 데이터
 */
const getAllChallenges = async () => {
  try {
    // 세션 쿠키 방식: 서버에서 자동으로 현재 로그인된 사용자의 챌린지를 반환
    // 백엔드 컨트롤러에서 세션을 통해 memberId를 얻어서 처리해야 함
    const response = await fetch('/api/challenges/my', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 포함
    });

    // 204 No Content인 경우 (챌린지가 없는 경우)
    if (response.status === 204) {
      return {
        success: true,
        data: [],
      };
    }

    const challenges = await handleResponse(response);

    // 백엔드 응답을 프론트엔드 형식으로 변환
    const formattedChallenges = challenges.map((challenge) => ({
      id: challenge.mchlId,
      title: challenge.mchlName,
      startDate: challenge.mchlStartDate, // LocalDate는 YYYY-MM-DD 형식으로 전달됨
      endDate: challenge.mchlEndDate,
      targetAmount: challenge.mchlTargetAmount,
      reward: challenge.mchlReward,
      contents: challenge.mchlContents,
    }));

    return {
      success: true,
      data: formattedChallenges,
    };
  } catch (error) {
    console.error('챌린지 목록 조회 실패:', error);
    return {
      success: false,
      message: error.message || '챌린지 목록을 불러오는데 실패했습니다.',
      data: [],
    };
  }
};

/**
 * 새로운 챌린지 생성
 * 세션 쿠키를 통해 서버에서 자동으로 현재 사용자 식별
 * @param {Object} challengeData - 챌린지 데이터
 * @returns {Promise<Object>} - 생성 결과
 */
const createChallenge = async (challengeData) => {
  try {
    // 백엔드 형식에 맞게 데이터 변환
    const requestData = {
      mchlName: challengeData.title,
      mchlTargetAmount: parseInt(challengeData.targetAmount),
      mchlStartDate: challengeData.startDate, // YYYY-MM-DD 형식
      mchlEndDate: challengeData.endDate,
      mchlReward: parseInt(challengeData.reward) || 0,
      mchlContents: challengeData.contents || '',
    };

    // 세션 쿠키 방식: 서버에서 자동으로 현재 로그인된 사용자로 챌린지 생성
    const response = await fetch('/api/challenges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 포함
      body: JSON.stringify(requestData),
    });

    const createdChallenge = await handleResponse(response);

    return {
      success: true,
      message: '챌린지가 성공적으로 생성되었습니다.',
      data: {
        id: createdChallenge.mchlId,
        title: createdChallenge.mchlName,
        startDate: createdChallenge.mchlStartDate,
        endDate: createdChallenge.mchlEndDate,
        targetAmount: createdChallenge.mchlTargetAmount,
        reward: createdChallenge.mchlReward,
        contents: createdChallenge.mchlContents,
      },
    };
  } catch (error) {
    console.error('챌린지 생성 실패:', error);
    return {
      success: false,
      message: error.message || '챌린지 생성에 실패했습니다.',
    };
  }
};

/**
 * 특정 기간의 소비 내역 계산
 * 세션 쿠키를 통해 서버에서 자동으로 현재 사용자의 소비 내역 계산
 * @param {string} startDate - 시작 날짜 (YYYY-MM-DD)
 * @param {string} endDate - 종료 날짜 (YYYY-MM-DD, 선택사항)
 * @returns {Promise<Object>} - 해당 기간의 총 소비 금액
 */
const getExpenseAmount = async (startDate, endDate = null) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // 실제 종료 날짜 계산
    const actualEndDate = endDate || today;

    // 시작일이 미래인 경우
    if (new Date(startDate) > new Date(today)) {
      return {
        success: true,
        data: { amount: 0 },
      };
    }

    // TODO: 실제 Expense API 호출
    // 세션 쿠키를 통해 서버에서 자동으로 현재 사용자의 소비 내역 계산
    // const response = await fetch(`/api/expenses/sum?startDate=${startDate}&endDate=${actualEndDate}`, {
    //   method: 'GET',
    //   headers: { 'Content-Type': 'application/json' },
    //   credentials: 'include',
    // });

    // 임시로 Mock 데이터와 동일한 로직 사용
    const mockExpenseData = [
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
    ];

    const totalAmount = mockExpenseData
      .filter((expense) => {
        const expenseDate = expense.date;
        return expenseDate >= startDate && expenseDate <= actualEndDate;
      })
      .reduce((total, expense) => total + expense.amount, 0);

    return {
      success: true,
      data: { amount: totalAmount },
    };
  } catch (error) {
    console.error('소비 금액 계산 실패:', error);
    return {
      success: false,
      message: error.message || '소비 금액 계산에 실패했습니다.',
      data: { amount: 0 },
    };
  }
};

/**
 * 챌린지 삭제
 * @param {number} challengeId - 삭제할 챌린지 ID
 * @returns {Promise<Object>} - 삭제 결과
 */
const deleteChallenge = async (challengeId) => {
  try {
    // DELETE /challenges/{challengeId}
    const response = await fetch(`/api/challenges/${challengeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.status === 204) {
      // 성공적으로 삭제됨 (No Content)
      return {
        success: true,
        message: '챌린지가 삭제되었습니다.',
      };
    }

    throw new Error(`HTTP error! status: ${response.status}`);
  } catch (error) {
    console.error('챌린지 삭제 실패:', error);
    return {
      success: false,
      message: error.message || '챌린지 삭제에 실패했습니다.',
    };
  }
};

/**
 * 특정 챌린지 조회
 * @param {number} challengeId - 챌린지 ID
 * @returns {Promise<Object>} - 챌린지 데이터
 */
const getChallengeById = async (challengeId) => {
  try {
    // GET /challenges/{challengeId}
    const response = await fetch(`/api/challenges/${challengeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const challenge = await handleResponse(response);

    return {
      success: true,
      data: {
        id: challenge.mchlId,
        title: challenge.mchlName,
        startDate: challenge.mchlStartDate,
        endDate: challenge.mchlEndDate,
        targetAmount: challenge.mchlTargetAmount,
        reward: challenge.mchlReward,
        contents: challenge.mchlContents,
      },
    };
  } catch (error) {
    console.error('챌린지 조회 실패:', error);
    return {
      success: false,
      message: error.message || '챌린지를 찾을 수 없습니다.',
    };
  }
};

/**
 * 사용자의 포인트 조회
 * 세션 쿠키를 통해 서버에서 자동으로 현재 사용자 식별
 * @returns {Promise<Object>} - 포인트 데이터
 */
const getUserPoints = async () => {
  try {
    // TODO: 실제 Member API 호출
    // 세션 쿠키를 통해 서버에서 자동으로 현재 사용자의 포인트 조회
    // const response = await fetch('/api/members/my/points', {
    //   method: 'GET',
    //   headers: { 'Content-Type': 'application/json' },
    //   credentials: 'include',
    // });

    // 임시로 기본값 반환
    return {
      success: true,
      data: { points: 1000 }, // 기본 포인트
    };
  } catch (error) {
    console.error('포인트 조회 실패:', error);
    return {
      success: false,
      message: error.message || '포인트를 불러오는데 실패했습니다.',
      data: { points: 0 },
    };
  }
};

/**
 * 챌린지 성공률 계산
 * 세션 쿠키를 통해 서버에서 자동으로 현재 사용자의 성공률 계산
 * @returns {Promise<Object>} - 성공률 데이터
 */
const getChallengeSuccessRate = async () => {
  try {
    // 모든 챌린지를 가져와서 클라이언트에서 계산
    const challengesResponse = await getAllChallenges();

    if (!challengesResponse.success) {
      throw new Error('챌린지 목록을 불러올 수 없습니다.');
    }

    const challenges = challengesResponse.data;
    const today = new Date();

    // 완료된 챌린지들만 필터링 (종료일이 오늘보다 이전)
    const completedChallenges = challenges.filter(
      (challenge) => new Date(challenge.endDate) < today,
    );

    if (completedChallenges.length === 0) {
      return {
        success: true,
        data: { successRate: 0, totalChallenges: 0, successfulChallenges: 0 },
      };
    }

    // TODO: 실제 성공/실패 여부를 계산하려면 각 챌린지의 소비 금액을 확인해야 함
    // 현재는 임시로 70% 성공률 가정
    const successfulChallenges = Math.floor(completedChallenges.length * 0.7);
    const successRate = Math.round((successfulChallenges / completedChallenges.length) * 100);

    return {
      success: true,
      data: {
        successRate,
        totalChallenges: completedChallenges.length,
        successfulChallenges,
      },
    };
  } catch (error) {
    console.error('성공률 계산 실패:', error);
    return {
      success: false,
      message: error.message || '성공률 계산에 실패했습니다.',
      data: { successRate: 0, totalChallenges: 0, successfulChallenges: 0 },
    };
  }
};

/**
 * 챌린지 업데이트
 * @param {number} challengeId - 업데이트할 챌린지 ID
 * @param {Object} challengeData - 업데이트할 챌린지 데이터
 * @returns {Promise<Object>} - 업데이트 결과
 */
const updateChallenge = async (challengeId, challengeData) => {
  try {
    // 백엔드 형식에 맞게 데이터 변환
    const requestData = {
      mchlName: challengeData.title,
      mchlTargetAmount: parseInt(challengeData.targetAmount),
      mchlStartDate: challengeData.startDate,
      mchlEndDate: challengeData.endDate,
      mchlReward: parseInt(challengeData.reward) || 0,
      mchlContents: challengeData.contents || '',
    };

    // PUT /challenges/{challengeId}
    const response = await fetch(`/api/challenges/${challengeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 세션 쿠키 포함
      body: JSON.stringify(requestData),
    });

    const updatedChallenge = await handleResponse(response);

    return {
      success: true,
      message: '챌린지가 수정되었습니다.',
      data: {
        id: updatedChallenge.mchlId,
        title: updatedChallenge.mchlName,
        startDate: updatedChallenge.mchlStartDate,
        endDate: updatedChallenge.mchlEndDate,
        targetAmount: updatedChallenge.mchlTargetAmount,
        reward: updatedChallenge.mchlReward,
        contents: updatedChallenge.mchlContents,
      },
    };
  } catch (error) {
    console.error('챌린지 수정 실패:', error);
    return {
      success: false,
      message: error.message || '챌린지 수정에 실패했습니다.',
    };
  }
};

// Export API 객체
const BACK_CHALLENGE_API = {
  getAllChallenges,
  createChallenge,
  getExpenseAmount,
  deleteChallenge,
  getChallengeById,
  getUserPoints,
  getChallengeSuccessRate,
  updateChallenge,
};

export default BACK_CHALLENGE_API;
