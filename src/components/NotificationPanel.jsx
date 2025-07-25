import { useNavigate } from 'react-router-dom';
import MOCKDATA from '../assets/mockData.js';

const NotificationPanel = ({ onClose, notificationRef }) => {
  const navigate = useNavigate();

  const notificationsData = MOCKDATA.mockNotificationsData;

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
        {notificationsData.map((item) => {
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
