import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../contexts/useAuth.jsx';
import { ROUTES } from '../route/routes.js';

// 스타일 컴포넌트들
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

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
`;

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
`;

const CancelButton = styled(Button)`
  background: #e0e0e0;
  color: #333;

  &:hover {
    background: #d0d0d0;
  }
`;

const PrimaryButton = styled(Button)`
  background: ${(props) => (props.danger ? '#dc3545' : '#667eea')};
  color: white;

  &:hover {
    background: ${(props) => (props.danger ? '#c82333' : '#5a6fd8')};
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

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

const WithdrawalPage = () => {
  const navigate = useNavigate();
  const { user, deleteAccount, verifyPassword, loading } = useAuth();

  // 현재 단계 상태 (1: 비밀번호 확인, 2: 최종 확인, 3: 완료)
  const [currentStep, setCurrentStep] = useState(1);
  const [password, setPassword] = useState('');

  // 취소 버튼 처리 - 모든 단계에서 UserPage로 돌아가기
  const handleCancel = () => {
    navigate(ROUTES.USER);
  };

  // 1단계: 비밀번호 확인 (AuthContext의 verifyPassword 사용)
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error('비밀번호를 입력해주세요!');
      return;
    }

    try {
      const result = await verifyPassword(password);

      if (result.success) {
        setCurrentStep(2);
        toast.success('비밀번호가 확인되었습니다.');
      }
    } catch (error) {
      toast.error(error.message || '비밀번호 확인 중 오류가 발생했습니다.');
    }
  };

  // 2단계: 최종 회원탈퇴 확인
  const handleFinalConfirm = async () => {
    try {
      const result = await deleteAccount(password);

      if (result.success) {
        setCurrentStep(3);
        // 여기서 로그아웃 처리는 deleteAccount 함수 내에서 이미 처리됨
      }
    } catch (error) {
      toast.error('회원탈퇴 처리 중 오류가 발생했습니다.');
      console.error('회원탈퇴 오류:', error);
    }
  };

  // 3단계: 완료 후 로그인 페이지로 이동
  const handleGoToLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  // 애니메이션 설정
  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <Container>
      <WithdrawalCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 단계 표시기 */}
        <StepIndicator>
          <StepDot active={currentStep >= 1} />
          <StepDot active={currentStep >= 2} />
          <StepDot active={currentStep >= 3} />
        </StepIndicator>

        <AnimatePresence mode="wait">
          {/* 1단계: 비밀번호 확인 */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Title>비밀번호 확인</Title>
              <Subtitle>회원탈퇴를 위해 현재 비밀번호를 입력해주세요.</Subtitle>

              <Form onSubmit={handlePasswordSubmit}>
                <InputGroup>
                  <Label htmlFor="password">현재 비밀번호</Label>
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력해주세요"
                    autoFocus
                    required
                  />
                </InputGroup>

                <ButtonGroup>
                  <CancelButton
                    type="button"
                    onClick={handleCancel}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    취소
                  </CancelButton>

                  <PrimaryButton
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    다음
                  </PrimaryButton>
                </ButtonGroup>
              </Form>
            </motion.div>
          )}

          {/* 2단계: 최종 확인 */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Title>회원탈퇴 확인</Title>
              <Subtitle>정말로 회원탈퇴를 진행하시겠습니까?</Subtitle>

              <WarningBox>
                <WarningTitle>⚠️ 회원탈퇴 시 주의사항</WarningTitle>
                <WarningList>
                  <WarningItem>모든 개인정보 및 계정 데이터가 영구적으로 삭제됩니다.</WarningItem>
                  <WarningItem>
                    작성한 가계부, 챌린지, 다이어리 등 모든 데이터가 삭제됩니다.
                  </WarningItem>
                  <WarningItem>보유하고 있던 포인트가 모두 소멸됩니다.</WarningItem>
                  <WarningItem>한번 삭제된 데이터는 복구할 수 없습니다.</WarningItem>
                </WarningList>
              </WarningBox>

              <ButtonGroup>
                <CancelButton
                  onClick={handleCancel}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  취소
                </CancelButton>

                <PrimaryButton
                  danger
                  onClick={handleFinalConfirm}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      <LoadingSpinner />
                      처리중...
                    </div>
                  ) : (
                    '회원탈퇴'
                  )}
                </PrimaryButton>
              </ButtonGroup>
            </motion.div>
          )}

          {/* 3단계: 완료 */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <CompletionIcon>✅</CompletionIcon>
              <Title>회원탈퇴 완료</Title>

              <CompletionText>
                회원탈퇴가 성공적으로 완료되었습니다.
                <br />
                그동안 서비스를 이용해주셔서 감사합니다.
              </CompletionText>

              <PrimaryButton
                onClick={handleGoToLogin}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%' }}
              >
                로그인 페이지로 이동
              </PrimaryButton>
            </motion.div>
          )}
        </AnimatePresence>
      </WithdrawalCard>
    </Container>
  );
};

export default WithdrawalPage;
