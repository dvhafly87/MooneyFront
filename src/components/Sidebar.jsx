import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@route/routes.js';
import { FaRegBell, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { PiMoneyWavy } from 'react-icons/pi';
import { BiBarChartAlt } from 'react-icons/bi';
import { FiBookOpen } from 'react-icons/fi';
import { LuNotebookPen } from 'react-icons/lu';
import { useState } from 'react';

const Sidebar = ({
  isOpen,
  onOpenNotification,
  isNotificationPanelOpen,
  onCloseNotification,
  notificationRef,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(false);

  const sidebarMenu = [
    // TODO 알림(모달), 전체지출, 챌린지, 다이어리, 가계부 적기
    { id: 'notify', label: '알림', icon: FaRegBell }, // 이 부분은 메인 콘텐츠쪽으로 알림 모달창을 열어야 함(이 모달의 경우 translate해서 메인컨텐츠가 이동하지 않도록 해야 함)
    { id: 'allExpense', label: '전체수입지출', icon: PiMoneyWavy, path: ROUTES.ACCOUNT_BOOK },
    { id: 'challenge', label: '챌린지', icon: BiBarChartAlt, path: ROUTES.CHALLENGE },
    { id: 'diary', label: '다이어리', icon: LuNotebookPen, path: ROUTES.DIARY },
    { id: 'accountBook', label: '가계부 적기', icon: FiBookOpen, path: ROUTES.ACCOUNT_BOOK },
    // !전체 지출과 가계부 적기 path를 동일하게 뒀음 수정해야 함
  ];

  const handleMenuClick = (path, itemId) => {
    if (itemId === 'notify') {
      onOpenNotification();
    } else if (path) {
      navigate(path);
    }
  };

  const handleRootClick = () => {
    navigate(ROUTES.ROOT);
  };

  const handleUserClick = () => {
    navigate(ROUTES.USER);
  };

  const handleLogout = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <>
      <div
        style={{
          width: '180px',
          height: '100vh',
          backgroundColor: 'lightcyan',
          position: 'fixed',
          left: 0,
          top: 0,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          padding: '1rem',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* 로고 영역 */}
        <div
          style={{
            display: 'flex',
            cursor: 'pointer',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 0',
            borderBottom: '1px solid black',
            marginBottom: '10px',
          }}
          onClick={handleRootClick}
        >
          <img src="../img/logo.png" style={{ width: '20px', height: '20px' }} alt="로고$" />
          <span>Mooney</span>
        </div>

        {/* 메뉴 리스트 */}
        <div>
          {/* 메뉴 아이템 */}
          {sidebarMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path && item.path !== '';

            return (
              <div
                key={item.id}
                onClick={() => {
                  handleMenuClick(item.path, item.id);
                }}
                style={{
                  backgroundColor: isActive ? 'blue' : 'transparent',
                  marginBottom: '15px',
                  cursor: 'pointer',
                }}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* 하단 메뉴 마이페이지, 로그인/로그아웃 */}
        <div style={{ position: 'absolute', bottom: '50px' }}>
          <div
            onClick={handleUserClick}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <FaUser size={10} />
            <span>My Page</span>
          </div>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={handleLogout}
          >
            {/* 백엔드에서 로그인 관련해 액세스 토큰을 가져와야 함
          로그인 된 상태일 시 로그아웃
          로그인 안된 상태일 시 로그인 */}
            {/* 로그인 태그 */}
            {/* 로그아웃 태그 */}
            {isLogin ? (
              <>
                <FaSignInAlt size={10} />
                <span>로그인</span>
              </>
            ) : (
              <>
                <FaSignOutAlt size={10} />
                <span>{isLogin ? '로그인' : '로그아웃'}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 알림창 */}
      {isNotificationPanelOpen && (
        <div
          ref={notificationRef}
          style={{
            backgroundColor: 'lightgray',
            position: 'fixed',
            top: '20px',
            left: isOpen ? '290px' : '10px', // 사이드바 바로 오른쪽
            width: '300px',
            height: '500px',
            zIndex: 100,
          }}
        >
          {/* 헤더 */}
          <div style={{ display: 'flex' }}>
            <h3>알림 창</h3>
            <button onClick={onCloseNotification}>X</button>
          </div>

          {/* 알림 내용 */}
          <div
            onClick={() => {
              navigate(ROUTES.CHALLENGE);
              onCloseNotification();
            }}
            style={{ cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = 'lightcyan')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'cyan')}
          >
            챌린지 완료
          </div>
          <div
            onClick={() => {
              navigate(ROUTES.SUBSCRIPTION);
              onCloseNotification();
            }}
            style={{ cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = 'wheat')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
          >
            구독 추가
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
