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
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
      }}
    >
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
          flex: 1,
          marginLeft: isSidebarOpen ? '180px' : '0px',
          transition: 'margin-left 0.3s ease',
          backgroundColor: 'lightblue',
          minHeight: '100vh',
          width: `calc(100% - ${isSidebarOpen ? '180px' : '0px'})`,
          position: 'relative',
        }}
      >
        {/* 토글 버튼 */}
        <button
          onClick={ToggleSidebar}
          style={{
            position: 'fixed',
            top: '1rem',
            left: isSidebarOpen ? '190px' : '1rem',
            transition: 'left 0.3s ease',
            zIndex: 1001,
            padding: '8px 12px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          ☰
        </button>

        {/* 실제 페이지 내용 */}
        <div
          style={{
            padding: '60px 20px 20px 20px',
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
