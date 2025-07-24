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

// Default export로 필요한 styled components만 내보내기
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
  ActionButtons,
  EditButton,
  ExitButton,

  // Loading & Error
  Loading,
  Error,
};

export default S;
