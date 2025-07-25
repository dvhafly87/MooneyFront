// ✅ ChatBotModal + ExpensiveJxForm 통합 AI 챗봇 모달
import React, { useEffect, useState } from 'react';
import chatImg from '@img/chatmooney.png';
import DOMPurify from 'dompurify';

export default function ChatBotModal({ onClose }) {
  const [showOptions, setShowOptions] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([
    { from: 'bot', text: '어서오세요! 무엇을 도와드릴까요?' },
  ]);
  const [userinfo, setUserinfo] = useState(null);

  const options = [
    '이번주 지출 분석',
    '이번달 소비 패턴 분석',
    '고정 지출 패턴 분석',
    '지난달 대비 이번달 소비 추이 분석',
    '주요 소비처 분석',
    '지난달 대비 이번달 지출 빈도 추이 분석',
    '이번달 고액 지출건 분석',
  ];

  useEffect(() => {
    userinfoget();
  }, []);

  const userinfoget = async () => {
    try {
      const savedLoginState = localStorage.getItem('loginUser');
      const parsedData = JSON.parse(savedLoginState);
      if (!parsedData?.loginId) throw new Error('로그인 정보를 확인할 수 없습니다.');

      const response = await fetch('http://localhost:7474/do.MeminfoCheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ regid: parsedData.loginId }),
      });
      const result = await response.json();
      if (!result?.Meminfo) throw new Error('사용자 정보를 찾을 수 없습니다.');
      setUserinfo(result.Meminfo);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    setChatLog((prev) => [...prev, { from: 'user', text: message }]);
    setMessage('');

    const formData = new FormData();
    formData.append('userInput', message);
    formData.append('userinfo', userinfo?.id || 'unknown');

    try {
      const res = await fetch('http://localhost:7474/llama3-api', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (res.ok) {
        const result = await res.json();
        const clean = DOMPurify.sanitize(JSON.stringify(result.translation));
        setChatLog((prev) => [...prev, { from: 'bot', text: clean }]);
      } else {
        setChatLog((prev) => [...prev, { from: 'bot', text: `요청 실패: ${res.status}` }]);
      }
    } catch (err) {
      setChatLog((prev) => [...prev, { from: 'bot', text: `에러: ${err.message}` }]);
    }
  };

  const toggleOptions = () => setShowOptions((prev) => !prev);

  const handleOptionClick = (text) => {
    setMessage(text);
    setShowOptions(false);
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
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
                  whiteSpace: 'pre-wrap',
                }}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderTop: '1px solid #ddd',
            paddingTop: '12px',
          }}
        >
          <button onClick={toggleOptions} style={plusButtonStyle}>
            +
          </button>
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={inputStyle}
          />
          <button onClick={handleSend} style={sendButtonStyle}>
            ➤
          </button>
        </div>

        {showOptions && (
          <div style={optionsContainerStyle}>
            {options.map((opt, i) => (
              <button key={i} style={optionButtonStyle} onClick={() => handleOptionClick(opt)}>
                {opt}
              </button>
            ))}
          </div>
        )}

        <button onClick={onClose} style={closeButtonStyle}>
          ✕
        </button>
      </div>
    </div>
  );
}

// 💄 스타일들
const overlayStyle = {
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
};

const modalStyle = {
  width: '420px',
  maxHeight: '90vh',
  overflowY: 'auto',
  backgroundColor: '#fff',
  borderRadius: '20px',
  padding: '24px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  position: 'relative',
};

const plusButtonStyle = {
  marginRight: '8px',
  width: '36px',
  height: '36px',
  fontSize: '20px',
  fontWeight: 'bold',
  border: '1px solid #ccc',
  borderRadius: '50%',
  backgroundColor: '#f9f9f9',
  cursor: 'pointer',
};

const inputStyle = {
  flex: 1,
  padding: '10px 14px',
  borderRadius: '20px',
  border: '1px solid #ccc',
  fontSize: '14px',
  outline: 'none',
};

const sendButtonStyle = {
  marginLeft: '10px',
  padding: '10px 16px',
  backgroundColor: '#3C82F6',
  color: '#fff',
  border: 'none',
  borderRadius: '20px',
  cursor: 'pointer',
  fontSize: '14px',
};

const optionsContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '16px',
  justifyContent: 'flex-start',
};

const optionButtonStyle = {
  padding: '6px 10px',
  fontSize: '13px',
  backgroundColor: '#f0f0f0',
  borderRadius: '12px',
  border: '1px solid #ccc',
  cursor: 'pointer',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  background: 'none',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
  color: '#aaa',
};
