// src/route/AppRouter.jsx
// 🔥 단순화된 AppRouter - ProtectedRoute 없이

import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import DiaryPage from '../pages/DiaryPage.jsx';
import ChallengePage from '../pages/ChallengePage.jsx';
import AccountBookPage from '../pages/AccountBookPage.jsx';
import UserPage from '../pages/UserPage.jsx';
import SubscriptionPage from '../pages/SubscriptionPage.jsx';
import WithdrawalPage from '../pages/WithdrawalPage.jsx';
import ModifyUserPage from '../pages/ModifyUserPage.jsx';
import LoginRequiredPage from '../pages/LoginRequiredPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import useAuth from '../contexts/useAuth.jsx';
import { ROUTES } from '../route/routes.js';

const LoadingScreen = ({ message = '로딩 중...' }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif',
    }}
  >
    <div
      style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '90%',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e3e3e3',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px',
        }}
      />
      <div
        style={{
          fontSize: '18px',
          color: '#333',
          marginBottom: '8px',
          fontWeight: '500',
        }}
      >
        {message}
      </div>
      <div
        style={{
          fontSize: '14px',
          color: '#666',
        }}
      >
        잠시만 기다려주세요...
      </div>
    </div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function AppRouter() {
  const { isAuthenticated, loading, initialCheckDone } = useAuth();

  // 🔥 초기 체크가 완료되지 않았으면 로딩
  if (!initialCheckDone) {
    return <LoadingScreen message="앱 초기화 중..." />;
  }

  // 🔥 로딩 중이면 로딩 화면
  if (loading) {
    return <LoadingScreen message="로그인 처리 중..." />;
  }

  return (
    <Routes>
      {/* 🟢 퍼블릭 라우트 - 로그인 페이지 */}
      <Route
        path={ROUTES.LOGIN}
        element={isAuthenticated ? <Navigate to={ROUTES.ROOT} replace /> : <LoginPage />}
      />

      {/* 🔑 로그인 필요 페이지 */}
      <Route path="/login-required" element={<LoginRequiredPage />} />

      {/* 🔒 인증이 필요한 라우트들 */}
      {isAuthenticated ? (
        <>
          {/* ===== 레이아웃 없는 페이지들 ===== */}
          <Route path={ROUTES.USER} element={<UserPage />} />
          <Route path={ROUTES.WITHDRAWAL} element={<WithdrawalPage />} />
          <Route path={ROUTES.MODIFY_USER} element={<ModifyUserPage />} />

          {/* ===== 레이아웃 있는 페이지들 ===== */}
          <Route
            path={ROUTES.ROOT}
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />

          <Route
            path={ROUTES.DIARY}
            element={
              <Layout>
                <DiaryPage />
              </Layout>
            }
          />

          <Route
            path={ROUTES.CHALLENGE}
            element={
              <Layout>
                <ChallengePage />
              </Layout>
            }
          />

          <Route
            path={ROUTES.ACCOUNT_BOOK}
            element={
              <Layout>
                <AccountBookPage />
              </Layout>
            }
          />

          <Route
            path={ROUTES.SUBSCRIPTION}
            element={
              <Layout>
                <SubscriptionPage />
              </Layout>
            }
          />

          {/* ===== 404 페이지 ===== */}
          <Route path="*" element={<NotFoundPage />} />
        </>
      ) : (
        /* 🚫 인증되지 않은 경우 - 로그인 필요 페이지로 */
        <Route path="*" element={<LoginRequiredPage />} />
      )}
    </Routes>
  );
}

export default AppRouter;
