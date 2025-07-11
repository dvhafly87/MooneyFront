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
        left: '270px', // 사이드바 바로 오른쪽
        width: '350px',
        height: '450px',
        backgroundColor: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        borderRadius: '8px',
        zIndex: 1100,
        padding: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          borderBottom: '1px solid #eee',
          paddingBottom: '10px',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '18px' }}>🔔 알림</h3>
        <button
          onClick={onClose}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#999',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
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
                marginBottom: '12px',
                padding: '12px',
                backgroundColor: item.isRead ? '#f8f9fa' : '#e6f7ff',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e9ecef';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = item.isRead ? '#f8f9fa' : '#e6f7ff';
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}
              >
                <Icon size={16} color="#1976d2" />
                <strong style={{ fontSize: '14px' }}>{item.title}</strong>
                {!item.isRead && (
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#ff4757',
                      borderRadius: '50%',
                    }}
                  />
                )}
              </div>
              <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>{item.message}</p>
              <span style={{ fontSize: '12px', color: '#999' }}>{item.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationPanel;
