
import MOCKDATA from '../../assets/mockData.js';

//? 로그인, 회원가입, 토큰 검증, 이메일 인증코드 보내기, 이메일 받은 인증코드 검증, 아이디 중복검사, 닉네임 중복검사,
//? 회원정보 수정, 회원탈퇴, 회원정보 가져오기, 로그아웃

// 로그인 mockAPI
const login = async (credentials) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { id, password } = credentials;

  const user = MOCKDATA.mockUserData.find((u) => u.mmemId === id && u.mmemPw === password);

  if (!user) {
    console.log('로그인 에러가 났다');
    throw new Error('아이디 or 비번 틀림');
  }

  // JWT 토큰 생성 시뮬레이션
  const mockJwtToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
    JSON.stringify({
      sub: user.id,
      nickname: user.nickname,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24시간
    }),
  )}.mock_signature_${Date.now()}`;

  return {
    success: true,
    message: '로그인 성공',
    data: {
      token: mockJwtToken,
      user: {
        id: user.mmemId,
        nick: user.mmemNick,
        ppnt: user.mmemPnt,
        regd: user.mmemRegd,
        bir: user.mmemBir,
        pphoto: user.mmemPphoto,
      },
    },
  };
};

// 회원가입 mockAPI
const register = async (userData) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { id, nickname, password, birthDate } = userData;

  // 중복 검사
  const existingUser = MOCKDATA.mockUserData.find(
    (u) => u.mmemId === id && u.mmemNick === nickname,
  );

  if (existingUser) {
    if (existingUser.id === id) {
      throw new Error('이미 존재하는 ID');
    }
    if (existingUser.nick === nickname) {
      throw new Error('이미 존재하는 nick');
    }
  }

  const newUser = {
    id: id,
    pw: password,
    nick: nickname,
    pphoto: null,
    regd: new Date().toISOString(),
    bir: birthDate,
    ppnt: 100,
  };

  MOCKDATA.mockUserData.push(newUser);

  return {
    success: true,
    message: '회원가입 완료',
    data: { userId: newUser.id },
  };
};

// 토큰 검증
const verifyToken = async (token) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!token || !token.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')) {
    throw new Error('토큰 유효X');
  }

  try {
    // JWT 메이로등 디코딩
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));

    // 토큰 만료 확인
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('토큰 만료됨');
    }

    // 사용자 정보 조회
    const user = MOCKDATA.mockUserData.find((u) => u.id === payload.sub);

    if (!user) {
      throw new Error('사용자를 찾을 수 없음');
    }

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          nick: user.nick,
          points: user.ppnt,
          registeredDate: user.regd,
          birthDate: user.bir,
          profilePhoto: user.pphoto,
        },
      },
    };
  } catch (error) {
    throw new Error('토큰 검증 실패 ', error);
  }
};

const sendVerificationEmail = async (email) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('올바른 이메일 형식이 아닙니다.');
  }

  // 인증 코드 생성
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  // 인증 코드 임시 저장
  const verificationData = {
    email: email,
    code: verificationCode.toString(),
    createdAt: new Date().getTime(),
    expiresAt: new Date().getTime() + 5 * 60 * 1000, // 5분 후에 만료
  };

  // 저장소에 저장 (실제 환경에선 메모리에 사용)
  if (!window.mockVerificationCodes) {
    window.mockVerificationCodes = [];
  }

  // 기존 코드 삭제 후 새 코드 저장
  window.mockVerificationCodes = window.mockVerificationCodes.filter((v) => v.email !== email);
  window.mockVerificationCodes.push(verificationData);

  console.log(`Mock 이메일 인증코드 ${verificationCode}(실제는 이메일로 전송)`);

  return {
    success: true,
    message: '인증코드 전송',
    __dev_code: verificationCode, // 인증코드 (실제 출력은 하면 안됨)
  };
};

// 이메일 인증코드 확인 USER_API
const verifyEmailCode = async (email, code) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!window.mockVerificationCodes) {
    throw new Error('발송된 인증코드 X');
  }

  // 해당 이메일의 인증 코드 찾기
  const verification = window.mockVerificationCodes.find((v) => v.email === email);

  if (!verification) {
    throw new Error('인증 코드를 먼저 요청');
  }

  // 인증 시간 만료 확인
  if (new Date().getTime() > verification.expiresAt) {
    // 만료된 코드 삭제 (코드 상으로 인증코드 여러번 보냈을 때, 처음 코드가 만료되면 그 뒤에 거 다 사라지는 상황 되긴함)
    window.mockVerificationCodes = window.mockVerificationCodes.filter((v) => v.email !== email);
    throw new Error('인증코드 만료');
  }

  if (verification.code !== code.toString()) {
    throw new Error('인증코드 올바르지 않음');
  }

  window.mockVerificationCodes = window.mockVerificationCodes.filter((v) => v.email !== email);

  return {
    success: true,
    message: '이메일 인증 완료',
  };
};

// 아이디 중복 확인
const checkIdDuplicate = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const exists = MOCKDATA.mockUserData.some((u) => u.mmemId === id);

  return {
    success: true,
    available: !exists,
    message: exists ? '이미 존재하는 아이디' : '사용 가능한 아이디',
  };
};

// 닉네임 중복 확인
const checkNicknameDuplicate = async (nickname) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const exists = MOCKDATA.mockUserData.some((u) => u.mmemNick === nickname);

  return {
    success: true,
    available: !exists,
    message: exists ? '이미 사용중인 닉네임' : '사용 가능한 닉네임',
  };
};

// 회원정보 수정
const updateUserInfo = async (userId, updateData) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 사용자 찾기
  const userIndex = MOCKDATA.mockUserData.findIndex((u) => u.mmemId === userId);

  if (userIndex === -1) {
    throw new Error('사용자를 찾을 수 없음');
  }

  const user = MOCKDATA.mockUserData[userIndex];

  // 닉네임 중복 확인 (현재 사용자 제외)
  if (updateData.nickname && updateData.nickname !== user.nick) {
    const nicknameExists = MOCKDATA.mockUserData.some(
      (u) => u.mmemNick === updateData.nickname && u.mmemId !== userId,
    );

    if (nicknameExists) {
      throw new Error('이미 사용중인 닉네임입니다');
    }
  }

  // 사용자 정보 업데이트
  const updatedUser = { ...user };

  if (updateData.nickname) {
    updatedUser.nick = updateData.nickname;
  }

  if (updateData.password) {
    updatedUser.pw = updateData.password;
  }

  if (updateData.profilePhoto !== undefined) {
    updatedUser.pphoto = updateData.profilePhoto;
  }

  // Mock 데이터 업데이트
  MOCKDATA.mockUserData[userIndex] = updatedUser;

  console.log(`회원정보 수정 완료: ${userId}`, updatedUser);

  return {
    success: true,
    message: '회원정보가 성공적으로 수정되었습니다',
    data: {
      user: {
        id: updatedUser.id,
        nick: updatedUser.nick,
        ppnt: updatedUser.ppnt,
        regd: updatedUser.regd,
        bir: updatedUser.bir,
        pphoto: updatedUser.pphoto,
      },
    },
  };
};

// 회원탈퇴
const deleteAccount = async (userId, password) => {
  await new Promise((resolve) => setTimeout(resolve, 700));

  // 사용자 찾기
  const userIndex = MOCKDATA.mockUserData.findIndex((u) => u.mmemId === userId);

  if (userIndex === -1) {
    throw new Error('사용자 찾을 수 없음');
  }

  const user = MOCKDATA.mockUserData[userIndex];

  // 비밀번호 확인
  if (user.pw !== password) {
    throw new Error('비밀번호 올바르지 않음');
  }

  // 사용자 데이터 삭제
  MOCKDATA.mockUserData.splice(userIndex, 1);

  // 관련 데이터도 삭제
  MOCKDATA.mockExpenseData = MOCKDATA.mockExpenseData.filter((exp) => exp.mexpMmemId !== userId);

  console.log(`회원탈퇴 완료: ${userId}`);

  return {
    success: true,
    message: '회원탈퇴 완료',
  };
};

// 사용자 정보 조회
const getUserInfo = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const user = MOCKDATA.mockUserData.find((u) => u.mmemId === userId);

  if (!user) {
    throw new Error('사용자 찾을 수 없음');
  }

  return {
    success: true,
    data: {
      user: {
        id: user.id,
        nickname: user.nick,
        points: user.ppnt,
        registeredDate: user.regd,
        birthDate: user.bir,
        profilePhoto: user.pphoto,
      },
    },
  };
};

const logout = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    success: true,
    message: '로그아웃 되었음',
  };
};

// 현재 로그인한 사용자의 비밀번호 확인
const verifyPassword = async (userId, password) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 사용자 찾기
  const user = MOCKDATA.mockUserData.find((u) => u.mmemId === userId);

  if (!user) {
    throw new Error('사용자를 찾을 수 없음');
  }

  // 비밀번호 확인
  if (user.pw !== password) {
    throw new Error('비밀번호가 올바르지 않습니다');
  }

  return {
    success: true,
    message: '비밀번호 확인 완료',
  };
};

const USER_API = {
  // 로그인 관련 mock api
  login,
  register,
  verifyToken,
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

export default USER_API;
