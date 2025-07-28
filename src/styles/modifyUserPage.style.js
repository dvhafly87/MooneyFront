// src/styles/modifyUserPage.style.js
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

// 수정 카드
const ModifyCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
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
  gap: 25px;
`;

const Section = styled.div`
  padding: 20px;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  background: #fafafa;
`;

const SectionTitle = styled.h3`
  color: #333;
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
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
    color: #666;
  }
`;

// 버튼 관련
const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
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
  background: #667eea;
  color: white;

  &:hover:not(:disabled) {
    background: #5a6fd8;
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

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

// 프로필 이미지 관련
const ProfileImageContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 15px auto;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e0e0e0;
`;

const DefaultProfileIcon = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #f5f5f5;
  border: 3px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #ccc;
`;

const ImageUploadButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);

  &:hover {
    background: #5a6fd8;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

// 닉네임 관련
const NicknameCheckButton = styled.button`
  padding: 10px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 500;

  &:hover {
    background: #218838;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const NicknameInputGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: end;
`;

// 섹션 타입별 스타일
const RequiredSection = styled(Section)`
  border-color: #ffc107;
  background: #fff8e1;
`;

const OptionalSection = styled(Section)`
  border-color: #e0e0e0;
  background: #fafafa;
`;

// 도움말 텍스트
const HelpText = styled.p`
  font-size: 13px;
  color: #666;
  margin: 5px 0 0 0;
  line-height: 1.4;
`;

// Default export로 모든 styled components를 하나의 객체로 내보내기
const S = {
  // Layout
  Container,
  ModifyCard,

  // Titles
  Title,
  Subtitle,

  // Form
  Form,
  Section,
  SectionTitle,
  InputGroup,
  Label,
  Input,

  // Buttons
  ButtonGroup,
  Button,
  CancelButton,
  PrimaryButton,

  // Loading
  LoadingSpinner,
  LoadingContainer,

  // Profile Image
  ProfileImageContainer,
  ProfileImage,
  DefaultProfileIcon,
  ImageUploadButton,
  HiddenFileInput,

  // Nickname
  NicknameCheckButton,
  NicknameInputGroup,

  // Section Types
  RequiredSection,
  OptionalSection,

  // Help
  HelpText,
};

export default S;
