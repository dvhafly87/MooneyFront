// src/styles/userPage.style.js
import styled from '@emotion/styled';

// 메인 페이지 컨테이너
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
`;

// 헤더 섹션
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 600px;
  margin: 0 auto 30px auto;
`;

// 페이지 제목
const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

// 홈 버튼
const HomeButton = styled.button`
  padding: 10px 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357abd;
  }

  &:active {
    transform: translateY(1px);
  }
`;

// 메인 컨테이너
const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 프로필 섹션
const ProfileSection = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ProfileImageContainer = styled.div`
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e0e0e0;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ProfileInfo = styled.div`
  width: 100%;
`;

const Nickname = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
`;

const InfoText = styled.p`
  font-size: 16px;
  color: #666;
  margin: 8px 0;
`;

// 포인트 섹션
const PointSection = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const PointCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const PointIcon = styled.div`
  font-size: 32px;
`;

const PointInfo = styled.div`
  flex: 1;
`;

const PointLabel = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
`;

const PointValue = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #4a90e2;
  margin: 0;
`;

const UsePointButton = styled.button`
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }

  &:active {
    transform: translateY(1px);
  }
`;

// 일반 섹션
const Section = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
`;

// 카테고리 버튼
const CategoryButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }

  &:active {
    transform: translateY(1px);
  }
`;

// 액션 버튼들 컨테이너
const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// 수정 버튼
const EditButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357abd;
  }

  &:active {
    transform: translateY(1px);
  }
`;

// 탈퇴 버튼
const ExitButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c82333;
  }

  &:active {
    transform: translateY(1px);
  }
`;

// 로딩 및 에러 상태
const Loading = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
`;

const Error = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #dc3545;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

// 모달 컴포넌트들
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 0;
  max-width: 400px;
  width: 90%;
  max-height: 80%;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: #333;
  }
`;

const ModalContent = styled.div`
  padding: 24px;
`;

const CategoryForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ModalDescription = styled.p`
  margin: 0;
  font-size: 16px;
  color: #666;
  text-align: center;
`;

const CategoryExamples = styled.div`
  text-align: center;
`;

const ExampleTitle = styled.h4`
  font-size: 14px;
  color: #333;
  margin: 0 0 12px 0;
`;

const ExampleTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
`;

const ExampleTag = styled.span`
  padding: 6px 12px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  font-size: 12px;
  color: #495057;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e9ecef;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ModalConfirmButton = styled.button`
  padding: 10px 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357abd;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ModalCancelButton = styled.button`
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5a6268;
  }

  &:active {
    transform: translateY(1px);
  }
`;

// Default export로 모든 styled components를 하나의 객체로 내보내기
const S = {
  // Layout
  PageContainer,
  Header,
  Title,
  HomeButton,
  Container,

  // Profile Section
  ProfileSection,
  ProfileImageContainer,
  ProfileImage,
  ProfileInfo,
  Nickname,
  InfoText,

  // Point Section
  PointSection,
  PointCard,
  PointIcon,
  PointInfo,
  PointLabel,
  PointValue,
  UsePointButton,

  // General Section
  Section,
  SectionTitle,

  // Action Buttons
  CategoryButton,
  ActionButtons,
  EditButton,
  ExitButton,

  // Loading & Error
  Loading,
  Error,

  // Modal
  ModalOverlay,
  Modal,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalContent,
  CategoryForm,
  ModalDescription,
  CategoryExamples,
  ExampleTitle,
  ExampleTags,
  ExampleTag,
  ModalButtons,
  ModalConfirmButton,
  ModalCancelButton,
};

export default S;
