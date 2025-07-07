import { Routes, Route } from 'react-router-dom';

import NoSidebarPageRouting from './NoSidebarPageRouting.jsx';
import YesSidebarPageRouting from './YesSidebarPageRouting.jsx';

function AppRouter() {
  return (
    <Routes>
      <NoSidebarPageRouting />
      <YesSidebarPageRouting />
    </Routes>
  );
}

export default AppRouter;
