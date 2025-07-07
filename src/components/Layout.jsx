// src/components/Layout.jsx
import React, { useState } from 'react';
import Sidebar from '@components/Sidebar.jsx';

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const ToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div
        style={{
          marginLeft: isSidebarOpen ? '280px' : '0',
          flex: 1,
          padding: '1rem',
          transition: 'margin-left 0.3s ease',
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
        }}
      >
        {/* Toggle Button */}
        <button
          onClick={ToggleSidebar}
          style={{
            position: 'fixed',
            top: '1rem',
            left: isSidebarOpen ? '290px' : '1rem',
            zIndex: 2,
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'left 0.3s ease',
            fontSize: '18px',
          }}
        >
          ☰
        </button>

        <div style={{ marginTop: '60px' }}>{children}</div>
      </div>
    </div>
  );
}

export default Layout;
