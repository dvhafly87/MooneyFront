
import React from 'react';
import {
  FaHome,
  FaWallet,
  FaChartBar,
  FaCalendarAlt,
  FaBook,
  FaEdit,
  FaUser,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@route/routes.js';

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'main', label: '메인', icon: FaHome, path: ROUTES.ROOT },
    {
      id: 'wallet',
      label: '가계부',
      icon: FaWallet,
      path: ROUTES.ACCOUNT_BOOK,
    },
    { id: 'chart', label: '차트', icon: FaChartBar, path: '/chart' },
    { id: 'calendar', label: '달력', icon: FaCalendarAlt, path: '/calendar' },
    { id: 'challenge', label: '챌린지', icon: FaBook, path: ROUTES.CHALLENGE },
    { id: 'diary', label: '소비일기', icon: FaEdit, path: ROUTES.DIARY },
  ];

  const HandleMenuClick = (path) => {
    navigate(path);
  };

  const HandleUserClick = () => {
    navigate(ROUTES.USER);
  };

  const HandleLogout = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <div
      style={{
        width: '280px',
        backgroundColor: '#2c3e50',
        color: 'white',
        height: '100vh',
        padding: '1rem',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1,
      }}
    >
      <h2>Mooney</h2>
      <p>가계부 관리 시스템</p>

      <div style={{ marginTop: '2rem' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <div
              key={item.id}
              onClick={() => HandleMenuClick(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                margin: '5px 0',
                backgroundColor: isActive ? '#3498db' : 'transparent',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '1rem',
          right: '1rem',
        }}
      >
        <div
          onClick={HandleUserClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px',
            margin: '5px 0',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          <FaUser size={16} />
          <span>My page</span>
        </div>

        <div
          onClick={HandleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px',
            margin: '5px 0',
            color: '#e74c3c',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          <FaSignOutAlt size={16} />
          <span>logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
