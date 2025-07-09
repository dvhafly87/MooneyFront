import { useNavigate } from 'react-router-dom';
import { FaBell, FaBookOpen, FaTrophy, FaWallet } from 'react-icons/fa';
import { ROUTES } from '@route/routes';

const NotificationPanel = ({ onClose, notificationRef }) => {
  const navigate = useNavigate();

  const mockNotificationsData = [
    {
      id: 1,
      type: 'challenge',
      icon: FaTrophy,
      title: '챌린지 목표 달성!',
      message: '이번 달 절약 챌린지를 성공적으로 완료했습니다.',
      time: '2시간 전',
      path: ROUTES.CHALLENGE,
      isRead: false,
    },
    {
      id: 2,
      type: 'expense',
      icon: FaWallet,
      title: '월 예산 80% 사용',
      message: '이번 달 예산의 80%를 사용했습니다.',
      time: '4시간 전',
      path: ROUTES.ACCOUNT_BOOK,
      isRead: true,
    },
    {
      id: 3,
      type: 'diary',
      icon: FaBookOpen,
      title: '소비 일기 작성 알림',
      message: '어제 소비에 대한 일기를 작성해보세요.',
      time: '1일 전',
      path: ROUTES.DIARY,
      isRead: false,
    },
    {
      id: 4,
      type: 'system',
      icon: FaBell,
      title: '새로운 기능 업데이트',
      message: '가계부 차트 기능이 새롭게 추가되었습니다.',
      time: '2일 전',
      path: '/chart',
      isRead: true,
    },
  ];

  return (
    <div
      ref={notificationRef}
      style={{
        position: 'fixed',
        top: '20px',
        left: '200px',
        width: '300px',
        height: '400px',
        backgroundColor: 'white',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3>알림</h3>
        <button onClick={onClose}>X</button>
      </div>

      <div>
        {mockNotificationsData.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
              style={{
                marginBottom: '1rem',
                padding: '0.5rem',
                backgroundColor: item.isRead ? '#f5f5f5' : '#e6f7ff',
                cursor: 'pointer',
                borderRadius: '6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={16} />
                <strong>{item.title}</strong>
              </div>
              <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>{item.message}</p>
              <span style={{ fontSize: '0.8rem', color: 'gray' }}>{item.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationPanel;
