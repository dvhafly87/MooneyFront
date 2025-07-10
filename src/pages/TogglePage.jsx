import { useState } from 'react';
import mainImg from '../img/main.png';
import menuImg from '../img/Menu_Icon.png';
import '../css/togglepage.css';

function TogglePage({ onToggle }) {
  const [isOpen, setIsOpen] = useState(false);

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
          <p>Welcome, user01님!</p>
        </div>
        <ul className="sidebar-menu">
          <li>알림함</li>
          <li>전체 지출</li>
          <li>챌린지</li>
          <li>데이터</li>
          <li>내역 검색하기</li>
        </ul>
        <div className="sidebar-footer">
          <div>My page</div>
          <div>Logout</div>
        </div>
      </div>
    </>
  );
}

export default TogglePage;
