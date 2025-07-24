import React, { useState } from 'react';
import chatImg from '@img/chatmooney.png';

export default function ChatBotModal({ onClose }) {
  const [showOptions, setShowOptions] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([
    { from: 'bot', text: '어서오세요 user01님! 무엇을 도와드릴까요?' },
    { from: 'user', text: '다음 달 정기 구독일 알려줘 무니야 ~' },
  ]);

  const options = [
    '이번주 지출 분석',
    '이번달 소비 패턴 분석',
    '고정 지출 패턴 분석',
    '지난달 대비 이번달 소비 추이 분석',
    '주요 소비처 분석',
    '지난달 대비 이번달 지출 빈도 추이 분석',
    '이번달 고액 지출건 분석',
  ];

  const toggleOptions = () => setShowOptions((prev) => !prev);

  const handleSend = () => {
    if (!message.trim()) return;

    setChatLog((prev) => [...prev, { from: 'user', text: message }]);
    setMessage('');

    // TODO: 여기에 응답 API 호출하고 봇 메시지 추가하기
    // setChatLog(prev => [...prev, { from: 'bot', text: '무니가 분석중이에요...' }]);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '400px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#fff',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 채팅 로그 */}
        <div style={{ marginBottom: '16px' }}>
          {chatLog.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '12px',
              }}
            >
              {msg.from === 'bot' && (
                <img
                  src={chatImg}
                  alt="mooney"
                  style={{ width: '36px', height: '36px', marginRight: '8px' }}
                />
              )}
              <div
                style={{
                  backgroundColor: msg.from === 'user' ? '#D1E9FF' : '#F0F0F0',
                  padding: '10px 14px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  maxWidth: '70%',
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* 입력창 영역 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderTop: '1px solid #ddd',
            paddingTop: '12px',
          }}
        >
          <button
            onClick={toggleOptions}
            style={{
              marginRight: '8px',
              width: '36px',
              height: '36px',
              fontSize: '20px',
              fontWeight: 'bold',
              border: '1px solid #ccc',
              borderRadius: '50%',
              backgroundColor: '#f9f9f9',
              cursor: 'pointer',
            }}
          >
            +
          </button>
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '20px',
              border: '1px solid #ccc',
              fontSize: '14px',
              outline: 'none',
            }}
          />
          <button
            onClick={handleSend}
            style={{
              marginLeft: '10px',
              padding: '10px 16px',
              backgroundColor: '#3C82F6',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            ➤
          </button>
        </div>

        {/* 선택지 토글 영역 */}
        {showOptions && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '16px',
              justifyContent: 'flex-start',
            }}
          >
            {options.map((opt, i) => (
              <button
                key={i}
                style={{
                  padding: '6px 10px',
                  fontSize: '13px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '12px',
                  border: '1px solid #ccc',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setMessage(opt);
                  setShowOptions(false); // 선택하면 닫힘
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#aaa',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
