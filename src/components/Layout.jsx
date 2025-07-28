// src/components/Layout.jsx
import { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import MenuIcon from '../img/Menu_Icon.png';

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
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#fafafa',
      }}
    >
      <img
        src={MenuIcon}
        alt="Menu"
        onClick={ToggleSidebar}
        style={{
          position: 'fixed',
          top: '25px',
          left: '25px',
          width: '32px',
          height: '32px',
          zIndex: 1100,
          cursor: 'pointer',
        }}
      />
      {/* 사이드바 */}
      <Sidebar
        isOpen={isSidebarOpen}
        onOpenNotification={OpenNotificationPanel}
        isNotificationPanelOpen={isNotificationPanelOpen}
        onCloseNotification={CloseNotificationPanel}
        notificationRef={notificationRef}
      />

      {/* 메인 컨텐츠 */}
      <div
        style={{
          marginLeft: isSidebarOpen ? '260px' : '0',
          flex: 1,
          transition: 'margin-left 0.3s ease',
          paddingTop: '50px',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default Layout;
