import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../route/routes.js';
import { useState } from 'react';
import useAuth from '../contexts/useAuth.jsx';
import NotificationPanel from '../components/NotificationPanel';
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
  const { user, logout, checkTokenExpiry } = useAuth(); // 인증 상태 가져오기

  const [hasNotification, setHasNotification] = useState(true);

  const sidebarMenu = [
    // 알림(모달), 전체지출, 챌린지, 다이어리, 구독
    //! 전체 지출과 가계부 적기 path를 동일하게 두었음 수정해야 함 (가계부 모달 창으로 바로 간다던지 그런 식으로)-구독으로 수정하긴 했는데, 필요한면 바꿀 것
    { id: 'notify', label: '알림', icon: hasNotification ? onBellImg : offBellImg },
    { id: 'allExpense', label: '전체수입지출', icon: wonImg, path: ROUTES.ACCOUNT_BOOK },
    { id: 'challenge', label: '챌린지', icon: chaImg, path: ROUTES.CHALLENGE },
    { id: 'diary', label: '다이어리', icon: diaryIcon, path: ROUTES.DIARY },
    { id: 'subscription', label: '구독', icon: pencilImg, path: ROUTES.SUBSCRIPTION },
  ];

  const handleMenuClick = (path, itemId) => {
    // 메뉴 클릭 시 토큰 체크
    if (!checkTokenExpiry()) {
      return; // 토큰이 만료되면 ProtectedRoute에서 자동 처리
    }

    if (itemId === 'notify') {
      onOpenNotification();
    } else if (path) {
      navigate(path);
    }
  };

  const handleRootClick = () => {
    if (checkTokenExpiry()) {
      navigate(ROUTES.ROOT);
    }
  };

  const handleUserClick = () => {
    if (checkTokenExpiry()) {
      navigate(ROUTES.USER);
    }
  };

  const handleLogout = () => {
    if (window.confirm('정말 로그아웃하시겠습니까?')) {
      logout();
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <>
      {/* 사이드바 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '260px',
          height: '100vh',
          backgroundColor: '#e9ecf2',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
          padding: '30px 20px',
          boxSizing: 'border-box',
          zIndex: 1000,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* 사이드바 헤더 */}
        <div>
          <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={handleRootClick}>
            <img
              src={mainImg}
              alt="Mooney"
              style={{
                width: '60px',
                height: 'auto',
                marginBottom: '10px',
              }}
            />
            <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>Mooney</h2>
          </div>

          <p style={{ margin: 0, fontSize: '14px', textAlign: 'center' }}>
            Welcome,&nbsp;
            <span style={{ color: '#6B69EE' }}>
              {user?.name || user?.nickname || user?.id || '사용자'}
            </span>
            님!
          </p>

          {/* 메뉴 리스트 */}
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              marginTop: '30px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              fontSize: '16px',
              fontWeight: 500,
              color: '#333',
            }}
          >
            {sidebarMenu.map((item) => {
              const isActive = location.pathname === item.path && item.path !== '';

              return (
                <li
                  key={item.id}
                  onClick={() => handleMenuClick(item.path, item.id)}
                  style={{
                    cursor: 'pointer',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    transition: 'background 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: isActive ? '#d6dce6' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = '#d6dce6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    style={{
                      width: '18px',
                      height: '18px',
                    }}
                  />
                  {item.label}
                </li>
              );
            })}
          </ul>
        </div>

        {/* 사이드바 푸터 */}
        <div
          style={{
            fontSize: '14px',
            color: '#777',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div
            onClick={handleUserClick}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 10px',
              borderRadius: '8px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#d6dce6';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <img
              src={mypageImg}
              alt="마이페이지"
              style={{
                width: '18px',
                height: '18px',
              }}
            />
            My page
          </div>

          <div
            onClick={handleLogout}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 10px',
              borderRadius: '8px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#d6dce6';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <img
              src={logoutIcon}
              alt="Logout"
              style={{
                width: '18px',
                height: '18px',
              }}
            />
            Logout
          </div>
        </div>
      </div>

      {/* 알림창*/}
      {isNotificationPanelOpen && (
        <NotificationPanel onClose={onCloseNotification} notificationRef={notificationRef} />
      )}
    </>
  );
};

export default Sidebar;
