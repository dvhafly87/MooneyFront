// src/styles/challengePage.style.js
import styled from '@emotion/styled';

const PageContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  width: 100%;
  height: 100%;
  padding: 20px;
`;

const LeftColumn = styled.div`
  width: 100%;
`;

const RightColumn = styled.div`
  width: 100%;
`;

// 카드 컴포넌트
const Card = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: ${(props) => (props.center ? 'center' : 'left')};
  color: ${(props) => props.textColor || '#333'};
`;

const ChallengeHeader = styled.div`
  background-color: #4a90e2;
  color: white;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const ChallengeTitle = styled.h3`
  margin: 0 0 5px 0;
`;

const ChallengeDateRange = styled.span`
  font-size: 14px;
`;

// 제목 컴포넌트
const SectionTitle = styled.h2`
  margin: 0 0 15px 0;
`;

const SubSectionTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: ${(props) => props.fontSize || '18px'};
`;

// 금액 표시 컴포넌트
const TargetAmount = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const AmountDisplay = styled.div`
  margin-bottom: 10px;
  font-size: ${(props) => props.fontSize || '14px'};
  font-weight: ${(props) => props.fontWeight || 'normal'};
  color: ${(props) => props.color || '#333'};
`;

// 게이지바 컴포넌트
const GaugeContainer = styled.div`
  margin-bottom: ${(props) => props.marginBottom || '15px'};
`;

const GaugeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const GaugeLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const GaugeValue = styled.span`
  font-size: 12px;
  color: #666;
`;

const GaugeBar = styled.div`
  background-color: ${(props) => props.bgColor || '#e0e0e0'};
  height: ${(props) => props.height || '10px'};
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 5px;
`;

const GaugeFill = styled.div`
  background-color: ${(props) => props.fillColor};
  height: 100%;
  width: ${(props) => props.width}%;
  transition: width 1s ease;
`;

const GaugeText = styled.div`
  font-size: 12px;
  color: #666;
  text-align: center;
`;

// 상태 뱃지
const StatusBadge = styled.div`
  margin-top: 10px;
  padding: 5px 10px;
  background-color: ${(props) => props.bgColor};
  color: white;
  border-radius: 5px;
  display: inline-block;
  font-size: 12px;
`;

// 버튼 컴포넌트
const AddButton = styled.button`
  width: 100%;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #357abd;
  }
`;

// 특별한 카드 컴포넌트
const SuccessRateCard = styled(Card)`
  background-color: #4caf50;
  color: white;
  text-align: center;
`;

const SuccessRateValue = styled.h2`
  margin: 0;
  font-size: 36px;
`;

const PointsCard = styled(Card)`
  text-align: center;
`;

const PointsLabel = styled.p`
  margin: 0 0 10px 0;
  color: #666;
`;

const PointsValue = styled.h3`
  margin: 0;
  font-size: 24px;
`;

// 이전 챌린지 컴포넌트
const PreviousChallengeItem = styled.div`
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const PreviousChallengeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const PreviousChallengeTitle = styled.h4`
  margin: 0;
  font-size: 16px;
`;

const PreviousChallengeDateRange = styled.p`
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
`;

const PreviousChallengeDetails = styled.div`
  font-size: 12px;
  color: #666;
`;

// 대기중 챌린지 컴포넌트
const PendingChallengeItem = styled.div`
  padding: 12px;
  border: 2px solid #ff9800;
  border-radius: 6px;
  margin-bottom: 10px;
  background-color: #fff3e0;
`;

const PendingChallengeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

const PendingChallengeTitle = styled.h4`
  margin: 0;
  font-size: 14px;
`;

const PendingChallengeInfo = styled.p`
  margin: 0 0 5px 0;
  font-size: 12px;
  color: #666;

  &:last-child {
    margin-bottom: 0;
  }
`;

// 빈 상태 컴포넌트
const EmptyState = styled.p`
  margin: 0;
  color: #666;
  font-size: ${(props) => props.fontSize || '14px'};
`;

// 모달 컴포넌트
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 30px;
  width: 450px;
  max-width: 90vw;
`;

const ModalTitle = styled.h2`
  margin: 0 0 20px 0;
`;

// 폼 컴포넌트
const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const FormColumn = styled.div`
  flex: 1;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  resize: vertical;
  font-family: inherit;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const CurrentAmountDisplay = styled.p`
  margin: 0;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
  color: #666;
  font-weight: 500;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 12px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #357abd;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 12px;
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
  }

  &:active {
    transform: translateY(1px);
  }
`;

// Default export로 모든 styled components를 하나의 객체로 내보내기
const S = {
  // Layout
  PageContainer,
  LeftColumn,
  RightColumn,

  // Cards
  Card,
  ChallengeHeader,
  ChallengeTitle,
  ChallengeDateRange,
  SuccessRateCard,
  SuccessRateValue,
  PointsCard,
  PointsLabel,
  PointsValue,

  // Typography
  SectionTitle,
  SubSectionTitle,
  TargetAmount,
  AmountDisplay,
  EmptyState,

  // Gauge
  GaugeContainer,
  GaugeHeader,
  GaugeLabel,
  GaugeValue,
  GaugeBar,
  GaugeFill,
  GaugeText,

  // Status & Buttons
  StatusBadge,
  AddButton,

  // Previous Challenges
  PreviousChallengeItem,
  PreviousChallengeHeader,
  PreviousChallengeTitle,
  PreviousChallengeDateRange,
  PreviousChallengeDetails,

  // Pending Challenges
  PendingChallengeItem,
  PendingChallengeHeader,
  PendingChallengeTitle,
  PendingChallengeInfo,

  // Modal
  ModalOverlay,
  ModalContent,
  ModalTitle,

  // Form
  FormGroup,
  FormRow,
  FormColumn,
  Label,
  Input,
  TextArea,
  CurrentAmountDisplay,
  ButtonRow,
  SubmitButton,
  CancelButton,
};

export default S;
