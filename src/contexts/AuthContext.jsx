import React, { createContext, useReducer } from 'react';
import { toast } from 'react-toastify';
import { USER_API } from '../services/apiService.js'; // 🔥 실제 백엔드 API 사용

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
        loading: false,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload }, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const getInitialState = () => {
    // 🔥 Mock 세션 확인 추가
    const mockSession = sessionStorage.getItem('mockSession');

    if (mockSession) {
      try {
        const sessionData = JSON.parse(mockSession);
        // 세션이 유효하면 authenticated 상태로 시작
        return {
          isAuthenticated: true,
          user: { loginId: sessionData.userId }, // 기본 정보만
          loading: false,
          error: null,
        };
      } catch (error) {
        sessionStorage.removeItem('mockSession');
      }
    }

    return {
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    };
  };

  const [state, action] = useReducer(authReducer, getInitialState());

  // 🔥 로그인 함수
  const loginHandler = async (credentials) => {
    action({ type: 'LOGIN_START' });

    try {
      const result = await USER_API.login(credentials);
      console.log('로그인 결과:', result);

      if (result.success) {
        action({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: result.data.user,
          },
        });

        toast.success(`${result.data.user.nick}님, 환영합니다! 🎉`);
        return { success: true, user: result.data.user };
      }
    } catch (error) {
      action({ type: 'LOGIN_FAILURE', payload: error.message });
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // 🔥 회원가입 함수
  const registerHandler = async (userData) => {
    action({ type: 'SET_LOADING', payload: true });

    try {
      const result = await USER_API.register(userData);

      if (result.success) {
        toast.success(result.message);
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      action({ type: 'SET_LOADING', payload: false });
    }
  };

  // 🔥 아이디 중복 확인
  const checkIdDuplicateHandler = async (id) => {
    try {
      const result = await USER_API.checkIdDuplicate(id);
      return result;
    } catch (error) {
      toast.error('아이디 중복 확인 중 오류가 발생했습니다.');
      return { success: false, available: false, message: error.message };
    }
  };

  // 🔥 닉네임 중복 확인
  const checkNicknameDuplicateHandler = async (nickname) => {
    try {
      const result = await USER_API.checkNicknameDuplicate(nickname);
      return result;
    } catch (error) {
      toast.error('닉네임 중복 확인 중 오류가 발생했습니다.');
      return { success: false, available: false, message: error.message };
    }
  };

  // 🔥 회원정보 수정 - userId와 현재 비밀번호 필요
  const updateUserInfoHandler = async (updateData, currentPassword) => {
    if (!state.user) {
      toast.error('로그인이 필요합니다.');
      return { success: false, error: '로그인이 필요합니다.' };
    }

    action({ type: 'SET_LOADING', payload: true });

    try {
      const result = await USER_API.updateUserInfo(state.user.loginId, updateData, currentPassword);

      if (result.success) {
        // 상태 업데이트
        action({
          type: 'UPDATE_USER',
          payload: result.data.user,
        });

        toast.success(result.message);
        return { success: true, user: result.data.user };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      action({ type: 'SET_LOADING', payload: false });
    }
  };

  // 🔥 회원탈퇴 - 비밀번호만 필요 (userId는 세션에서 확인)
  const deleteAccountHandler = async (password) => {
    if (!state.user) {
      toast.error('로그인이 필요합니다.');
      return { success: false, error: '로그인이 필요합니다.' };
    }

    action({ type: 'SET_LOADING', payload: true });

    try {
      const result = await USER_API.deleteAccount(password); // 🔥 userId 파라미터 제거

      if (result.success) {
        // 상태 초기화
        action({ type: 'LOGOUT' });

        toast.success(result.message);
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      action({ type: 'SET_LOADING', payload: false });
    }
  };

  // 🔥 사용자 정보 새로고침 - userId 필요
  const refreshUserInfo = async () => {
    if (!state.user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    try {
      const result = await USER_API.getUserInfo(state.user.loginId);

      if (result.success) {
        // 상태 업데이트
        action({
          type: 'UPDATE_USER',
          payload: result.data.user,
        });

        return { success: true, user: result.data.user };
      }
    } catch (error) {
      console.error('사용자 정보 새로고침 실패:', error);
      return { success: false, error: error.message };
    }
  };

  // 🔥 로그아웃 함수
  const logoutHandler = async () => {
    try {
      // 서버에 로그아웃 요청
      await USER_API.logout();
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
      // 에러가 나도 클라이언트는 로그아웃 처리
    }

    // 상태 초기화
    action({ type: 'LOGOUT' });

    // 사용자에게 알림
    toast.info('로그아웃되었습니다.');
  };

  // 🔥 세션 검증 함수 - userId 필요 (백엔드 요구사항)
  const checkUserAuth = async () => {
    if (!state.user) {
      return false;
    }

    try {
      // 🔥 백엔드에서 userId를 요구하므로 전달
      const response = await USER_API.verifyUser(state.user.loginId);

      if (response.success) {
        // 세션이 유효하면 사용자 정보 업데이트 (최신 정보 반영)
        action({
          type: 'UPDATE_USER',
          payload: response.data.user,
        });
        return true;
      } else {
        // 세션이 무효하면 로그아웃 처리
        if (state.isAuthenticated) {
          action({ type: 'LOGOUT' });
        }
        return false;
      }
    } catch (error) {
      console.error('세션 검증 실패:', error);
      // 세션 검증 실패 시 로그아웃 처리
      if (state.isAuthenticated) {
        action({ type: 'LOGOUT' });
      }
      return false;
    }
  };

  // 🔥 현재 사용자 비밀번호 확인 - userId 필요
  const verifyPasswordHandler = async (password) => {
    if (!state.user) {
      toast.error('로그인이 필요합니다.');
      return { success: false, error: '로그인이 필요합니다.' };
    }

    try {
      const result = await USER_API.verifyPassword(state.user.loginId, password);
      return result;
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // 🔥 에러 클리어
  const clearError = () => {
    action({ type: 'CLEAR_ERROR' });
  };

  const contextValue = {
    // 상태
    ...state,

    // 인증 관련 함수들
    login: loginHandler,
    register: registerHandler,
    logout: logoutHandler,
    checkUserAuth, // 🔥 백엔드 요구사항에 맞춘 세션 검증

    // 중복 확인 함수들
    checkIdDuplicate: checkIdDuplicateHandler,
    checkNicknameDuplicate: checkNicknameDuplicateHandler,

    // 회원정보 관리 함수들
    updateUserInfo: updateUserInfoHandler, // 🔥 currentPassword 파라미터 추가
    deleteAccount: deleteAccountHandler,
    refreshUserInfo,
    verifyPassword: verifyPasswordHandler,

    // 유틸리티 함수들
    clearError,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthContext;
