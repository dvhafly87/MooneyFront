const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

//? 구독 리스트 조회 API - 세션 기반
const getSubscriptions = async () => {
  try {
    console.log('🔍 구독 리스트 조회 요청 시작');

    const response = await fetch(`${SERVER_URL}/subscription/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 🔥 세션 쿠키 포함
    });

    console.log('📡 구독 리스트 응답 상태:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ 구독 리스트 조회 성공:', result);

    return {
      success: true,
      data: result.subscriptions || result.data || [],
    };
  } catch (error) {
    console.error('❌ 구독 리스트 조회 에러:', error);

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('서버 연결 불가능, 백엔드 서버가 실행 확인하쇼');
    }

    throw new Error(error.message || '구독 리스트 조회 실패');
  }
};

//? 구독 추가 API - 세션 기반
const addSubscription = async (subscriptionData) => {
  try {
    console.log('📝 구독 추가 요청 시작:', subscriptionData);

    // 🔥 데이터 유효성 검사 (클라이언트 측)
    if (!subscriptionData.mexpDec?.trim()) {
      throw new Error('구독 서비스 설명을 입력해주세요.');
    }

    if (!subscriptionData.mcatId) {
      throw new Error('카테고리를 선택해주세요.');
    }

    if (!subscriptionData.mexpAmt || parseInt(subscriptionData.mexpAmt) <= 0) {
      throw new Error('올바른 금액을 입력해주세요.');
    }

    if (!subscriptionData.mexpRptdd) {
      throw new Error('지출 예정일을 선택해주세요.');
    }

    const requestData = {
      mexpDec: subscriptionData.mexpDec.trim(),
      mexpAmt: parseInt(subscriptionData.mexpAmt),
      mexpRptdd: subscriptionData.mexpRptdd,
      mcatId: parseInt(subscriptionData.mcatId),
    };

    const response = await fetch(`${SERVER_URL}/subscription/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 🔥 세션으로 사용자 식별
      body: JSON.stringify(requestData),
    });

    console.log('📡 구독 추가 응답 상태:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ 구독 추가 성공:', result);

    return {
      success: true,
      message: result.message || `${subscriptionData.mexpDec} 구독이 성공적으로 추가되었습니다!`,
      data: result.data || result.subscription,
    };
  } catch (error) {
    console.error('❌ 구독 추가 에러:', error);
    throw new Error(error.message || '구독 추가 실패');
  }
};

//? 구독 수정 API - 세션 기반
const updateSubscription = async (mexpId, subscriptionData) => {
  try {
    console.log('✏️ 구독 수정 요청 시작:', { mexpId, subscriptionData });

    // 🔥 데이터 유효성 검사 (클라이언트 측)
    if (!subscriptionData.mexpDec?.trim()) {
      throw new Error('구독 서비스 설명을 입력해주세요.');
    }

    if (!subscriptionData.mcatId) {
      throw new Error('카테고리를 선택해주세요.');
    }

    if (!subscriptionData.mexpAmt || parseInt(subscriptionData.mexpAmt) <= 0) {
      throw new Error('올바른 금액을 입력해주세요.');
    }

    if (!subscriptionData.mexpRptdd) {
      throw new Error('지출 예정일을 선택해주세요.');
    }

    const requestData = {
      mexpId: mexpId,
      mexpDec: subscriptionData.mexpDec.trim(),
      mexpAmt: parseInt(subscriptionData.mexpAmt),
      mexpRptdd: subscriptionData.mexpRptdd,
      mcatId: parseInt(subscriptionData.mcatId),
    };

    const response = await fetch(`${SERVER_URL}/subscription/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 🔥 세션으로 사용자 식별
      body: JSON.stringify(requestData),
    });

    console.log('📡 구독 수정 응답 상태:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ 구독 수정 성공:', result);

    return {
      success: true,
      message: result.message || `${subscriptionData.mexpDec} 구독이 성공적으로 수정되었습니다!`,
      data: result.data || result.subscription,
    };
  } catch (error) {
    console.error('❌ 구독 수정 에러:', error);
    throw new Error(error.message || '구독 수정 실패');
  }
};

//? 구독 삭제 API - 세션 기반
const deleteSubscription = async (mexpId) => {
  try {
    console.log('🗑️ 구독 삭제 요청 시작:', mexpId);

    const response = await fetch(`${SERVER_URL}/subscription/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 🔥 세션으로 사용자 식별
      body: JSON.stringify({ mexpId: mexpId }),
    });

    console.log('📡 구독 삭제 응답 상태:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ 구독 삭제 성공:', result);

    return {
      success: true,
      message: result.message || '구독이 삭제되었습니다.',
      data: result.data || result.deletedSubscription,
    };
  } catch (error) {
    console.error('❌ 구독 삭제 에러:', error);
    throw new Error(error.message || '구독 삭제 실패');
  }
};

//? 구독 결제 완료 처리 API - 세션 기반
const completePayment = async (mexpId) => {
  try {
    console.log('💳 결제 완료 처리 요청 시작:', mexpId);

    const requestData = {
      mexpId: mexpId,
      completionDate: new Date().toISOString().split('T')[0], // 현재 날짜 (YYYY-MM-DD)
    };

    const response = await fetch(`${SERVER_URL}/subscription/complete-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 🔥 세션으로 사용자 식별
      body: JSON.stringify(requestData),
    });

    console.log('📡 결제 완료 응답 상태:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ 결제 완료 처리 성공:', result);

    return {
      success: true,
      message: result.message || '결제가 완료되었습니다!',
      data: {
        completedExpense: result.completedExpense || result.data?.completedExpense,
        newPendingExpense: result.newPendingExpense || result.data?.newPendingExpense,
      },
    };
  } catch (error) {
    console.error('❌ 결제 완료 처리 에러:', error);
    throw new Error(error.message || '결제 처리 중 오류가 발생했습니다.');
  }
};

//? 카테고리 목록 조회 API - 세션 기반
const getCategories = async () => {
  try {
    console.log('📂 카테고리 목록 조회 요청 시작');

    const response = await fetch(`${SERVER_URL}/category/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 🔥 세션 쿠키 포함
    });

    console.log('📡 카테고리 목록 응답 상태:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ 카테고리 목록 조회 성공:', result);

    return {
      success: true,
      data: result.categories || result.data || [],
    };
  } catch (error) {
    console.error('❌ 카테고리 목록 조회 에러:', error);

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('서버 연결 불가능, 백엔드 서버가 실행 확인하쇼');
    }

    throw new Error(error.message || '카테고리 정보를 불러올 수 없습니다.');
  }
};

// ✅ BACK_SUBSCRIPTION_API 객체 생성
const BACK_SUBSCRIPTION_API = {
  getSubscriptions,
  addSubscription,
  updateSubscription,
  deleteSubscription,
  completePayment,
  getCategories,
};

export default BACK_SUBSCRIPTION_API;
