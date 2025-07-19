import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import ProtectedRoute from '../route/ProtectedRoute';
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import DiaryPage from '../pages/DiaryPage.jsx';
import ChallengePage from '../pages/ChallengePage.jsx';
import AccountBookPage from '../pages/AccountBookPage.jsx';
import UserPage from '../pages/UserPage.jsx';
import SubscriptionPage from '../pages/SubscriptionPage.jsx';
import { ROUTES } from '../route/routes.js';
import WithdrawalPage from '../pages/WithdrawalPage.jsx';
import ModifyUserPage from '../pages/ModifyUserPage.jsx';

function AppRouter() {
  return (
    <Routes>
      {/* 레이아웃(사이드바) X, 토큰 없는 경우 가능한 페이지 */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* 레이아웃 X, 토큰 있는 경우 가능한 페이지 */}
      <Route
        path={ROUTES.USER}
        element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.WITHDRAWAL}
        element={
          <ProtectedRoute>
            <WithdrawalPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.MODIFY_USER}
        element={
          <ProtectedRoute>
            <ModifyUserPage />
          </ProtectedRoute>
        }
      />

      {/* 레이아웃 O, 토큰 있는 경우 가능한 페이지 */}
      <Route
        path={ROUTES.ROOT}
        element={
          <ProtectedRoute>
            <Layout>
              <HomePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.DIARY}
        element={
          <ProtectedRoute>
            <Layout>
              <DiaryPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.CHALLENGE}
        element={
          <ProtectedRoute>
            <Layout>
              <ChallengePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.ACCOUNT_BOOK}
        element={
          <ProtectedRoute>
            <Layout>
              <AccountBookPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.SUBSCRIPTION}
        element={
          <ProtectedRoute>
            <Layout>
              <SubscriptionPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 404 페이지 */}
      <Route path="*" element={<div>페이지를 찾을 수 없습니다</div>} />
    </Routes>
  );
}

export default AppRouter;
