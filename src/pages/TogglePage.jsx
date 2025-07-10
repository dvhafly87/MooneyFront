import { useState, useEffect } from 'react';
import mainImg from '../img/main.png';
import menuImg from '../img/Menu_Icon.png';
import '../css/togglepage.css';

import diaryIcon from '../img/book.png';
import wonImg from '../img/won.png';
import offBellImg from '../img/off_bell.png';
import onBellImg from '../img/on_bell.png';
import pencilImg from '../img/pencil.png';
import chaImg from '../img/challenge.png';
import mypageImg from '../img/mypage.png';
import loginIcon from '../img/login.png';
import logoutIcon from '../img/logout.png';

function TogglePage({ onToggle, isLoggedIn, userId }) {
  const [isOpen, setIsOpen] = useState(true);
  const [hasNotification, setHasNotification] = useState(false);

  const dummyNotifications = [
    { id: 1, message: '오늘은 지출이 많아요!', read: false },
    { id: 2, message: '챌린지가 시작되었어요!', read: true },
  ];

  useEffect(() => {
    const unread = dummyNotifications.filter((noti) => !noti.read);
    setHasNotification(unread.length > 0);
  }, []);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    onToggle(next);
  };

  return (
    <>
      <img src={menuImg} alt="Menu" className="menu-toggle-button" onClick={handleToggle} />

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src={mainImg} alt="Mooney" className="sidebar-logo" />
          <h2>Mooney</h2>
          <p>
            {isLoggedIn ? (
              <>
                Welcome,&nbsp;
                <span style={{ color: '#6B69EE' }}>{userId}</span>님!
              </>
            ) : (
              '로그인을 먼저 해주세요!'
            )}
          </p>
        </div>

        <ul className="sidebar-menu">
          <li>
            <img src={hasNotification ? onBellImg : offBellImg} alt="알림" className="menu-icon" />
            알림함
          </li>
          <li>
            <img src={wonImg} alt="원" className="menu-icon" />
            전체 지출
          </li>
          <li>
            <img src={chaImg} alt="챌린지" className="menu-icon" />
            챌린지
          </li>
          <li>
            <img src={diaryIcon} alt="다이어리" className="menu-icon" />
            다이어리
          </li>
          <li>
            <img src={pencilImg} alt="자세히적기" className="menu-icon" />
            내역 자세히 적기
          </li>
        </ul>

        <div className="sidebar-footer">
          <div>
            <img src={mypageImg} alt="마이페이지" className="menu-icon" /> &nbsp; My page
          </div>

          <div>
            <img
              src={isLoggedIn ? logoutIcon : loginIcon}
              alt={isLoggedIn ? 'Logout' : 'Login'}
              className="menu-icon1"
            />
            {isLoggedIn ? 'Logout' : 'Login'}
          </div>
        </div>
      </div>
    </>
  );
}

export default TogglePage;
