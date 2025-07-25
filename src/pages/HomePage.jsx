import React, { useState } from 'react';
import { Apexcharts } from '@components/Apexcharts';
import MyCalendar from '@components/MyCalendar';
import CategoryChart from '@components/CategoryChart';
import chatImg from '@img/chatbotmooney.png';
import ChatBotModal from '@components/ChatBotModal';

function HomePage() {
  const [showChatModal, setShowChatModal] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '40px',
        padding: '20px 40px',
        minHeight: '100vh',
      }}
    >
      {/* 왼쪽 컬럼 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            width: '574px',
            height: '781px',
            borderRadius: '50px',
            backgroundColor: '#7898B1',
            textAlign: 'center',
            display: 'inline-block',
          }}
        >
          <MyCalendar />
          <CategoryChart />
        </div>
      </div>
      {/* 오른쪽 컬럼 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '781px',
        }}
      >
        {/* 수입 카드 */}
        <div
          style={{
            height: '170px',
            width: '342px',
            backgroundColor: '#F4F4F4',
            borderRadius: '30px',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0px 4px 4px rgba(0, 0, 0, 0.25)';
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontWeight: 'bold', fontSize: '18px', margin: '30px 0 8px 0' }}>수입</div>
            <div style={{ fontSize: '30px', color: '#3C82F6' }}>20,000원</div>
          </div>
          <div style={{ width: '120px', height: '120px' }}>
            <Apexcharts win={70} defeat={30} />
          </div>
        </div>

        {/* 지출 카드 */}
        <div
          style={{
            height: '170px',
            width: '342px',
            backgroundColor: '#F4F4F4',
            borderRadius: '30px',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0px 4px 4px rgba(0, 0, 0, 0.25)';
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontWeight: 'bold', fontSize: '18px', margin: '30px 0 8px 0' }}>지출</div>
            <div style={{ fontSize: '30px', color: '#FF4D4D' }}>2,000원</div>
          </div>
          <div style={{ width: '120px', height: '120px' }}>
            <Apexcharts win={70} defeat={30} />
          </div>
        </div>

        {/* 챗봇 무니 카드 */}
        <div
          onClick={() => setShowChatModal(true)}
          style={{
            cursor: 'pointer',
            position: 'relative',
            height: '170px',
            width: '342px',
            backgroundColor: '#f4f4f4',
            borderRadius: '30px',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            overflow: 'visible',
          }}
        >
          <div
            style={{
              background: '#e0e0e0',
              borderRadius: '25px',
              padding: '20px',
              maxWidth: '200px',
              fontSize: '14px',
              lineHeight: '1.5',
              color: '#222',
              position: 'relative',
              boxShadow: 'inset 0px 0px 6px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(-20px)',
            }}
          >
            <p style={{ margin: 0 }}>
              무니가 예측한 지출은{' '}
              <span style={{ color: '#e53935', fontWeight: 'bold' }}>72,000</span>원이에요.
              <br />
              목표에 맞을까요?
            </p>
            <div
              style={{
                position: 'absolute',
                right: '-12px',
                bottom: '20px',
                width: 0,
                height: 0,
                borderTop: '10px solid transparent',
                borderBottom: '10px solid transparent',
                borderLeft: '12px solid #e0e0e0',
              }}
            />
          </div>
        </div>
      </div>

      {/* 모달 컴포넌트 */}
      {showChatModal && <ChatBotModal onClose={() => setShowChatModal(false)} />}
    </div>
  );
}

export default HomePage;
