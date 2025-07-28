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
};

export default userApi;
