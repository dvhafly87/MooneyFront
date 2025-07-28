// src/services/back/userApi.js
// 🔥 백엔드 API 직접 호출용 (AuthContext 외부에서 사용시)

const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

// 🔥 기본 API 호출 함수
const apiCall = async (endpoint, options = {}) => {
  const url = `${SERVER_URL}${endpoint}`;
  const defaultOptions = {
    credentials: 'include', // Spring Boot 세션 쿠키 포함
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`🚀 API 호출: ${options.method || 'GET'} ${url}`);
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Content-Type에 따라 다르게 처리
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      console.log(`✅ API 응답: ${endpoint}`, result);
      return result;
    } else {
      const result = await response.text();
      console.log(`✅ API 응답: ${endpoint}`, result);
      return result;
    }
  } catch (error) {
    console.error(`❌ API 에러: ${endpoint}`, error);
    throw error;
  }
};

// 🔥 로그인 API
export const login = async (credentials) => {
  return await apiCall('/do.login', {
    method: 'POST',
    body: JSON.stringify({
      loginId: credentials.id,
      loginPw: credentials.password,
    }),
  });
};

// 🔥 로그아웃 API
export const logout = async () => {
  return await apiCall('/do.logout', {
    method: 'POST',
  });
};

// 🔥 세션 검증 API
export const checkSession = async (loginId) => {
  return await apiCall('/do.logincheck', {
    method: 'POST',
    body: JSON.stringify({ regid: loginId }),
  });
};

// 🔥 회원가입 API
export const register = async (userData) => {
  const formData = new FormData();
  formData.append('id', userData.id);
  formData.append('pw', userData.password);
  formData.append('nick', userData.nickname);
  formData.append('birth', userData.birthDate);

  if (userData.profilePhoto) {
    formData.append('photoTemp', userData.profilePhoto);
  }

  return await apiCall('/do.registerpage', {
    method: 'POST',
    headers: {}, // FormData일 때는 Content-Type 헤더 제거
    body: formData,
  });
};

// 🔥 아이디 중복 확인 API
export const checkIdDuplicate = async (id) => {
  return await apiCall('/do.Idcheck', {
    method: 'POST',
    body: JSON.stringify({ regid: id }),
  });
};

// 🔥 닉네임 중복 확인 API
export const checkNicknameDuplicate = async (nickname) => {
  return await apiCall('/do.NickCheck', {
    method: 'POST',
    body: JSON.stringify({ regnc: nickname }),
  });
};

// 🔥 사용자 정보 조회 API
export const getUserInfo = async (loginId) => {
  return await apiCall('/do.MeminfoCheck', {
    method: 'POST',
    body: JSON.stringify({ regid: loginId }),
  });
};

// 🔥 회원정보 수정 API
export const updateUserInfo = async (updateData, currentPassword, loginId) => {
  const formData = new FormData();
  formData.append('eid', loginId);
  formData.append('ecurpw', currentPassword);

  if (updateData.nickname) formData.append('enick', updateData.nickname);
  if (updateData.password) formData.append('epw', updateData.password);
  if (updateData.profilePhoto) formData.append('ephoto', updateData.profilePhoto);

  return await apiCall('/member.info.edit', {
    method: 'POST',
    headers: {}, // FormData일 때는 Content-Type 헤더 제거
    body: formData,
  });
};

// 🔥 회원탈퇴 API
export const deleteAccount = async (password) => {
  return await apiCall('/member.exit', {
    method: 'POST',
    body: JSON.stringify({ regid: password }),
  });
};

// 🔥 프로필 이미지 URL 생성
export const getProfileImageUrl = (photoName) => {
  if (!photoName) return null;
  return `${SERVER_URL}/member.photo/${photoName}`;
};

// 🔥 비밀번호 확인 API (완전한 구현)
const verifyPassword = async (loginId, password) => {
  return await apiCall('/do.passwordcheck', {
    method: 'POST',
    body: JSON.stringify({
      regid: loginId,
      regpw: password,
    }),
  });
};

// 🔥 이메일 인증코드 발송 API (백엔드에 맞게 수정)
const sendVerificationEmail = async (email) => {
  // 백엔드에서 @RequestParam("email")을 사용하므로 FormData 사용
  const formData = new FormData();
  formData.append('email', email);

  try {
    const result = await apiCall('/mailSend', {
      method: 'POST',
      headers: {}, // FormData일 때는 Content-Type 헤더 제거
      body: formData,
    });

    // 백엔드 응답을 프론트엔드에서 사용하기 쉬운 형태로 변환
    if (result.success) {
      return {
        success: true,
        message: '인증코드가 발송되었습니다.',
        __dev_code: result.number, // 개발용 코드 표시
      };
    } else {
      throw new Error(result.error || '이메일 발송에 실패했습니다.');
    }
  } catch (error) {
    throw new Error(error.message || '이메일 발송 중 오류가 발생했습니다.');
  }
};

// 🔥 이메일 인증코드 확인 API (백엔드에 맞게 수정)
const verifyEmailCode = async (email, code) => {
  try {
    // 백엔드에서 RegIdCheck 객체의 regan 필드를 사용
    const result = await apiCall('/mailCheck', {
      method: 'POST',
      body: JSON.stringify({
        regan: code, // 백엔드에서 getRegan()으로 받는 필드
      }),
    });

    // 백엔드 응답을 프론트엔드에서 사용하기 쉬운 형태로 변환
    if (result.finalMessage) {
      return {
        success: true,
        message: '이메일 인증이 완료되었습니다.',
      };
    } else {
      throw new Error('인증코드가 올바르지 않습니다.');
    }
  } catch (error) {
    throw new Error(error.message || '이메일 인증 중 오류가 발생했습니다.');
  }
};

// 🔥 전체 API 객체
const userApi = {
  login,
  logout,
  checkSession,
  register,
  checkIdDuplicate,
  checkNicknameDuplicate,
  getUserInfo,
  updateUserInfo,
  deleteAccount,
  getProfileImageUrl,
  verifyPassword,
  sendVerificationEmail,
  verifyEmailCode,
};

export default userApi;
