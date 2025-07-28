// src/contexts/AuthContext.jsx
// 🔥 CORS 문제 해결 - URL 통일

import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import BACK_USER_API from '../services/back/userApi.js';

const AuthContext = createContext();

// 🔥 서버 URL 통일 - 환경 변수 사용
const SERVER_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7474';

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
    case 'SET_INITIAL_CHECK_DONE':
      return { ...state, initialCheckDone: true };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
    initialCheckDone: false, // 🔥 이것만 추가
  });

  // 🔥 세션 체크 함수 - URL 통일
  const checkSession = useCallback(async () => {
    const savedLoginState = localStorage.getItem('isYouLogined');

    if (!savedLoginState) {
      dispatch({ type: 'LOGOUT' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    let parsedState = {};

    if (savedLoginState) {
      parsedState = JSON.parse(savedLoginState);
      console.log(parsedState);
      // 출력: { nick: "고먐미", id: "hhhh234", point: 0 }

      console.log(parsedState.nick); // 고먐미
    } else {
      console.log('로그인 상태가 저장되어 있지 않습니다.');
    }

    try {
      const parsedData = JSON.parse(savedLoginState);
      // 🔥 통일된 SERVER_URL 사용

      const response = await fetch(`${SERVER_URL}/do.logincheck`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          regid: parsedState.id,
        }),
      });

      const result = await response.json();

      if (result.isLogined && result.sessionValid) {
        // 🔥 세션 유효 - 사용자 상태 업데이트
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: {
              loginId: result.userInfo.id,
              nick: result.userInfo.nick,
              ppnt: result.userInfo.point,
            },
          },
        });
        console.log('세션 연장: ', result.userInfo);
      } else {
        // 🔥 세션 무효 - 로그아웃 처리
        // handleLogout();
        console.log('세션 무효 - 로그아웃 처리');
      }
    } catch (error) {
      console.error('세션 체크 에러: ', error);
      handleLogout();
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_INITIAL_CHECK_DONE' }); // 🔥 이것만 추가
    }
  }, []);

  // 🔥 로그인 함수 - URL 통일
  const loginHandler = async (credentials) => {
    const logindata = {
      loginId: credentials.id,
      loginPw: credentials.password,
    };

    dispatch({ type: 'LOGIN_START' });

    try {
      console.log('🚀 로그인 요청 URL:', `${SERVER_URL}/do.login`);

      // 🔥 통일된 SERVER_URL 사용
      const response = await fetch(`${SERVER_URL}/do.login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(logindata),
      });

      console.log('📡 응답 상태:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ 로그인 응답:', result);

      if (result.isLogined) {
        // 🔥 로그인 성공 - localStorage에 토큰 저장
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: {
              loginId: result.userInfo.id,
              nick: result.userInfo.nick,
              ppnt: result.userInfo.point,
            },
          },
        });

        localStorage.setItem('isYouLogined', JSON.stringify(result.userInfo));
        toast.success(`${result.userInfo.nick}님, 환영합니다! 🎉`);
        return { success: true, user: result.userInfo };
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: '로그인 실패' });
        toast.error('로그인에 실패했습니다.');
        return { success: false, message: '로그인 실패' };
      }
    } catch (error) {
      console.error('❌ 로그인 오류:', error);
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });

      // 🔥 CORS 에러인지 확인
      if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        toast.error('서버 연결에 실패했습니다. CORS 설정을 확인해주세요.');
      } else {
        toast.error('로그인 중 오류가 발생했습니다.');
      }

      return { success: false, message: error.message };
    }
  };

  // 🔥 로그아웃 함수 - URL 통일
  const handleLogout = async () => {
    try {
      // 🔥 통일된 SERVER_URL 사용
      await fetch(`${SERVER_URL}/do.logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
    }

    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('isYouLogined');
    toast.info('로그아웃되었습니다.');
  };

  // 🔥 회원가입 함수
  const registerHandler = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const result = await BACK_USER_API.register(userData);

      if (result.success) {
        toast.success(result.message);
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 🔥 중복 확인 함수들
  const checkIdDuplicateHandler = async (id) => {
    try {
      const result = await BACK_USER_API.checkIdDuplicate(id);
      return result;
    } catch (error) {
      toast.error('아이디 중복 확인 중 오류가 발생했습니다.');
      return { success: false, available: false, message: error.message };
    }
  };

  const checkNicknameDuplicateHandler = async (nickname) => {
    try {
      const result = await BACK_USER_API.checkNicknameDuplicate(nickname);
      return result;
    } catch (error) {
      toast.error('닉네임 중복 확인 중 오류가 발생했습니다.');
      return { success: false, available: false, message: error.message };
    }
  };

  // 🔥 기타 함수들 (간단하게 구현)
  const updateUserInfoHandler = async (updateData, currentPassword) => {
    if (!state.user) {
      toast.error('로그인이 필요합니다.');
      return { success: false, error: '로그인이 필요합니다.' };
    }

    try {
      const result = await BACK_USER_API.updateUserInfo(
        state.user.loginId,
        updateData,
        currentPassword,
      );

      if (result.success) {
        dispatch({
          type: 'UPDATE_USER',
          payload: result.data.user,
        });
        toast.success(result.message);
        return { success: true, user: result.data.user };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const deleteAccountHandler = async (password) => {
    if (!state.user) {
      toast.error('로그인이 필요합니다.');
      return { success: false, error: '로그인이 필요합니다.' };
    }

    try {
      const result = await BACK_USER_API.deleteAccount(password);

      if (result.success) {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('isYouLogined');
        toast.success(result.message);
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const refreshUserInfo = async () => {
    if (!state.user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    try {
      console.log('mzmxmzmzmzm');
      const result = await BACK_USER_API.getUserInfo(state.user.loginId);

      if (result.success) {
        dispatch({
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

  const verifyPasswordHandler = async (password) => {
    if (!state.user) {
      toast.error('로그인이 필요합니다.');
      return { success: false, error: '로그인이 필요합니다.' };
    }

    try {
      const result = await BACK_USER_API.verifyPassword(state.user.loginId, password);
      return result;
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // 🔥 컴포넌트 마운트 시 세션 체크 (레퍼런스와 동일)
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // 🔥 로그인 상태일 때만 주기적 세션 체크 (5분마다)
  useEffect(() => {
    let interval;

    if (state.isAuthenticated) {
      interval = setInterval(checkSession, 5 * 60 * 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isAuthenticated, checkSession]);

  // 🔥 브라우저 탭 간 로그아웃 동기화 (레퍼런스와 동일)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'isYouLogined') {
        if (event.newValue === null) {
          dispatch({ type: 'LOGOUT' });
          console.log('다른 탭에서 로그아웃됨');
        } else if (event.newValue && !state.isAuthenticated) {
          checkSession();
          console.log('다른 탭에서 로그인됨');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [state.isAuthenticated, checkSession]);

  // 🔥 페이지 포커스 시 세션 체크 (레퍼런스와 동일)
  useEffect(() => {
    const handleFocus = () => {
      if (state.isAuthenticated) {
        checkSession();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [state.isAuthenticated, checkSession]);

  // 🔥 checkUserAuth 함수 - ProtectedRoute용 (즉시 체크하지 않음)
  const checkUserAuth = async () => {
    // localStorage에 정보가 있으면 인증된 것으로 간주
    const savedLoginState = localStorage.getItem('isYouLogined');
    return !!savedLoginState && state.isAuthenticated;
  };

  const contextValue = {
    // 상태
    ...state,

    // 인증 관련 함수들
    login: loginHandler,
    register: registerHandler,
    logout: handleLogout,
    checkUserAuth,

    // 중복 확인 함수들
    checkIdDuplicate: checkIdDuplicateHandler,
    checkNicknameDuplicate: checkNicknameDuplicateHandler,

    // 회원정보 관리 함수들
    updateUserInfo: updateUserInfoHandler,
    deleteAccount: deleteAccountHandler,
    refreshUserInfo,
    verifyPassword: verifyPasswordHandler,

    // 유틸리티 함수들
    clearError,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthContext;
