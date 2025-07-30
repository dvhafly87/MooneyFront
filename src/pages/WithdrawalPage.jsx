// src/pages/WithdrawalPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../contexts/useAuth.jsx';
import { ROUTES } from '../route/routes.js';
import S from '../styles/withdrawalPage.style.js'; // 🔥 스타일 import
import BACK_USER_API from './../services/back/userApi';

const WithdrawalPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // 현재 단계 상태 (1: 비밀번호 확인, 2: 최종 확인, 3: 완료)
  const [currentStep, setCurrentStep] = useState(1);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 취소 버튼 처리 - 모든 단계에서 UserPage로 돌아가기
  const handleCancel = () => {
    navigate(ROUTES.USER);
  };

  // 🔥 1단계: 비밀번호 확인 - BACK_USER_API 직접 호출
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error('비밀번호를 입력해주세요!');
      return;
    }

    if (!user) {
      toast.error('로그인이 필요합니다.');
      navigate(ROUTES.LOGIN);
      return;
    }

    setLoading(true);

    try {
      const result = await BACK_USER_API.verifyPassword(user.loginId, password);

      if (result.pwpossible) {
        setCurrentStep(2);
        toast.success('비밀번호가 확인되었습니다.');
      } else {
        toast.error('비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('비밀번호 확인 오류:', error);
      toast.error(error.message || '비밀번호 확인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 2단계: 최종 회원탈퇴 확인 - BACK_USER_API 직접 호출
  const handleFinalConfirm = async () => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      navigate(ROUTES.LOGIN);
      return;
    }

    setLoading(true);

    try {
      const result = await BACK_USER_API.deleteAccount(password);

      if (result.resultD) {
        setCurrentStep(3);
        // 🔥 회원탈퇴 성공 시 useAuth의 logout 호출하여 상태 정리
        await logout();

        toast.success('회원탈퇴가 완료되었습니다.');
      } else {
        toast.error('회원탈퇴 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원탈퇴 오류:', error);
      toast.error(error.message || '회원탈퇴 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
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
    <S.Container>
      <S.WithdrawalCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 단계 표시기 */}
        <S.StepIndicator>
          <S.StepDot active={currentStep >= 1} />
          <S.StepDot active={currentStep >= 2} />
          <S.StepDot active={currentStep >= 3} />
        </S.StepIndicator>

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
              <S.Title>비밀번호 확인</S.Title>
              <S.Subtitle>회원탈퇴를 위해 현재 비밀번호를 입력해주세요.</S.Subtitle>

              <S.Form onSubmit={handlePasswordSubmit}>
                <S.InputGroup>
                  <S.Label htmlFor="password">현재 비밀번호</S.Label>
                  <S.Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력해주세요"
                    autoFocus
                    required
                    disabled={loading}
                  />
                </S.InputGroup>

                <S.ButtonGroup>
                  <S.CancelButton
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    취소
                  </S.CancelButton>

                  <S.PrimaryButton
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <S.LoadingContainer>
                        <S.LoadingSpinner />
                        확인 중...
                      </S.LoadingContainer>
                    ) : (
                      '다음'
                    )}
                  </S.PrimaryButton>
                </S.ButtonGroup>
              </S.Form>
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
              <S.Title>회원탈퇴 확인</S.Title>
              <S.Subtitle>정말로 회원탈퇴를 진행하시겠습니까?</S.Subtitle>

              <S.WarningBox>
                <S.WarningTitle>⚠️ 회원탈퇴 시 주의사항</S.WarningTitle>
                <S.WarningList>
                  <S.WarningItem>
                    모든 개인정보 및 계정 데이터가 영구적으로 삭제됩니다.
                  </S.WarningItem>
                  <S.WarningItem>
                    작성한 가계부, 챌린지, 다이어리 등 모든 데이터가 삭제됩니다.
                  </S.WarningItem>
                  <S.WarningItem>보유하고 있던 포인트가 모두 소멸됩니다.</S.WarningItem>
                  <S.WarningItem>한번 삭제된 데이터는 복구할 수 없습니다.</S.WarningItem>
                </S.WarningList>
              </S.WarningBox>

              <S.ButtonGroup>
                <S.CancelButton
                  onClick={handleCancel}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  취소
                </S.CancelButton>

                <S.PrimaryButton
                  danger
                  onClick={handleFinalConfirm}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <S.LoadingContainer>
                      <S.LoadingSpinner />
                      처리중...
                    </S.LoadingContainer>
                  ) : (
                    '회원탈퇴'
                  )}
                </S.PrimaryButton>
              </S.ButtonGroup>
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
              <S.CompletionIcon>✅</S.CompletionIcon>
              <S.Title>회원탈퇴 완료</S.Title>

              <S.CompletionText>
                회원탈퇴가 성공적으로 완료되었습니다.
                <br />
                그동안 서비스를 이용해주셔서 감사합니다.
              </S.CompletionText>

              <S.PrimaryButton
                onClick={handleGoToLogin}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%' }}
              >
                로그인 페이지로 이동
              </S.PrimaryButton>
            </motion.div>
          )}
        </AnimatePresence>
      </S.WithdrawalCard>
    </S.Container>
  );
};

export default WithdrawalPage;
