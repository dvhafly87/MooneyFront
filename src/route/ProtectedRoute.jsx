import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../contexts/useAuth.jsx';
import { toast } from 'react-toastify';
import { ROUTES } from '../route/routes';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkTokenExpiry, loading } = useAuth();
  const location = useLocation();

  // 페이지 이동할 때마다 토큰 체크
  useEffect(() => {
    if (isAuthenticated && !checkTokenExpiry()) {
      toast.error('로그인이 만료되었습니다. 다시 로그인해주세요.');
    }
  }, [isAuthenticated, checkTokenExpiry, location.pathname]);

  // 로딩 중일 때
  if (loading) {
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
          로딩 중...
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return children;
};

export default ProtectedRoute;
