import { Route } from "react-router-dom";
import LoginPage from "@pages/LoginPage.jsx";
import UserPage from "@pages/UserPage.jsx";
import Setting from "@pages/Setting.jsx";
import { ROUTES } from "@route/routes.js";

export default function NoSidebarPageRouting() {
  return (
    <>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.USER} element={<UserPage />} />
      <Route path={ROUTES.SETTING} element={<Setting />} />
      <Route path="*" element={<div>페이지를 찾을 수 없음</div>} />
    </>
  );
}
