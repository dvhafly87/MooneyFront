// src/styles/loginPage.style.js
import styled from '@emotion/styled';

// 메인 페이지 컨테이너
const LoginPage = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #a8c8ec 0%, #c8b8e8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  perspective: 2000px;
`;

// 로고 섹션
const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
`;

// 말풍선
const SpeechBubble = styled.div`
  margin-top: 15px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 25px;
  font-size: 14px;
  color: #555;
  border: 2px solid #e9ecef;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  /* 말풍선 꼬리 */
  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #e9ecef;
  }

  &::after {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #f8f9fa;
  }
`;

// 입력 그룹
const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

// 라벨
const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

// 기본 입력 필드
const Input = styled.input`
  padding: 14px 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  width: 90%;

  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.1);
    background: rgba(255, 255, 255, 1);
  }

  &:disabled {
    background-color: #f8f9fa;
    color: #666;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #999;
  }
`;

// 버튼과 함께 있는 입력 필드 컨테이너
const InputWithButton = styled.div`
  display: flex;
  gap: 8px;
`;

// 버튼과 함께 있는 입력 필드
const InputWithBtn = styled(Input)`
  flex: 1;
`;

// 링크 섹션
const LinkSection = styled.div`
  text-align: center;
  margin-top: 25px;
`;

// 구분선
const Divider = styled.div`
  text-align: center;
  margin: 35px 0;
  position: relative;
  color: #666;
  font-size: 14px;
  font-weight: 500;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #e9ecef 20%, #e9ecef 80%, transparent);
    z-index: 1;
  }

  span {
    background: rgba(255, 255, 255, 0.95);
    padding: 0 20px;
    position: relative;
    z-index: 2;
  }
`;

// Default export
const S = {
  LoginPage,
  LogoSection,
  SpeechBubble,
  InputGroup,
  Label,
  Input,
  InputWithButton,
  InputWithBtn,
  LinkSection,
  Divider,
};

export default S;
