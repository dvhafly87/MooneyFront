// src/styles/subscriptionPage.style.js
import styled from '@emotion/styled';

// 메인 컨테이너
const PageContainer = styled.div`
  padding: 20px;
  background-color: #fafafa;
  min-height: 100vh;
`;

// 헤더 섹션
const Header = styled.div`
  margin-bottom: 30px;

  h1 {
    margin: 0 0 10px 0;
    font-size: 28px;
    color: #333;
    font-weight: bold;
  }

  p {
    margin: 0;
    color: #666;
    font-size: 16px;
  }
`;

// 그리드 레이아웃
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  height: calc(100vh - 150px);
`;

// 왼쪽 컬럼 (구독 리스트)
const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

// 오른쪽 컬럼 (통계 및 차트)
const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// 정렬 버튼 컨테이너
const SortButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  background-color: white;
  padding: 15px;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

// 정렬 버튼
const SortButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => (props.$isActive ? '#4A90E2' : '#f0f0f0')};
  color: ${(props) => (props.$isActive ? 'white' : '#666')};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.$isActive ? '#4A90E2' : '#e0e0e0')};
  }
`;

// 구독 리스트 컨테이너
const SubscriptionListContainer = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex: 1;
  overflow: auto;

  h3 {
    margin: 0 0 20px 0;
    font-size: 18px;
    color: #333;
  }
`;

// 구독 리스트
const SubscriptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// 개별 구독 카드
const SubscriptionCard = styled.div`
  padding: 16px;
  border-radius: 12px;
  border: 2px solid ${(props) => (props.$isPaid ? '#4CAF50' : '#FF4D4D')};
  background-color: ${(props) => (props.$isPaid ? '#f8fff8' : '#fff8f8')};
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
`;

// 구독 카드 내용
const SubscriptionCardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// 구독 정보 (왼쪽)
const SubscriptionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

// 카테고리 색상 점
const CategoryDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
`;

// 구독 텍스트 정보
const SubscriptionTextInfo = styled.div`
  h4 {
    margin: 0 0 4px 0;
    font-size: 16px;
    color: #333;
  }

  p {
    margin: 0;
    font-size: 12px;
    color: #666;

    &.sub-info {
      margin: 2px 0 0 0;
      font-size: 11px;
      color: #999;
    }
  }
`;

// 구독 오른쪽 영역 (금액 + 버튼들)
const SubscriptionRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

// 금액 정보
const AmountInfo = styled.div`
  text-align: right;

  .amount {
    font-size: 18px;
    font-weight: bold;
    color: ${(props) => (props.$isPaid ? '#4CAF50' : '#FF4D4D')};
  }

  .status {
    font-size: 12px;
    color: ${(props) => (props.$isPaid ? '#4CAF50' : '#FF4D4D')};
    font-weight: 500;
  }
`;

// 액션 버튼들
const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

// 개별 액션 버튼
const ActionButton = styled.button`
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  background-color: ${(props) => {
    switch (props.$variant) {
      case 'paid':
        return '#4CAF50';
      case 'unpaid':
        return '#FF4D4D';
      case 'edit':
        return '#4A90E2';
      case 'delete':
        return '#FF4D4D';
      default:
        return '#666';
    }
  }};
  color: white;
  font-size: 10px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

// 통계 카드
const StatsCard = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;

  h3 {
    margin: 0 0 15px 0;
    font-size: 16px;
    color: #666;
  }

  .total-amount {
    margin: 0 0 15px 0;
    font-size: 32px;
    font-weight: bold;
    color: #333;
  }

  .breakdown {
    display: flex;
    justify-content: space-between;
    font-size: 14px;

    .paid {
      color: #4caf50;
    }

    .unpaid {
      color: #ff4d4d;
    }
  }
`;

// 차트 컨테이너
const ChartContainer = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex: 1;

  h3 {
    margin: 0 0 20px 0;
    font-size: 16px;
    color: #333;
  }
`;

// 추가 버튼
const AddButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 15px;
  padding: 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #357abd;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`;

// 모달 관련
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
  border-radius: 20px;
  padding: 30px;
  width: 450px;
  max-width: 90vw;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

  h2 {
    margin: 0 0 25px 0;
    font-size: 24px;
    color: #333;
    text-align: center;
  }
`;

// 폼 관련
const FormGroup = styled.div`
  margin-bottom: 20px;

  &:last-of-type {
    margin-bottom: 30px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }

  &::placeholder {
    color: #999;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  box-sizing: border-box;
  background-color: white;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 14px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357abd;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 14px;
  background-color: #f0f0f0;
  color: #666;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

// Default export로 모든 styled components를 하나의 객체로 내보내기
const S = {
  // Layout
  PageContainer,
  Header,
  GridContainer,
  LeftColumn,
  RightColumn,

  // Sort Section
  SortButtonContainer,
  SortButton,

  // Subscription List
  SubscriptionListContainer,
  SubscriptionList,
  SubscriptionCard,
  SubscriptionCardContent,
  SubscriptionInfo,
  CategoryDot,
  SubscriptionTextInfo,
  SubscriptionRightSection,
  AmountInfo,
  ActionButtons,
  ActionButton,

  // Stats & Chart
  StatsCard,
  ChartContainer,
  AddButton,

  // Modal
  ModalOverlay,
  ModalContent,

  // Form
  FormGroup,
  Label,
  Input,
  Select,
  ButtonRow,
  SubmitButton,
  CancelButton,
};

export default S;
