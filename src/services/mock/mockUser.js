import MOCKDATA from '../../assets/mockData.js';

//? 로그인 API - sessionStorage로 세션 관리
const login = async (credentials) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { id, password } = credentials;

  const user = MOCKDATA.mockUserData.find((u) => u.mmemId === id && u.mmemPw === password);

  if (!user) {
    console.log('로그인 에러가 났다');
    throw new Error('아이디 or 비번 틀림');
  }

  // 🔥 Mock 세션 생성 (실제 백엔드의 세션과 유사)
  const mockSession = {
    userId: user.mmemId,
    loginTime: Date.now(),
    sessionId: 'mock_session_' + Date.now(),
  };

  sessionStorage.setItem('mockSession', JSON.stringify(mockSession));
  console.log('🔥 Mock 세션 생성:', mockSession);

  // 🔥 BACK_USER_API와 동일한 응답 구조
  return {
    success: true,
    message: '로그인 성공',
    data: {
      user: {
        loginId: user.mmemId,
        nick: user.mmemNick,
        ppnt: user.mmemPnt,
        // regd, bir, pphoto는 로그인 시 제공 안함 (백엔드와 동일)
      },
    },
  };
};

//? 회원가입 API - 백엔드와 동일한 구조
const register = async (userData) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { id, password, nickname, birthDate, profilePhoto } = userData;

  // 중복 확인
  const existingUser = MOCKDATA.mockUserData.find(
    (u) => u.mmemId === id || u.mmemNick === nickname,
  );

  if (existingUser) {
    if (existingUser.mmemId === id) {
      throw new Error('이미 존재하는 ID');
    }
    if (existingUser.mmemNick === nickname) {
      throw new Error('이미 존재하는 닉네임');
    }
  }

  const newUser = {
    mmemId: id,
    mmemPw: password,
    mmemNick: nickname,
    mmemBir: new Date(birthDate),
    mmemRegd: new Date(),
    mmemPnt: 100,
    mmemPphoto: profilePhoto || null,
  };

  MOCKDATA.mockUserData.push(newUser);

  // 🔥 BACK_USER_API와 동일한 응답 구조
  return {
    success: true,
    message: '회원가입 완료',
  };
};

//? 사용자 세션 검증 API - sessionStorage로 세션 체크
const verifyUser = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 🔥 sessionStorage에서 Mock 세션 확인
  const mockSession = sessionStorage.getItem('mockSession');

  if (!mockSession) {
    console.log('❌ Mock 세션 없음');
    throw new Error('세션 만료');
  }

  try {
    const sessionData = JSON.parse(mockSession);

    // 🔥 요청한 userId와 세션의 userId 비교 (실제 백엔드와 동일한 검증)
    if (sessionData.userId !== userId) {
      console.log('❌ Mock 세션 userId 불일치:', sessionData.userId, '!=', userId);
      throw new Error('세션 만료');
    }

    // 🔥 세션 만료 시간 체크 (1시간)
    if (Date.now() - sessionData.loginTime > 60 * 60 * 1000) {
      console.log('❌ Mock 세션 시간 만료');
      sessionStorage.removeItem('mockSession');
      throw new Error('세션 만료');
    }

    // 🔥 사용자 정보 조회
    const user = MOCKDATA.mockUserData.find((u) => u.mmemId === userId);

    if (!user) {
      console.log('❌ 사용자 정보 없음');
      throw new Error('세션 만료');
    }

    // 🔥 BACK_USER_API와 동일한 응답 구조
    return {
      success: true,
      data: {
        user: {
          loginId: user.mmemId,
          nick: user.mmemNick,
          ppnt: user.mmemPnt,
          // 세션 검증 시에도 기본 정보만 제공
        },
      },
    };
  } catch (error) {
    console.log('❌ Mock 세션 파싱 에러');
    sessionStorage.removeItem('mockSession');
    throw new Error('세션 만료');
  }
};

//? 이메일 인증코드 발송 API - 백엔드와 동일한 구조
const sendVerificationEmail = async (email) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log('📧 Mock 이메일 인증코드 발송:', email);

  return {
    success: true,
    message: '인증코드가 발송되었습니다.',
  };
};

//? 이메일 인증코드 확인 API - 백엔드와 동일한 구조
const verifyEmailCode = async (email, code) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log('🔐 Mock 이메일 인증코드 확인:', email, code);

  // Mock에서는 항상 성공
  return {
    success: true,
    message: '이메일 인증이 완료되었습니다.',
  };
};

//? 아이디 중복 확인 API - 백엔드와 동일한 구조
const checkIdDuplicate = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const exists = MOCKDATA.mockUserData.some((u) => u.mmemId === id);

  // 🔥 BACK_USER_API와 동일한 응답 구조
  return {
    success: true,
    available: !exists,
    message: exists ? '이미 사용 중 아이디' : '사용 가능 아이디',
  };
};

//? 닉네임 중복 확인 API - 백엔드와 동일한 구조
const checkNicknameDuplicate = async (nickname) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const exists = MOCKDATA.mockUserData.some((u) => u.mmemNick === nickname);

  // 🔥 BACK_USER_API와 동일한 응답 구조
  return {
    success: true,
    available: !exists,
    message: exists ? '이미 사용중 닉네임' : '사용 가능 닉네임',
  };
};

//? 회원정보 수정 API - 세션 기반으로 사용자 식별
const updateUserInfo = async (userId, updateData, currentPassword) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 🔥 세션에서 현재 로그인 사용자 확인
  const mockSession = sessionStorage.getItem('mockSession');
  if (!mockSession) {
    throw new Error('로그인이 필요합니다.');
  }

  const sessionData = JSON.parse(mockSession);
  const currentUserId = sessionData.userId;

  // 🔥 요청한 userId와 세션의 userId가 일치하는지 확인
  if (currentUserId !== userId) {
    throw new Error('권한이 없습니다.');
  }

  const userIndex = MOCKDATA.mockUserData.findIndex((u) => u.mmemId === userId);

  if (userIndex === -1) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  const user = MOCKDATA.mockUserData[userIndex];

  // 현재 비밀번호 확인
  if (user.mmemPw !== currentPassword) {
    throw new Error('현재 비밀번호가 올바르지 않습니다.');
  }

  // 닉네임 중복 확인 (변경하는 경우에만)
  if (updateData.nickname && updateData.nickname !== user.mmemNick) {
    const nicknameExists = MOCKDATA.mockUserData.some(
      (u) => u.mmemNick === updateData.nickname && u.mmemId !== userId,
    );

    if (nicknameExists) {
      throw new Error('이미 사용중인 닉네임입니다.');
    }
  }

  // 정보 업데이트
  const updatedUser = { ...user };

  if (updateData.nickname) {
    updatedUser.mmemNick = updateData.nickname;
  }

  if (updateData.password) {
    updatedUser.mmemPw = updateData.password;
  }

  if (updateData.profilePhoto !== undefined) {
    updatedUser.mmemPphoto = updateData.profilePhoto;
  }

  MOCKDATA.mockUserData[userIndex] = updatedUser;

  // 🔥 BACK_USER_API와 동일한 응답 구조
  return {
    success: true,
    message: '회원정보가 수정되었습니다.',
    data: {
      user: {
        loginId: updatedUser.mmemId,
        nick: updatedUser.mmemNick,
        ppnt: updatedUser.mmemPnt,
        regd: updatedUser.mmemRegd,
        bir: updatedUser.mmemBir,
        pphoto: updatedUser.mmemPphoto,
      },
    },
  };
};

//? 회원탈퇴 API - 세션 기반으로 사용자 식별 (password만 파라미터)
const deleteAccount = async (password) => {
  await new Promise((resolve) => setTimeout(resolve, 700));

  // 🔥 세션에서 현재 로그인 사용자 확인
  const mockSession = sessionStorage.getItem('mockSession');
  if (!mockSession) {
    throw new Error('로그인이 필요합니다.');
  }

  const sessionData = JSON.parse(mockSession);
  const currentUserId = sessionData.userId;

  const user = MOCKDATA.mockUserData.find((u) => u.mmemId === currentUserId);

  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  if (user.mmemPw !== password) {
    throw new Error('비밀번호가 올바르지 않습니다.');
  }

  // 사용자 삭제
  const userIndex = MOCKDATA.mockUserData.findIndex((u) => u.mmemId === currentUserId);
  if (userIndex !== -1) {
    MOCKDATA.mockUserData.splice(userIndex, 1);
  }

  // 🔥 세션 삭제 (로그아웃 처리)
  sessionStorage.removeItem('mockSession');
  console.log('🔥 Mock 세션 삭제 (회원탈퇴)');

  // 🔥 BACK_USER_API와 동일한 응답 구조
  return {
    success: true,
    message: '회원탈퇴 완료.',
  };
};

//? 사용자 정보 조회 API - 세션 기반 검증 추가
const getUserInfo = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  // 🔥 세션에서 현재 로그인 사용자 확인
  const mockSession = sessionStorage.getItem('mockSession');
  if (!mockSession) {
    throw new Error('로그인이 필요합니다.');
  }

  const sessionData = JSON.parse(mockSession);
  const currentUserId = sessionData.userId;

  // 🔥 요청한 userId와 세션의 userId가 일치하는지 확인
  if (currentUserId !== userId) {
    throw new Error('권한이 없습니다.');
  }

  const user = MOCKDATA.mockUserData.find((u) => u.mmemId === userId);

  if (!user) {
    throw new Error('사용자 정보 찾을 수 없음');
  }

  // 🔥 BACK_USER_API와 동일한 응답 구조
  return {
    success: true,
    data: {
      user: {
        loginId: user.mmemId,
        nick: user.mmemNick,
        ppnt: user.mmemPnt,
        regd: user.mmemRegd,
        bir: user.mmemBir,
        pphoto: user.mmemPphoto,
      },
    },
  };
};

//? 로그아웃 API - sessionStorage에서 세션 삭제
const logout = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 🔥 Mock 세션 삭제 (실제 백엔드의 session.invalidate()와 동일)
  sessionStorage.removeItem('mockSession');
  console.log('🚪 Mock 세션 삭제 (로그아웃)');

  // 🔥 BACK_USER_API와 동일한 응답 구조
  return {
    success: true,
    message: '로그아웃',
  };
};

//? 비밀번호 확인 API - 세션 기반 검증 추가
const verifyPassword = async (userId, password) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 🔥 세션에서 현재 로그인 사용자 확인
  const mockSession = sessionStorage.getItem('mockSession');
  if (!mockSession) {
    throw new Error('로그인이 필요합니다.');
  }

  const sessionData = JSON.parse(mockSession);
  const currentUserId = sessionData.userId;

  // 🔥 요청한 userId와 세션의 userId가 일치하는지 확인
  if (currentUserId !== userId) {
    throw new Error('권한이 없습니다.');
  }

  const user = MOCKDATA.mockUserData.find((u) => u.mmemId === userId);

  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  if (user.mmemPw !== password) {
    throw new Error('비밀번호가 올바르지 않습니다.');
  }

  // 🔥 BACK_USER_API와 동일한 응답 구조
  return {
    success: true,
    message: '비밀번호 확인이 완료되었습니다.',
  };
};

// ✅ BACK_USER_API와 100% 동일한 구조로 export
const MOCK_USER_API = {
  login,
  register,
  verifyUser,
  sendVerificationEmail,
  verifyEmailCode,
  checkIdDuplicate,
  checkNicknameDuplicate,
  updateUserInfo,
  deleteAccount,
  getUserInfo,
  logout,
  verifyPassword,
};

export default MOCK_USER_API;
