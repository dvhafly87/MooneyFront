import { Routes, Route } from 'react-router-dom';
import Layout from '@components/Layout.jsx';
import HomePage from '@pages/HomePage.jsx';
import LoginPage from '@pages/LoginPage.jsx';
import DiaryPage from '@pages/DiaryPage.jsx';
import ChallengePage from '@pages/ChallengePage.jsx';
import AccountBookPage from '@pages/AccountBookPage.jsx';
import UserPage from '@pages/UserPage.jsx';
import SubscriptionPage from '@pages/SubscriptionPage.jsx';
import Setting from '@pages/Setting.jsx';
import { ROUTES } from '@route/routes.js';

function AppRouter() {
  return (
    <Routes>
      {/* Layout 없는 페이지들- 사이드바 없는 것 */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.USER} element={<UserPage />} />
      <Route path={ROUTES.SETTING} element={<Setting />} />

      {/* Layout이 있는 페이지들- 사이드바 있는 것 */}
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

      {/* 404 페이지 */}
      <Route path="*" element={<div>페이지를 찾을 수 없음</div>} />
    </Routes>
  );
}

export default AppRouter;
