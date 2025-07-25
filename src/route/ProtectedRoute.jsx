import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../contexts/useAuth.jsx';
import { toast } from 'react-toastify';
import { ROUTES } from '../route/routes';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkUserAuth, loading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  // 🔥 useRef로 최신 함수 참조 유지 (무한루프 방지)
  const checkUserAuthRef = useRef(checkUserAuth);

  // 🔥 함수가 변경될 때마다 ref 업데이트
  useEffect(() => {
    checkUserAuthRef.current = checkUserAuth;
  }, [checkUserAuth]);

  // 🔥 컴포넌트 마운트 시 세션 검증 (한 번만 실행)
  useEffect(() => {
    const verifySession = async () => {
      setIsChecking(true);
      try {
        const isValid = await checkUserAuthRef.current(); // ref 사용
        if (!isValid) {
          console.log('세션 없음 - 로그인 페이지로 이동');
        }
      } catch (error) {
        console.error('세션 검증 중 오류:', error);
      } finally {
        setIsChecking(false);
      }
    };

    verifySession();
  }, []); // 🔥 빈 배열 - 마운트 시 한 번만 실행

  // 🔥 페이지 이동할 때마다 세션 체크 (이미 인증된 경우에만)
  useEffect(() => {
    if (isAuthenticated && !isChecking) {
      checkUserAuthRef.current().then((isValid) => {
        // ref 사용
        if (!isValid) {
          toast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
        }
      });
    }
  }, [isAuthenticated, location.pathname, isChecking]); // 🔥 checkUserAuth 없음 - ESLint 경고 해결

  // 🔥 세션 체크 중이거나 로딩 중일 때
  if (isChecking || loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <div
          style={{
            padding: '20px',
            fontSize: '18px',
            color: '#666',
          }}
        >
          {isChecking ? '세션 확인 중...' : '로딩 중...'}
        </div>
      </div>
    );
  }

  // 🔥 세션이 없거나 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // 🔥 세션이 유효하고 인증된 경우 자식 컴포넌트 렌더링
  return children;
};

export default ProtectedRoute;
