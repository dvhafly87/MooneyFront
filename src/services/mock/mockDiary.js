import MOCKDATA from '../../assets/mockData';

/**
 * 다이어리 관련 Mock API - sessionStorage의 세션 데이터 활용
 * mockData 구조: { mdiaId, mdiaMmemId, mdiaDate, mdiaContent }
 * 백엔드 연결 시 이 파일만 실제 API 호출로 변경하면 됨
 */

// sessionStorage에서 현재 로그인한 사용자 정보 가져오기 (mockUser.js와 동일한 방식)
const getCurrentUser = () => {
  try {
    // 🔥 localStorage가 아닌 sessionStorage에서 mockSession 가져오기
    const mockSession = sessionStorage.getItem('mockSession');
    if (mockSession) {
      const sessionData = JSON.parse(mockSession);

      // 세션 만료 체크 (1시간)
      if (Date.now() - sessionData.loginTime > 60 * 60 * 1000) {
        console.log('❌ 세션 만료');
        sessionStorage.removeItem('mockSession');
        return null;
      }

      // userId 반환 (sessionData.userId가 실제 사용자 ID)
      return { id: sessionData.userId };
    }
    return null;
  } catch (error) {
    console.error('세션 정보를 불러올 수 없습니다:', error);
    sessionStorage.removeItem('mockSession');
    return null;
  }
};

// 날짜 키 포맷팅 유틸리티
const formatDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * 특정 날짜의 일기 조회 (현재 로그인한 사용자)
 * @param {Date|string} date - 날짜
 * @returns {Promise<Object>} - 일기 데이터
 */
const getDiaryByDate = async (date) => {
  // API 응답 시뮬레이션을 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const dateKey = formatDateKey(date);

    // mockData에서 일기 찾기 (날짜는 Date 객체이므로 변환 필요)
    const diary = MOCKDATA.mockDiaryData?.find((diary) => {
      const diaryDateKey = formatDateKey(diary.mdiaDate);
      return diary.mdiaMmemId === currentUser.id && diaryDateKey === dateKey;
    });

    if (diary) {
      return {
        success: true,
        data: {
          mdiaId: diary.mdiaId,
          mdiaMmemId: diary.mdiaMmemId,
          mdiaDate: diary.mdiaDate,
          mdiaContent: diary.mdiaContent,
          // DiaryPage에서 사용하는 text 필드로 매핑
          text: diary.mdiaContent,
        },
      };
    }

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error('일기 조회 중 오류:', error);
    throw new Error('일기를 불러올 수 없습니다.');
  }
};

/**
 * 일기 저장/수정 (현재 로그인한 사용자)
 * @param {Date|string} date - 날짜
 * @param {string} text - 일기 내용
 * @returns {Promise<Object>} - 저장 결과
 */
const saveDiary = async (date, text) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('일기 내용을 입력해주세요.');
    }

    const dateKey = formatDateKey(date);

    // mockData에서 기존 일기 찾기
    if (!MOCKDATA.mockDiaryData) {
      MOCKDATA.mockDiaryData = [];
    }

    const existingDiaryIndex = MOCKDATA.mockDiaryData.findIndex((diary) => {
      const diaryDateKey = formatDateKey(diary.mdiaDate);
      return diary.mdiaMmemId === currentUser.id && diaryDateKey === dateKey;
    });

    let savedDiary;

    if (existingDiaryIndex !== -1) {
      // 기존 일기 수정
      MOCKDATA.mockDiaryData[existingDiaryIndex].mdiaContent = text.trim();
      savedDiary = MOCKDATA.mockDiaryData[existingDiaryIndex];
      console.log(savedDiary);
      console.log(`일기 수정 완료: ${currentUser.id}, ${dateKey}`);
    } else {
      // 새 일기 생성
      const newDiary = {
        mdiaId: Math.max(...(MOCKDATA.mockDiaryData.map((d) => d.mdiaId) || [0]), 0) + 1,
        mdiaMmemId: currentUser.id,
        mdiaDate: new Date(date),
        mdiaContent: text.trim(),
      };

      console.log(newDiary);

      MOCKDATA.mockDiaryData.push(newDiary);
      savedDiary = newDiary;
      console.log(`새 일기 생성 완료: ${currentUser.id}, ${dateKey}`);
    }

    return {
      success: true,
      message: existingDiaryIndex !== -1 ? '일기가 수정되었습니다.' : '일기가 저장되었습니다.',
      data: {
        mdiaId: savedDiary.mdiaId,
        mdiaMmemId: savedDiary.mdiaMmemId,
        mdiaDate: savedDiary.mdiaDate,
        mdiaContent: savedDiary.mdiaContent,
        // DiaryPage에서 사용하는 text 필드로 매핑
        text: savedDiary.mdiaContent,
      },
    };
  } catch (error) {
    console.error('일기 저장 중 오류:', error);
    throw error;
  }
};

/**
 * 일기 삭제 (현재 로그인한 사용자)
 * @param {Date|string} date - 날짜
 * @returns {Promise<Object>} - 삭제 결과
 */
const deleteDiary = async (date) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const dateKey = formatDateKey(date);

    // mockData에서 일기 찾기
    if (!MOCKDATA.mockDiaryData) {
      throw new Error('삭제할 일기를 찾을 수 없습니다.');
    }

    const diaryIndex = MOCKDATA.mockDiaryData.findIndex((diary) => {
      const diaryDateKey = formatDateKey(diary.mdiaDate);
      return diary.mdiaMmemId === currentUser.id && diaryDateKey === dateKey;
    });

    if (diaryIndex === -1) {
      throw new Error('삭제할 일기를 찾을 수 없습니다.');
    }

    // 일기 삭제
    const deletedDiary = MOCKDATA.mockDiaryData.splice(diaryIndex, 1)[0];
    console.log(`일기 삭제 완료: ${currentUser.id}, ${dateKey}`);

    return {
      success: true,
      message: '일기가 삭제되었습니다.',
      data: {
        deletedId: deletedDiary.mdiaId,
        deletedDate: dateKey,
      },
    };
  } catch (error) {
    console.error('일기 삭제 중 오류:', error);
    throw error;
  }
};

/**
 * 현재 사용자의 모든 일기 조회
 * @returns {Promise<Object>} - 일기 목록
 */
const getAllDiaries = async () => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    if (!MOCKDATA.mockDiaryData) {
      return {
        success: true,
        data: {
          diaries: [],
          totalCount: 0,
        },
      };
    }

    const diaries = MOCKDATA.mockDiaryData
      .filter((diary) => diary.mdiaMmemId === currentUser.id)
      .map((diary) => ({
        mdiaId: diary.mdiaId,
        mdiaMmemId: diary.mdiaMmemId,
        mdiaDate: diary.mdiaDate,
        mdiaContent: diary.mdiaContent,
        // DiaryPage에서 사용하는 필드로 매핑
        text: diary.mdiaContent,
        date: formatDateKey(diary.mdiaDate),
      }));

    // 날짜순 정렬 (최신순)
    diaries.sort((a, b) => new Date(b.mdiaDate) - new Date(a.mdiaDate));

    return {
      success: true,
      data: {
        diaries,
        totalCount: diaries.length,
      },
    };
  } catch (error) {
    console.error('일기 목록 조회 중 오류:', error);
    throw new Error('일기 목록을 불러올 수 없습니다.');
  }
};

const MOCK_DIARY_API = {
  // 기본 CRUD (필수 기능만) - userId 파라미터 제거
  getDiaryByDate,
  saveDiary,
  deleteDiary,

  // 목록 조회
  getAllDiaries,

  // 유틸리티 (필요)
  formatDateKey,
  getCurrentUser,
};

export default MOCK_DIARY_API;
