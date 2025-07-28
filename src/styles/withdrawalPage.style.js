// src/styles/withdrawalPage.style.js
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

// 메인 컨테이너
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

// 회원탈퇴 카드
const WithdrawalCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
`;

// 단계 표시기
const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  gap: 10px;
`;

const StepDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) => (props.active ? '#667eea' : '#e0e0e0')};
  transition: all 0.3s ease;
`;

// 제목 및 설명
const Title = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 10px;
  font-size: 28px;
  font-weight: bold;
`;

const Subtitle = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 30px;
  font-size: 16px;
  line-height: 1.5;
`;

// 폼 관련
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #333;
  font-weight: 500;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #999;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

// 경고 박스
const WarningBox = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
`;

const WarningTitle = styled.h3`
  color: #856404;
  margin: 0 0 15px 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WarningList = styled.ul`
  color: #856404;
  margin: 0;
  padding-left: 20px;
  line-height: 1.6;
`;

const WarningItem = styled.li`
  margin-bottom: 8px;
`;

// 버튼 관련
const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const Button = styled(motion.button)`
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const CancelButton = styled(Button)`
  background: #e0e0e0;
  color: #333;

  &:hover:not(:disabled) {
    background: #d0d0d0;
  }
`;

const PrimaryButton = styled(Button)`
  background: ${(props) => (props.danger ? '#dc3545' : '#667eea')};
  color: white;

  &:hover:not(:disabled) {
    background: ${(props) => (props.danger ? '#c82333' : '#5a6fd8')};
  }
`;

// 로딩 스피너
const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// 로딩 컨테이너
const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

// 완료 화면
const CompletionIcon = styled.div`
  text-align: center;
  margin-bottom: 20px;
  font-size: 64px;
`;

const CompletionText = styled.div`
  text-align: center;
  color: #333;
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 30px;
`;

// Default export로 모든 styled components를 하나의 객체로 내보내기
const S = {
  // Layout
  Container,
  WithdrawalCard,

  // Step Indicator
  StepIndicator,
  StepDot,

  // Titles
  Title,
  Subtitle,

  // Form
  Form,
  InputGroup,
  Label,
  Input,

  // Warning
  WarningBox,
  WarningTitle,
  WarningList,
  WarningItem,

  // Buttons
  ButtonGroup,
  Button,
  CancelButton,
  PrimaryButton,

  // Loading
  LoadingSpinner,
  LoadingContainer,

  // Completion
  CompletionIcon,
  CompletionText,
};

export default S;
