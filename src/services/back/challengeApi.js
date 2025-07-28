// src/services/back/challengeApi.js
// 🔥 백엔드 API 엔드포인트에 맞게 수정

const SERVER_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7474';

/**
 * localStorage에서 현재 로그인된 사용자 ID 가져오기
 */
const getCurrentUserId = () => {
  try {
    const savedLoginState = localStorage.getItem('isYouLogined');
    if (savedLoginState) {
      const userData = JSON.parse(savedLoginState);
      return userData.id; // AuthContext에서 저장하는 구조: {nick, id, point}
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

  // JSON이 아닌 경우 텍스트로 반환
  return await response.text();
};

/**
 * 모든 챌린지 데이터 가져오기
 * 백엔드 엔드포인트: GET /challenges/member/{memberId}
 * @returns {Promise<Object>} - 사용자의 모든 챌린지 데이터
 */
const getAllChallenges = async () => {
  try {
    const memberId = getCurrentUserId();
    if (!memberId) {
      throw new Error('로그인이 필요합니다.');
    }

    console.log(`🚀 챌린지 목록 조회: GET ${SERVER_URL}/challenges/member/${memberId}`);

    const response = await fetch(`${SERVER_URL}/challenges/member/${memberId}`, {
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
    console.log('✅ 챌린지 목록 조회 성공:', challenges);

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
    console.error('❌ 챌린지 목록 조회 실패:', error);
    return {
      success: false,
      message: error.message || '챌린지 목록을 불러오는데 실패했습니다.',
      data: [],
    };
  }
};

/**
 * 새로운 챌린지 생성
 * 백엔드 엔드포인트: POST /challenges/member/{memberId}
 * @param {Object} challengeData - 챌린지 데이터
 * @returns {Promise<Object>} - 생성 결과
 */
const createChallenge = async (challengeData) => {
  try {
    const memberId = getCurrentUserId();
    if (!memberId) {
      throw new Error('로그인이 필요합니다.');
    }

    // 백엔드 형식에 맞게 데이터 변환
    const requestData = {
      mchlName: challengeData.title,
      mchlTargetAmount: parseInt(challengeData.targetAmount),
      mchlStartDate: challengeData.startDate, // YYYY-MM-DD 형식
      mchlEndDate: challengeData.endDate,
      mchlReward: parseInt(challengeData.reward) || 0,
      mchlContents: challengeData.contents || '',
    };

    console.log(`🚀 챌린지 생성: POST ${SERVER_URL}/challenges/member/${memberId}`, requestData);

    const response = await fetch(`${SERVER_URL}/challenges/member/${memberId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 포함
      body: JSON.stringify(requestData),
    });

    const createdChallenge = await handleResponse(response);
    console.log('✅ 챌린지 생성 성공:', createdChallenge);

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
    console.error('❌ 챌린지 생성 실패:', error);
    return {
      success: false,
      message: error.message || '챌린지 생성에 실패했습니다.',
    };
  }
};

/**
 * 특정 기간의 소비 내역 계산
 * 백엔드 Expense API를 호출하여 실제 지출 금액 계산
 * @param {string} startDate - 시작 날짜 (YYYY-MM-DD)
 * @param {string} endDate - 종료 날짜 (YYYY-MM-DD, 선택사항)
 * @returns {Promise<Object>} - 해당 기간의 총 소비 금액
 */
const getExpenseAmount = async (startDate, endDate = null) => {
  try {
    const memberId = getCurrentUserId();
    if (!memberId) {
      throw new Error('로그인이 필요합니다.');
    }

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

    console.log(`🚀 지출 금액 조회: GET ${SERVER_URL}/expenses/member/${memberId}/by-date-range`);
    console.log(`📅 기간: ${startDate} ~ ${actualEndDate}`);

    // 실제 Expense API 호출
    const response = await fetch(
      `${SERVER_URL}/expenses/member/${memberId}/by-date-range?startDate=${startDate}&endDate=${actualEndDate}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );

    // 204 No Content인 경우 (해당 기간에 지출이 없는 경우)
    if (response.status === 204) {
      console.log('✅ 해당 기간에 지출 내역 없음');
      return {
        success: true,
        data: { amount: 0 },
      };
    }

    const expenses = await handleResponse(response);
    console.log('✅ 지출 내역 조회 성공:', expenses);

    // 지출만 필터링 (mexpType === 'E')하고 총합 계산
    const totalExpenseAmount = expenses
      .filter((expense) => expense.mexpType === 'E') // 지출만 필터링
      .reduce((total, expense) => total + expense.mexpAmt, 0);

    console.log(`💰 총 지출 금액: ${totalExpenseAmount}원`);

    return {
      success: true,
      data: { amount: totalExpenseAmount },
    };
  } catch (error) {
    console.error('❌ 소비 금액 계산 실패:', error);

    // 네트워크 오류나 API 오류인 경우 fallback으로 0 반환
    return {
      success: false,
      message: error.message || '소비 금액 계산에 실패했습니다.',
      data: { amount: 0 },
    };
  }
};

/**
 * 챌린지 삭제
 * 백엔드 엔드포인트: DELETE /challenges/{challengeId}
 * @param {number} challengeId - 삭제할 챌린지 ID
 * @returns {Promise<Object>} - 삭제 결과
 */
const deleteChallenge = async (challengeId) => {
  try {
    console.log(`🚀 챌린지 삭제: DELETE ${SERVER_URL}/challenges/${challengeId}`);

    const response = await fetch(`${SERVER_URL}/challenges/${challengeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.status === 204) {
      // 성공적으로 삭제됨 (No Content)
      console.log('✅ 챌린지 삭제 성공');
      return {
        success: true,
        message: '챌린지가 삭제되었습니다.',
      };
    }

    throw new Error(`HTTP error! status: ${response.status}`);
  } catch (error) {
    console.error('❌ 챌린지 삭제 실패:', error);
    return {
      success: false,
      message: error.message || '챌린지 삭제에 실패했습니다.',
    };
  }
};

/**
 * 특정 챌린지 조회
 * 백엔드 엔드포인트: GET /challenges/{challengeId}
 * @param {number} challengeId - 챌린지 ID
 * @returns {Promise<Object>} - 챌린지 데이터
 */
const getChallengeById = async (challengeId) => {
  try {
    console.log(`🚀 챌린지 조회: GET ${SERVER_URL}/challenges/${challengeId}`);

    const response = await fetch(`${SERVER_URL}/challenges/${challengeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const challenge = await handleResponse(response);
    console.log('✅ 챌린지 조회 성공:', challenge);

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
    console.error('❌ 챌린지 조회 실패:', error);
    return {
      success: false,
      message: error.message || '챌린지를 찾을 수 없습니다.',
    };
  }
};

/**
 * 사용자의 포인트 조회
 * 실제 사용자 API를 호출하여 최신 포인트 정보 조회
 * @returns {Promise<Object>} - 포인트 데이터
 */
const getUserPoints = async () => {
  try {
    const memberId = getCurrentUserId();
    if (!memberId) {
      throw new Error('로그인이 필요합니다.');
    }

    console.log(`🚀 사용자 포인트 조회: ${memberId}`);

    // userApi의 getUserInfo를 동적으로 import하여 사용
    const { default: BACK_USER_API } = await import('./userApi.js');

    // 실제 사용자 정보 API 호출
    const userInfoResponse = await BACK_USER_API.getUserInfo(memberId);

    if (userInfoResponse.success) {
      const points = userInfoResponse.data?.user?.ppnt || 0;
      console.log(`✅ 포인트 조회 성공: ${points}P`);

      return {
        success: true,
        data: { points },
      };
    } else {
      throw new Error(userInfoResponse.message || '사용자 정보 조회 실패');
    }
  } catch (error) {
    console.error('❌ 포인트 조회 실패:', error);

    // API 호출 실패 시 fallback으로 localStorage에서 가져오기
    try {
      const savedLoginState = localStorage.getItem('isYouLogined');
      if (savedLoginState) {
        const userData = JSON.parse(savedLoginState);
        console.log('📦 localStorage에서 포인트 정보 사용:', userData.point || 0);
        return {
          success: true,
          data: { points: userData.point || 0 },
        };
      }
    } catch (fallbackError) {
      console.error('❌ localStorage fallback 실패:', fallbackError);
    }

    return {
      success: false,
      message: error.message || '포인트를 불러오는데 실패했습니다.',
      data: { points: 0 },
    };
  }
};

/**
 * 챌린지 성공률 계산
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
    console.error('❌ 성공률 계산 실패:', error);
    return {
      success: false,
      message: error.message || '성공률 계산에 실패했습니다.',
      data: { successRate: 0, totalChallenges: 0, successfulChallenges: 0 },
    };
  }
};

/**
 * 챌린지 업데이트
 * 백엔드 엔드포인트: PUT /challenges/{challengeId}
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

    console.log(`🚀 챌린지 수정: PUT ${SERVER_URL}/challenges/${challengeId}`, requestData);

    const response = await fetch(`${SERVER_URL}/challenges/${challengeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 세션 쿠키 포함
      body: JSON.stringify(requestData),
    });

    const updatedChallenge = await handleResponse(response);
    console.log('✅ 챌린지 수정 성공:', updatedChallenge);

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
    console.error('❌ 챌린지 수정 실패:', error);
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
