import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { routeConfigs, ROUTES } from './routers/AppRouter';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* 설정 파일에서 라우트 동적 생성 */}
          {routeConfigs.map(({ path, element: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}

          {/* 기본 경로 리다이렉트, 로그인 된 경우 바로 대시보드, 로그인 안된 경우 로그인 창으로 */}
          <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.ROOT} replace />} />

          {/* 404 페이지 */}
          <Route path="*" element={<div>페이지를 찾을 수 없음</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
