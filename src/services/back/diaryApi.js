// src/services/back/diaryApi.js
/**
 * 다이어리 관련 실제 백엔드 API (순수 세션 기반)
 * Java Spring Boot Controller 엔드포인트에 맞게 구현
 * 토큰이나 localStorage 없이 세션 쿠키만 사용
 */

// 🔥 서버 URL 통일 - 다른 API 파일들과 같은 포트 사용
const SERVER_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7474';

// 공통 fetch 요청 함수 (순수 세션 기반)
const apiRequest = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 세션 쿠키만 사용
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${SERVER_URL}${url}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // 204 No Content인 경우 빈 객체 반환
    if (response.status === 204) {
      return {};
    }

    return await response.json();
  } catch (error) {
    console.error('API 요청 중 오류:', error);
    throw error;
  }
};

// 날짜 키 포맷팅 유틸리티 - Java LocalDate 형식에 맞게
const formatDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// 🔥 Java LocalDate를 JavaScript Date로 변환
const parseJavaDate = (javaDateString) => {
  if (Array.isArray(javaDateString)) {
    // Java LocalDate가 [2024, 1, 15] 형식으로 올 수 있음
    const [year, month, day] = javaDateString;
    return new Date(year, month - 1, day); // month는 0부터 시작
  }
  return new Date(javaDateString);
};

/**
 * 🔥 현재 로그인한 사용자 정보 가져오기 (기존 AuthContext 활용)
 * /session/check 대신 /do.logincheck 사용 (실제 존재하는 엔드포인트)
 */
const getCurrentUserId = async () => {
  try {
    // 🔥 localStorage에서 사용자 정보 확인 (AuthContext와 동일한 방식)
    const savedLoginState = localStorage.getItem('isYouLogined');

    if (!savedLoginState) {
      throw new Error('로그인이 필요합니다.');
    }

    const parsedState = JSON.parse(savedLoginState);

    if (parsedState && parsedState.id) {
      // 🔥 실제 존재하는 세션 검증 API 사용
      const sessionCheck = await apiRequest('/do.logincheck', {
        method: 'POST',
        body: JSON.stringify({ regid: parsedState.id }),
      });

      // 세션이 유효한 경우 사용자 ID 반환
      if (sessionCheck && (sessionCheck.isLogined || sessionCheck.loginstatus)) {
        return parsedState.id;
      }
    }

    throw new Error('로그인이 필요합니다.');
  } catch (error) {
    console.error('사용자 정보 가져오기 오류:', error);
    throw new Error('로그인이 필요합니다.');
  }
};

/**
 * 특정 날짜의 일기 조회
 * Spring Boot Controller: GET /diaries/member/{memberId}/all 후 클라이언트에서 필터링
 */
const getDiaryByDate = async (date) => {
  try {
    const userId = await getCurrentUserId();
    const dateString = formatDateKey(date);

    // 전체 일기 목록을 가져와서 날짜로 필터링
    const result = await apiRequest(`/diaries/member/${userId}/all`, {
      method: 'GET',
    });

    // 🔥 응답이 빈 경우 처리 (Spring Boot에서 204 No Content 반환할 수 있음)
    if (!result || !Array.isArray(result)) {
      return {
        success: true,
        data: null,
      };
    }

    // 특정 날짜의 일기 찾기
    const diary = result.find((diary) => {
      // 🔥 Java LocalDate 형식 고려하여 날짜 비교
      const diaryDate = parseJavaDate(diary.mdiaDate);
      const diaryDateKey = formatDateKey(diaryDate);
      return diaryDateKey === dateString;
    });

    return {
      success: true,
      data: diary
        ? {
            mdiaId: diary.mdiaId,
            mdiaMmemId: diary.member?.mmemid || userId,
            mdiaDate: diary.mdiaDate,
            mdiaContent: diary.mdiaContent,
            text: diary.mdiaContent,
          }
        : null,
    };
  } catch (error) {
    console.error('일기 조회 중 오류:', error);

    // 🔥 404 에러나 No Content 에러인 경우 (일기가 없는 경우)
    if (error.message.includes('404') || error.message.includes('204')) {
      return {
        success: true,
        data: null,
      };
    }

    throw new Error('일기를 불러올 수 없습니다.');
  }
};

/**
 * 일기 저장/수정
 * Spring Boot Controller: POST /diaries/member/{memberId} (새 일기)
 *                        PUT /diaries/{diaryId} (기존 일기 수정)
 */
const saveDiary = async (date, text) => {
  try {
    const userId = await getCurrentUserId();

    if (!text || text.trim().length === 0) {
      throw new Error('일기 내용을 입력해주세요.');
    }

    const dateString = formatDateKey(date);

    // 먼저 해당 날짜의 기존 일기가 있는지 확인
    const existingDiary = await getDiaryByDate(date);

    if (existingDiary.data) {
      // 🔥 기존 일기 업데이트 - PUT /diaries/{diaryId}
      const updateResult = await apiRequest(`/diaries/${existingDiary.data.mdiaId}`, {
        method: 'PUT',
        body: JSON.stringify({
          mdiaId: existingDiary.data.mdiaId,
          mdiaDate: dateString,
          mdiaContent: text.trim(),
        }),
      });

      return {
        success: true,
        message: '일기가 수정되었습니다.',
        data: {
          mdiaId: updateResult.mdiaId,
          mdiaMmemId: updateResult.member?.mmemid || userId,
          mdiaDate: updateResult.mdiaDate,
          mdiaContent: updateResult.mdiaContent,
          text: updateResult.mdiaContent,
        },
      };
    } else {
      // 🔥 새 일기 생성 - POST /diaries/member/{memberId}
      const createResult = await apiRequest(`/diaries/member/${userId}`, {
        method: 'POST',
        body: JSON.stringify({
          mdiaDate: dateString,
          mdiaContent: text.trim(),
        }),
      });

      return {
        success: true,
        message: '일기가 저장되었습니다.',
        data: {
          mdiaId: createResult.mdiaId,
          mdiaMmemId: createResult.member?.mmemid || userId,
          mdiaDate: createResult.mdiaDate,
          mdiaContent: createResult.mdiaContent,
          text: createResult.mdiaContent,
        },
      };
    }
  } catch (error) {
    console.error('일기 저장 중 오류:', error);

    // 🔥 더 구체적인 에러 메시지 제공
    if (error.message.includes('404')) {
      throw new Error('사용자를 찾을 수 없습니다. 다시 로그인해주세요.');
    } else if (error.message.includes('400')) {
      throw new Error('잘못된 요청입니다. 일기 내용을 확인해주세요.');
    }

    throw error;
  }
};

/**
 * 일기 삭제
 * Spring Boot Controller: DELETE /diaries/{diaryId}
 */
const deleteDiary = async (date) => {
  try {
    // 먼저 해당 날짜의 일기 찾기
    const existingDiary = await getDiaryByDate(date);

    if (!existingDiary.data) {
      throw new Error('삭제할 일기를 찾을 수 없습니다.');
    }

    // 🔥 DELETE 요청 - 204 No Content 응답 예상
    await apiRequest(`/diaries/${existingDiary.data.mdiaId}`, {
      method: 'DELETE',
    });

    return {
      success: true,
      message: '일기가 삭제되었습니다.',
      data: {
        deletedId: existingDiary.data.mdiaId,
        deletedDate: formatDateKey(date),
      },
    };
  } catch (error) {
    console.error('일기 삭제 중 오류:', error);

    // 🔥 더 구체적인 에러 메시지 제공
    if (error.message.includes('404')) {
      throw new Error('삭제할 일기를 찾을 수 없습니다.');
    }

    throw error;
  }
};

/**
 * 현재 사용자의 모든 일기 조회
 * Spring Boot Controller: GET /diaries/member/{memberId}/all
 */
const getAllDiaries = async () => {
  try {
    const userId = await getCurrentUserId();

    const result = await apiRequest(`/diaries/member/${userId}/all`, {
      method: 'GET',
    });

    // 🔥 응답이 빈 경우 처리
    if (!result || !Array.isArray(result)) {
      return {
        success: true,
        data: {
          diaries: [],
          totalCount: 0,
        },
      };
    }

    const mappedDiaries = result.map((diary) => ({
      mdiaId: diary.mdiaId,
      mdiaMmemId: diary.member?.mmemid || userId,
      mdiaDate: diary.mdiaDate,
      mdiaContent: diary.mdiaContent,
      text: diary.mdiaContent,
      date: formatDateKey(parseJavaDate(diary.mdiaDate)),
    }));

    // 날짜순 정렬 (최신순)
    mappedDiaries.sort((a, b) => new Date(b.mdiaDate) - new Date(a.mdiaDate));

    return {
      success: true,
      data: {
        diaries: mappedDiaries,
        totalCount: mappedDiaries.length,
      },
    };
  } catch (error) {
    console.error('일기 목록 조회 중 오류:', error);

    // 🔥 404 에러나 No Content 에러인 경우 (일기가 없는 경우)
    if (error.message.includes('404') || error.message.includes('204')) {
      return {
        success: true,
        data: {
          diaries: [],
          totalCount: 0,
        },
      };
    }

    throw new Error('일기 목록을 불러올 수 없습니다.');
  }
};

// Mock API와 동일한 인터페이스를 위한 더미 함수들
const getCurrentUser = () => {
  // 이 함수는 호환성을 위해서만 존재, 실제로는 getCurrentUserId 사용
  console.warn('getCurrentUser는 세션 기반에서 사용되지 않습니다.');
  return null;
};

const BACK_DIARY_API = {
  // 기본 CRUD
  getDiaryByDate,
  saveDiary,
  deleteDiary,

  // 목록 조회
  getAllDiaries,

  // 유틸리티
  formatDateKey,
  getCurrentUser, // 호환성을 위한 더미 함수
};

export default BACK_DIARY_API;
