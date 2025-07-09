import { useEffect, useRef, useState } from 'react';
import Sidebar from '@components/Sidebar';

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const notificationRef = useRef(null);

  const ToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const OpenNotificationPanel = () => {
    setIsNotificationPanelOpen(true);
  };

  const CloseNotificationPanel = () => {
    setIsNotificationPanelOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isNotificationPanelOpen &&
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        CloseNotificationPanel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationPanelOpen]);

  return (
    <div style={{ display: 'flex' }}>
      {/* 사이드바 */}
      <Sidebar
        isOpen={isSidebarOpen}
        onOpenNotification={OpenNotificationPanel}
        isNotificationPanelOpen={isNotificationPanelOpen}
        onCloseNotification={CloseNotificationPanel}
        notificationRef={notificationRef}
      />

      {/* mainContent */}
      <div
        style={{
          marginLeft: isSidebarOpen ? '220px' : 0,
          transition: 'margin-left 0.3s ease',
          backgroundColor: 'lightblue',
        }}
      >
        {/* 토글 버튼을 사이드바에 두면 토글시 아예 사라질 수 있음 */}
        <button
          onClick={ToggleSidebar}
          style={{
            position: 'fixed',
            top: '1rem',
            left: isSidebarOpen ? '160px' : '1rem',
            transition: 'left 0.3s ease',
          }}
        >
          ☰
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Layout;
