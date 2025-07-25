const SERVER_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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

// 날짜 키 포맷팅 유틸리티
const formatDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * 현재 로그인한 사용자 정보 가져오기 (세션에서)
 * AuthContext에서 관리하는 사용자 정보 대신 세션 확인 API 호출
 */
const getCurrentUserId = async () => {
  try {
    // 세션 검증 API 호출해서 현재 사용자 ID 가져오기
    const response = await apiRequest('/session/check', {
      method: 'GET',
    });

    if (response.isLogined && response.userInfo) {
      return response.userInfo.id;
    }

    throw new Error('로그인이 필요합니다.');
  } catch (error) {
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

    // 응답이 배열인 경우 (Java Controller가 List<Diary> 반환)
    const diaries = Array.isArray(result) ? result : [];

    // 특정 날짜의 일기 찾기
    const diary = diaries.find((diary) => {
      const diaryDateKey = formatDateKey(diary.mdiaDate);
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

    // 404 에러인 경우 (일기가 없는 경우)
    if (error.message.includes('404')) {
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
      // 기존 일기 업데이트 - PUT /diaries/{diaryId}
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
      // 새 일기 생성 - POST /diaries/member/{memberId}
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

    // DELETE 요청 - 204 No Content 응답 예상
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

    // 응답이 배열인 경우 (Java Controller가 List<Diary> 반환)
    const diaries = Array.isArray(result) ? result : [];

    const mappedDiaries = diaries.map((diary) => ({
      mdiaId: diary.mdiaId,
      mdiaMmemId: diary.member?.mmemid || userId,
      mdiaDate: diary.mdiaDate,
      mdiaContent: diary.mdiaContent,
      text: diary.mdiaContent,
      date: formatDateKey(diary.mdiaDate),
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

    // 404 에러인 경우 (일기가 없는 경우)
    if (error.message.includes('404')) {
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
