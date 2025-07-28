// src/components/Sidebar.jsx - 수정된 버전
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../route/routes.js';
import { useState, useEffect, useRef } from 'react';
import useAuth from '../contexts/useAuth.jsx';
import NotificationPanel from '../components/NotificationPanel';
import { motion } from 'framer-motion';

// 이미지 imports
import mainImg from '../img/main.png';
import diaryIcon from '../img/book.png';
import wonImg from '../img/won.png';
import offBellImg from '../img/off_bell.png';
import onBellImg from '../img/on_bell.png';
import pencilImg from '../img/pencil.png';
import chaImg from '../img/challenge.png';
import mypageImg from '../img/mypage.png';
import logoutIcon from '../img/logout.png';

const Sidebar = ({
  isOpen,
  onOpenNotification,
  isNotificationPanelOpen,
  onCloseNotification,
  notificationRef,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const containerRef = useRef(null);
  const [hasNotification, setHasNotification] = useState(true);

  const { height } = useDimensions(containerRef);

  const sidebarMenu = [
    { id: 'notify', label: '알림', icon: hasNotification ? onBellImg : offBellImg },
    { id: 'allExpense', label: '전체수입지출', icon: wonImg, path: ROUTES.ACCOUNT_BOOK },
    { id: 'challenge', label: '챌린지', icon: chaImg, path: ROUTES.CHALLENGE },
    { id: 'diary', label: '다이어리', icon: diaryIcon, path: ROUTES.DIARY },
    { id: 'subscription', label: '구독', icon: pencilImg, path: ROUTES.SUBSCRIPTION },
  ];

  const handleMenuClick = (path, itemId) => {
    // 🔥 사이드바가 닫혀있으면 클릭 무시
    if (!isOpen) return;

    // ✅ 세션 체크 제거 - 바로 이동
    if (itemId === 'notify') {
      onOpenNotification();
    } else if (path) {
      navigate(path); // 바로 이동
    }
  };

  const handleRootClick = () => {
    // 🔥 사이드바가 닫혀있으면 클릭 무시
    if (!isOpen) return;

    // ✅ 세션 체크 제거 - 바로 이동
    navigate(ROUTES.ROOT);
  };

  const handleUserClick = () => {
    // 🔥 사이드바가 닫혀있으면 클릭 무시
    if (!isOpen) return;

    // ✅ 세션 체크 제거 - 바로 이동
    navigate(ROUTES.USER);
  };

  const handleLogout = () => {
    // 🔥 사이드바가 닫혀있으면 클릭 무시
    if (!isOpen) return;

    // ✅ 로그아웃만 확인 후 바로 실행
    if (window.confirm('정말 로그아웃하시겠습니까?')) {
      logout();
    }
  };

  // Animation variants
  const sidebarVariants = {
    open: (height = 1000) => ({
      clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
      transition: {
        type: 'spring',
        stiffness: 30,
        restDelta: 2,
        damping: 30,
      },
    }),
    closed: {
      clipPath: 'circle(0px at 40px 40px)',
      transition: {
        delay: 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 50,
      },
    },
  };

  const navVariants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };

  const headerVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.3,
      },
    },
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const footerVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4,
        duration: 0.3,
      },
    },
    closed: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <>
      <motion.nav
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        custom={height}
        ref={containerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '240px',
          height: '100vh',
          zIndex: 1000,
          // 🔥 핵심 수정: 사이드바가 닫혀있을 때 모든 클릭 이벤트 차단
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {/* Background with circular expansion */}
        <motion.div
          variants={sidebarVariants}
          style={{
            backgroundColor: '#e9ecf2',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '240px',
            boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            height: '100%',
            padding: '30px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Header */}
          <motion.div variants={headerVariants}>
            <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={handleRootClick}>
              <motion.img
                src={mainImg}
                alt="Mooney"
                style={{
                  width: '60px',
                  height: 'auto',
                  marginBottom: '10px',
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              />
              <motion.h2
                style={{ margin: '0 0 10px 0', fontSize: '24px' }}
                whileHover={{ scale: 1.05 }}
              >
                Mooney
              </motion.h2>
            </div>

            <motion.p
              style={{ margin: 0, fontSize: '14px', textAlign: 'center' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Welcome,&nbsp;
              <span style={{ color: '#6B69EE' }}>{user?.nick || '사용자'}</span>
              님!
            </motion.p>
          </motion.div>

          {/* Menu Items */}
          <motion.div variants={navVariants} style={{ flex: 1, marginTop: '30px' }}>
            {sidebarMenu.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, x: 8 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMenuClick(item.path, item.id)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '12px 15px',
                  margin: '8px 0',
                  borderRadius: '10px',
                  transition: 'background-color 0.2s ease',
                  backgroundColor:
                    location.pathname === item.path ? 'rgba(107, 105, 238, 0.1)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(107, 105, 238, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    location.pathname === item.path ? 'rgba(107, 105, 238, 0.1)' : 'transparent';
                }}
              >
                <motion.div
                  style={{
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    backgroundColor: location.pathname === item.path ? '#6B69EE' : '#f0f0f0',
                  }}
                  whileHover={{
                    backgroundColor: location.pathname === item.path ? '#6B69EE' : '#e0e0e0',
                    rotate: 5,
                  }}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    style={{
                      width: '20px',
                      height: '20px',
                      filter: location.pathname === item.path ? 'invert(1)' : 'none',
                    }}
                  />
                </motion.div>
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                    color: location.pathname === item.path ? '#6B69EE' : '#333',
                  }}
                >
                  {item.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div variants={footerVariants}>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05, x: 8 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUserClick}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 15px',
                borderRadius: '10px',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d6dce6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <motion.div
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  backgroundColor: '#f0f0f0',
                }}
                whileHover={{ backgroundColor: '#e0e0e0', rotate: 5 }}
              >
                <img
                  src={mypageImg}
                  alt="마이페이지"
                  style={{
                    width: '18px',
                    height: '18px',
                  }}
                />
              </motion.div>
              <span>My page</span>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05, x: 8 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 15px',
                borderRadius: '10px',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffebee';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <motion.div
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  backgroundColor: '#f0f0f0',
                }}
                whileHover={{ backgroundColor: '#ffcdd2', rotate: 5 }}
              >
                <img
                  src={logoutIcon}
                  alt="Logout"
                  style={{
                    width: '18px',
                    height: '18px',
                  }}
                />
              </motion.div>
              <span>Logout</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Notification Panel */}
      {isNotificationPanelOpen && (
        <NotificationPanel onClose={onCloseNotification} notificationRef={notificationRef} />
      )}
    </>
  );
};

// Dimension hook
const useDimensions = (ref) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
  }, [ref]);

  return dimensions.current;
};

export default Sidebar;
