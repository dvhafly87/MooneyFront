import { Routes, Route } from 'react-router-dom';
import LoginPage from '@pages/LoginPage';
import UserPage from '@pages/UserPage';
import Setting from '@pages/Setting';
import ChallengePage from '@pages/ChallengePage';
import DiaryPage from '@pages/DiaryPage';
import AccountBookPage from '@pages/AccountBookPage';
import SubscriptionPage from '@pages/SubscriptionPage';
import HomePage from '@pages/HomePage';
import { ROUTES } from './routes';

function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.USER} element={<UserPage />} />
      <Route path={ROUTES.SETTING} element={<Setting />} />
      <Route path={ROUTES.CHALLENGE} element={<ChallengePage />} />
      <Route path={ROUTES.DIARY} element={<DiaryPage />} />
      <Route path={ROUTES.ACCOUNT_BOOK} element={<AccountBookPage />} />
      <Route path={ROUTES.SUBSCRIPTION} element={<SubscriptionPage />} />
      <Route path={ROUTES.ROOT} element={<HomePage />} />

      {/* 404 fallback */}
      <Route path="*" element={<div>페이지를 찾을 수 없습니다</div>} />
    </Routes>
  );
}

export default AppRouter;
