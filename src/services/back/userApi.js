const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

//? 로그인 API - 세션 기반 (localStorage 사용 안함)
const login = async (credentials) => {
  const logindata = {
    loginId: credentials.id,
    loginPw: credentials.password,
  };

  try {
    console.log('🚀 로그인 요청 시작:', logindata);

    const response = await fetch(`${SERVER_URL}/do.login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 🔥 쿠키 기반 세션 사용
      body: JSON.stringify(logindata),
    });

    console.log('📡 응답 상태:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ 백엔드 응답:', result);

    if (result.isLogined) {
      // 🔥 세션은 서버에서 자동으로 설정됨 - 클라이언트에서는 저장하지 않음
      return {
        success: true,
        message: '로그인 성공',
        data: {
          user: {
            loginId: result.userInfo.id,
            nick: result.userInfo.nick,
            ppnt: result.userInfo.point,
            // regd: result.userInfo.registeredDate || result.userInfo.regd,
            // bir: result.userInfo.mmemBir || result.userInfo.bir,
            // pphoto: result.userInfo.mmemPphoto || result.userInfo.pphoto,
          },
        },
      };
    } else {
      throw new Error(result.message || '로그인에 실패했습니다.');
    }
  } catch (error) {
    console.error('❌ 로그인 에러:', error);

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('서버 연결 불가능, 백엔드 서버가 실행 확인하쇼');
    }

    throw new Error(error.message || '로그인 실패');
  }
};

//? 회원가입 API
const register = async (userData) => {
  try {
    const formData = new FormData();
    formData.append('id', userData.id);
    formData.append('pw', userData.password);
    formData.append('nick', userData.nickname);
    formData.append('birth', userData.birthDate);

    if (userData.profilePhoto) {
      formData.append('photoTemp', userData.profilePhoto);
    }

    const response = await fetch(`${SERVER_URL}/do.registerpage`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.text();

    if (result === 'ok') {
      return {
        success: true,
        message: '회원가입 완료',
      };
    } else {
      throw new Error('회원가입 실패');
    }
  } catch (error) {
    console.error('회원가입 에러:', error);
    throw new Error(error.message || '회원가입 실패');
  }
};

//? 사용자 세션 검증 API - 서버에서 세션 체크
const verifyUser = async (userId) => {
  try {
    console.log('🔍 세션 검증 시작, userId', userId);

    const response = await fetch(`${SERVER_URL}/do.logincheck`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 🔥 쿠키의 세션 정보로 검증
      body: JSON.stringify({
        regid: userId, // 백엔드에서 RegIdCheck.regid로 받음
      }),
    });

    console.log('📡 세션 검증 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 세션 검증 에러 응답:', errorText);
      throw new Error('세션 유효 X');
    }

    const result = await response.json();
    console.log('✅ 세션 검증 성공:', result);

    // 서버에서 세션이 유효하다고 응답한 경우
    if (result.isLogined && result.sessionValid) {
      return {
        success: true,
        data: {
          user: {
            loginId: result.userInfo.id,
            nick: result.userInfo.nick,
            ppnt: result.userInfo.point,
            // regd: result.userInfo.registeredDate,
            // bir: result.userInfo.mmemBir,
            // pphoto: result.userInfo.mmemPphoto,
          },
        },
      };
    } else {
      throw new Error('세션 만료');
    }
  } catch (error) {
    console.error('❌ 세션 검증 실패:', error);
    throw new Error(error.message || '세션 검증 실패');
  }
};

//? 이메일 인증코드 발송 API
const sendVerificationEmail = async (email) => {
  try {
    const response = await fetch(`${SERVER_URL}/send-email-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      message: result.message || '인증코드가 발송되었습니다.',
    };
  } catch (error) {
    throw new Error(error.message || '이메일 전송에 실패했습니다.');
  }
};

// ?이메일 인증코드 확인 API
const verifyEmailCode = async (email, code) => {
  try {
    const response = await fetch(`${SERVER_URL}/verify-email-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      message: result.message || '이메일 인증이 완료되었습니다.',
    };
  } catch (error) {
    throw new Error(error.message || '이메일 인증에 실패했습니다.');
  }
};

//? 아이디 중복 확인 API
const checkIdDuplicate = async (id) => {
  try {
    const response = await fetch(`${SERVER_URL}/do.Idcheck`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ regid: id }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      available: result.idpossible,
      message: result.idpossible ? '사용 가능 아이디' : '이미 사용 중 아이디',
    };
  } catch (error) {
    throw new Error(error.message || '아이디 중복 확인 실패');
  }
};

//? 닉네임 중복 확인 API
const checkNicknameDuplicate = async (nickname) => {
  try {
    const response = await fetch(`${SERVER_URL}/do.NickCheck`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ regnc: nickname }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      available: result.nickpossible,
      message: result.nickpossible ? '사용 가능 닉네임' : '이미 사용중 닉네임',
    };
  } catch (error) {
    throw new Error(error.message || '닉네임 중복 확인 실패');
  }
};

//? 회원정보 수정 API - 세션 기반
const updateUserInfo = async (userId, updateData, currentPassword) => {
  try {
    // 🔥 FormData 사용 (백엔드가 @RequestParam 사용)
    const formData = new FormData();
    formData.append('eid', userId);
    formData.append('ecurpw', currentPassword);

    if (updateData.nickname) {
      formData.append('enick', updateData.nickname);
    }

    if (updateData.password) {
      formData.append('epw', updateData.password);
    }

    if (updateData.profilePhoto) {
      formData.append('ephoto', updateData.profilePhoto);
    }

    const response = await fetch(`${SERVER_URL}/member.info.edit`, {
      method: 'POST',
      credentials: 'include',
      body: formData, // 🔥 JSON이 아닌 FormData 사용
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.resultD && result.resultD.result) {
      // 수정 후 최신 정보를 다시 조회
      const userInfo = await getUserInfo(userId);
      return {
        success: true,
        message: '회원정보가 수정되었습니다.',
        data: userInfo.data,
      };
    } else {
      throw new Error('회원정보 수정에 실패했습니다.');
    }
  } catch (error) {
    throw new Error(error.message || '회원정보 수정에 실패했습니다.');
  }
};

//? 회원탈퇴 API - 세션 기반
const deleteAccount = async (password) => {
  try {
    const response = await fetch(`${SERVER_URL}/member.exit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 🔥 세션으로 사용자 식별
      body: JSON.stringify({ regid: password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // 🔥 백엔드 응답: { resultD: { result: "탈퇴 완료" } }
    if (result.resultD && result.resultD.result === '탈퇴 완료') {
      return {
        success: true,
        message: '회원탈퇴 완료.',
      };
    } else {
      throw new Error('회원탈퇴 실패');
    }
  } catch (error) {
    throw new Error(error.message || '회원탈퇴 실패');
  }
};

//? 사용자 정보 조회 API - 세션 기반
const getUserInfo = async (userId) => {
  try {
    const response = await fetch(`${SERVER_URL}/do.MeminfoCheck`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 🔥 세션으로 사용자 식별
      body: JSON.stringify({ regid: userId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.Meminfo && result.Meminfo !== 'nothing') {
      return {
        success: true,
        data: {
          user: {
            loginId: result.Meminfo.id,
            nick: result.Meminfo.nick,
            ppnt: result.Meminfo.ppnt,
            regd: result.Meminfo.regd,
            bir: result.Meminfo.bir,
            pphoto: result.Meminfo.pphoto,
          },
        },
      };
    } else {
      throw new Error('사용자 정보 찾을 수 없음');
    }
  } catch (error) {
    throw new Error(error.message || '사용자 정보 조회 실패');
  }
};

//? 로그아웃 API - 세션 기반
const logout = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/do.logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 🔥 세션 삭제를 위해 필요
    });

    if (!response.ok) {
      // 로그아웃은 에러가 나도 성공으로 처리
      return {
        success: true,
        message: '로그아웃',
      };
    }

    const result = await response.json();

    return {
      success: true,
      message: result.message || '로그아웃',
    };
  } catch (error) {
    // 로그아웃은 에러가 나도 성공으로 처리
    return {
      success: true,
      message: '로그아웃되었습니다.',
    };
  }
};

//? 비밀번호 확인 API
const verifyPassword = async (userId, password) => {
  try {
    const response = await fetch(`${SERVER_URL}/verify-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 🔥 세션으로 사용자 식별
      body: JSON.stringify({
        regid: password, // 🔥 RegIdCheck 구조에 맞춰 비밀번호를 regid에 전송
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // 🔥 예상 백엔드 응답: { valid: true/false }
    if (result.valid) {
      return {
        success: true,
        message: '비밀번호 확인이 완료되었습니다.',
      };
    } else {
      throw new Error('비밀번호가 올바르지 않습니다.');
    }
  } catch (error) {
    throw new Error(error.message || '비밀번호 확인에 실패했습니다.');
  }
};

// ✅ API 객체 export
const BACK_USER_API = {
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

export default BACK_USER_API;
