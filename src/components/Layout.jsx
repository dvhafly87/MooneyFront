import { useState } from 'react';
import Sidebar from '@components/Sidebar';

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const ToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* 사이드바 */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* mainContent */}
      <div style={{ marginLeft: isSidebarOpen ? '220px' : 0, transition: 'margin-left 0.3s ease' }}>
        {/* 토글 버튼을 사이드바에 두면 토글시 아예 사라질 수 있음 */}
        <button onClick={ToggleSidebar}>☰</button>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Layout;
