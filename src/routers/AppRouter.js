// src/routers/AppRouter.js
import Login from '../pages/Login';
import Dashboard from '../pages/DashBoard';
import Challenge from '../pages/Challenge';
import Diary from '../pages/Diary';

// 라우트 경로 상수
export const ROUTES = {
  LOGIN: '/login',
  CHALLENGE: '/challenge',
  DIARY: '/diary',
  ROOT: '/',
};

// 라우트 설정 배열
export const routeConfigs = [
  {
    path: '/login',
    element: Login,
  },
  {
    path: '/',
    element: Dashboard,
  },
  {
    path: '/challenge',
    element: Challenge,
  },
  {
    path: '/diary',
    element: Diary,
  },
];
