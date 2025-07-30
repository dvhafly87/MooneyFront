// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../contexts/useAuth.jsx';
import { toast } from 'react-toastify';
import { ROUTES } from '../route/routes';
import logo_nuki from '../img/logo_nuki.png';
import S from '../styles/loginPage.style.js';
import BACK_USER_API from './../services/back/userApi.js';

function LoginPage() {
  const [currentForm, setCurrentForm] = useState('login'); // 'login', 'register', 'reset'
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    // 로그인 폼
    id: '',
    password: '',
    // 회원가입 폼
    confirmPassword: '',
    email: '',
    nickname: '',
    birthDate: '',
  });

  // 검증 상태들
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [isEmailCodeSent, setIsEmailCodeSent] = useState(false);

  // 비밀번호 찾기
  const [resetEmail, setResetEmail] = useState('');

  const { login, register, checkIdDuplicate, checkNicknameDuplicate, isAuthenticated, loading } =
    useAuth();
  const navigate = useNavigate();

  // 이미 로그인된 상태면 홈으로 리다이렉트
  if (isAuthenticated) {
    return <Navigate to={ROUTES.ROOT} replace />;
  }

  // Framer Motion 애니메이션 variants
  const cardVariants = {
    initial: {
      rotateY: 0,
      scale: 1,
      opacity: 1,
    },
    exit: {
      rotateY: 90,
      scale: 0.8,
      opacity: 0.3,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    enter: {
      rotateY: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
        delay: 0.1,
      },
    },
  };

  const contentVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  };

  const itemVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    tap: {
      scale: 0.98,
      y: 0,
    },
  };

  // 애니메이션과 함께 폼 전환하는 함수
  const switchForm = (newForm) => {
    if (isAnimating || currentForm === newForm) return;

    setIsAnimating(true);

    setTimeout(() => {
      setCurrentForm(newForm);
      resetFormStates();
      setIsAnimating(false);
    }, 400);
  };

  // 폼 상태 초기화
  const resetFormStates = () => {
    setFormData({
      id: '',
      password: '',
      confirmPassword: '',
      email: '',
      nickname: '',
      birthDate: '',
    });
    setIsIdChecked(false);
    setIsNicknameChecked(false);
    setIsEmailVerified(false);
    setIsEmailCodeSent(false);
    setEmailVerificationCode('');
    setResetEmail('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 중복 확인 상태 초기화
    if (name === 'id') {
      setIsIdChecked(false);
    }
    if (name === 'nickname') {
      setIsNicknameChecked(false);
    }
  };

  // 로그인 처리
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.id.trim()) {
      toast.error('아이디를 입력해주세요!');
      return;
    }

    if (!formData.password.trim()) {
      toast.error('비밀번호를 입력해주세요!');
      return;
    }

    const result = await login({
      id: formData.id,
      password: formData.password,
    });

    if (result.success) {
      navigate(ROUTES.ROOT);
    }
  };

  // 회원가입 처리
  const handleRegister = async (e) => {
    e.preventDefault();

    // 필수 항목 검증
    if (!formData.id.trim()) {
      toast.error('아이디를 입력해주세요!');
      return;
    }

    if (!isIdChecked) {
      toast.error('아이디 중복확인을 해주세요!');
      return;
    }

    if (!formData.password.trim()) {
      toast.error('비밀번호를 입력해주세요!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다!');
      return;
    }

    if (!formData.nickname.trim()) {
      toast.error('닉네임을 입력해주세요!');
      return;
    }

    if (!isNicknameChecked) {
      toast.error('닉네임 중복확인을 해주세요!');
      return;
    }

    if (!formData.birthDate) {
      toast.error('생년월일을 입력해주세요!');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('이메일을 입력해주세요!');
      return;
    }

    if (!isEmailVerified) {
      toast.error('이메일 인증을 완료해주세요!');
      return;
    }

    // 회원가입 BACK_USER_API 호출
    const result = await register({
      id: formData.id,
      password: formData.password,
      nickname: formData.nickname,
      birthDate: formData.birthDate,
    });

    if (result.success) {
      switchForm('login');
    }
  };

  // ID 중복 확인
  const handleIdCheck = async () => {
    if (!formData.id.trim()) {
      toast.error('아이디를 입력해주세요!');
      return;
    }

    try {
      const result = await checkIdDuplicate(formData.id);
      if (result.available) {
        toast.success(result.message);
        setIsIdChecked(true);
      } else {
        toast.error(result.message);
        setIsIdChecked(false);
      }
    } catch (error) {
      toast.error('아이디 중복 확인 중 오류가 발생했습니다.');
      setIsIdChecked(false);
    }
  };

  // 닉네임 중복 확인
  const handleNicknameCheck = async () => {
    if (!formData.nickname.trim()) {
      toast.error('닉네임을 입력해주세요!');
      return;
    }

    try {
      const result = await checkNicknameDuplicate(formData.nickname);
      if (result.available) {
        toast.success(result.message);
        setIsNicknameChecked(true);
      } else {
        toast.error(result.message);
        setIsNicknameChecked(false);
      }
    } catch (error) {
      toast.error('닉네임 중복 확인 중 오류가 발생했습니다.');
      setIsNicknameChecked(false);
    }
  };

  // 이메일 인증코드 발송
  const handleSendEmailCode = async () => {
    if (!formData.email.trim()) {
      toast.error('이메일을 입력해주세요!');
      return;
    }

    try {
      const result = await BACK_USER_API.sendVerificationEmail(formData.email);
      if (result.success) {
        toast.success(result.message);
        setIsEmailCodeSent(true);
        if (result.__dev_code) {
          // 이 토스트 메세지의 경우 개발 환경에서만 작용하도록
          toast.info(`개발용 인증코드: ${result.__dev_code}`, { autoClose: 5000 });
        }
      }
    } catch (error) {
      toast.error('gggg', error.message);
    }
  };

  const handleVerifyEmailCode = async () => {
    if (!emailVerificationCode.trim()) {
      toast.error('인증코드를 입력해주세요!');
      return;
    }

    try {
      const result = await BACK_USER_API.verifyEmailCode(formData.email, emailVerificationCode);
      if (result.success) {
        toast.success(result.message);
        setIsEmailVerified(true);
        setEmailVerificationCode('');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 비밀번호 찾기
  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!resetEmail.trim()) {
      toast.error('이메일을 입력해주세요!');
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success('비밀번호 재설정 링크가 이메일로 발송되었습니다.');

    setTimeout(() => {
      switchForm('login');
    }, 1500);
  };

  // 로그인 폼 렌더링
  const renderLoginForm = () => (
    <motion.div
      key="login"
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div variants={itemVariants}>
        <S.LogoSection>
          <motion.img
            src={logo_nuki}
            alt="Mooney Logo"
            style={{ width: '90px', height: 'auto' }}
            whileHover={{
              scale: 1.1,
              rotate: 5,
              transition: { duration: 0.3 },
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.3 },
            }}
          >
            <S.SpeechBubble>Mooney로 똑똑하게 소비하자!</S.SpeechBubble>
          </motion.div>
        </S.LogoSection>
      </motion.div>

      <motion.form onSubmit={handleLogin} variants={itemVariants}>
        <S.InputGroup>
          <S.Label>아이디</S.Label>
          <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <S.Input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              placeholder="아이디를 입력하세요"
            />
          </motion.div>
        </S.InputGroup>

        <S.InputGroup>
          <S.Label>비밀번호</S.Label>
          <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <S.Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
            />
          </motion.div>
        </S.InputGroup>

        <motion.button
          type="submit"
          disabled={loading}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          style={{
            padding: '16px 24px',
            background: 'linear-gradient(135deg, #4a90e2, #357abd)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '10px',
            width: '100%',
            boxShadow: '0 6px 12px rgba(74, 144, 226, 0.2)',
          }}
        >
          {loading ? '로그인 중...' : '로그인'}
        </motion.button>
      </motion.form>

      <motion.div variants={itemVariants}>
        <S.LinkSection>
          <motion.button
            onClick={() => switchForm('reset')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'none',
              border: 'none',
              color: '#4a90e2',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontWeight: '500',
            }}
          >
            비밀번호 찾기
          </motion.button>
        </S.LinkSection>
      </motion.div>

      <motion.div variants={itemVariants}>
        <S.Divider>
          <span>소셜 로그인</span>
        </S.Divider>
      </motion.div>

      <motion.div
        variants={itemVariants}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '35px',
        }}
      >
        {[
          { bg: '#FEE500', emoji: '💬' },
          { bg: '#03C75A', emoji: 'N' },
          { bg: '#EA4335', emoji: 'G' },
        ].map((social, index) => (
          <motion.button
            key={index}
            whileHover={{
              scale: 1.15,
              y: -5,
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
            }}
            whileTap={{ scale: 1.05 }}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              backgroundColor: social.bg,
              fontSize: '24px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            {social.emoji}
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        variants={itemVariants}
        style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}
      >
        <span>계정이 없으신가요? </span>
        <motion.button
          onClick={() => switchForm('register')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'none',
            border: 'none',
            color: '#4a90e2',
            fontSize: '14px',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontWeight: '700',
            marginLeft: '5px',
          }}
        >
          회원가입
        </motion.button>
      </motion.div>

      {/* <motion.div
        variants={itemVariants}
        style={{
          textAlign: 'center',
          marginTop: '25px',
          padding: '15px',
          background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
          borderRadius: '12px',
          fontSize: '12px',
          color: '#666',
          border: '2px solid #e9ecef',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
        }}
      >
        <p style={{ margin: 0, fontWeight: '600', color: '#495057' }}>테스트 계정: admin / 1234</p>
      </motion.div> */}
    </motion.div>
  );

  // 회원가입 폼 렌더링 (전체 기능 복원)
  const renderRegisterForm = () => (
    <motion.div
      key="register"
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2
          style={{
            margin: 0,
            color: '#333',
            fontSize: '28px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #4a90e2, #357abd)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          회원 가입
        </h2>
      </motion.div>

      <motion.form onSubmit={handleRegister} variants={itemVariants}>
        {/* 아이디 */}
        <S.InputGroup>
          <S.Label>아이디</S.Label>
          <S.InputWithButton>
            <motion.div whileFocus={{ scale: 1.02 }} style={{ flex: 1 }}>
              <S.InputWithBtn
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                placeholder="아이디를 입력하세요"
              />
            </motion.div>
            <motion.button
              type="button"
              onClick={handleIdCheck}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              style={{
                padding: '14px 18px',
                background: 'linear-gradient(135deg, #28a745, #20c997)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 8px rgba(40, 167, 69, 0.2)',
              }}
            >
              중복 확인
            </motion.button>
          </S.InputWithButton>
          {isIdChecked && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontSize: '12px',
                color: '#28a745',
                marginTop: '6px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ✓ 사용 가능한 아이디입니다
            </motion.div>
          )}
        </S.InputGroup>

        {/* 비밀번호 */}
        <S.InputGroup>
          <S.Label>비밀번호</S.Label>
          <motion.div whileFocus={{ scale: 1.02 }}>
            <S.Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
            />
          </motion.div>
        </S.InputGroup>

        {/* 비밀번호 확인 */}
        <S.InputGroup>
          <S.Label>비밀번호 확인</S.Label>
          <motion.div whileFocus={{ scale: 1.02 }}>
            <S.Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="비밀번호를 다시 입력하세요"
            />
          </motion.div>
          {formData.confirmPassword && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontSize: '12px',
                color: formData.password === formData.confirmPassword ? '#28a745' : '#dc3545',
                marginTop: '6px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {formData.password === formData.confirmPassword ? (
                <>
                  <span
                    style={{
                      display: 'inline-block',
                      background: '#28a745',
                      color: 'white',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      textAlign: 'center',
                      lineHeight: '16px',
                      fontSize: '10px',
                    }}
                  >
                    ✓
                  </span>
                  비밀번호가 일치합니다
                </>
              ) : (
                <>
                  <span
                    style={{
                      display: 'inline-block',
                      background: '#dc3545',
                      color: 'white',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      textAlign: 'center',
                      lineHeight: '16px',
                      fontSize: '10px',
                    }}
                  >
                    ✗
                  </span>
                  비밀번호가 일치하지 않습니다
                </>
              )}
            </motion.div>
          )}
        </S.InputGroup>

        {/* 닉네임 */}
        <S.InputGroup>
          <S.Label>닉네임</S.Label>
          <S.InputWithButton>
            <motion.div whileFocus={{ scale: 1.02 }} style={{ flex: 1 }}>
              <S.InputWithBtn
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                placeholder="닉네임을 입력하세요"
              />
            </motion.div>
            <motion.button
              type="button"
              onClick={handleNicknameCheck}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              style={{
                padding: '14px 18px',
                background: 'linear-gradient(135deg, #28a745, #20c997)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 8px rgba(40, 167, 69, 0.2)',
              }}
            >
              중복 확인
            </motion.button>
          </S.InputWithButton>
          {isNicknameChecked && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontSize: '12px',
                color: '#28a745',
                marginTop: '6px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ✓ 사용 가능한 닉네임입니다
            </motion.div>
          )}
        </S.InputGroup>

        {/* 생년월일 */}
        <S.InputGroup>
          <S.Label>생년월일</S.Label>
          <motion.div whileFocus={{ scale: 1.02 }}>
            <S.Input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
            />
          </motion.div>
        </S.InputGroup>

        {/* 이메일 인증 */}
        <S.InputGroup>
          <S.Label>이메일 (인증용)</S.Label>
          <S.InputWithButton>
            <motion.div whileFocus={{ scale: 1.02 }} style={{ flex: 1 }}>
              <S.InputWithBtn
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="이메일을 입력하세요"
                disabled={isEmailVerified}
                style={{
                  backgroundColor: isEmailVerified ? '#f8f9fa' : 'rgba(255, 255, 255, 0.9)',
                  color: isEmailVerified ? '#666' : 'inherit',
                  cursor: isEmailVerified ? 'not-allowed' : 'text',
                }}
              />
            </motion.div>
            <motion.button
              type="button"
              onClick={handleSendEmailCode}
              disabled={isEmailVerified}
              variants={buttonVariants}
              whileHover={!isEmailVerified ? 'hover' : {}}
              whileTap={!isEmailVerified ? 'tap' : {}}
              style={{
                padding: '14px 18px',
                background: isEmailVerified
                  ? 'linear-gradient(135deg, #6c757d, #5a6268)'
                  : 'linear-gradient(135deg, #28a745, #20c997)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isEmailVerified ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: isEmailVerified
                  ? '0 2px 4px rgba(108, 117, 125, 0.2)'
                  : '0 4px 8px rgba(40, 167, 69, 0.2)',
              }}
            >
              {isEmailCodeSent ? '재발송' : '인증코드 발송'}
            </motion.button>
          </S.InputWithButton>
          {isEmailVerified && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontSize: '12px',
                color: '#28a745',
                marginTop: '6px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ✓ 이메일 인증이 완료되었습니다
            </motion.div>
          )}
        </S.InputGroup>

        {/* 이메일 인증코드 입력 */}
        {isEmailCodeSent && !isEmailVerified && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <S.InputGroup>
              <S.Label>인증코드</S.Label>
              <S.InputWithButton>
                <motion.div whileFocus={{ scale: 1.02 }} style={{ flex: 1 }}>
                  <S.InputWithBtn
                    type="text"
                    value={emailVerificationCode}
                    onChange={(e) => setEmailVerificationCode(e.target.value)}
                    placeholder="인증코드 6자리를 입력하세요"
                    maxLength={6}
                  />
                </motion.div>
                <motion.button
                  type="button"
                  onClick={handleVerifyEmailCode}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  style={{
                    padding: '14px 18px',
                    background: 'linear-gradient(135deg, #28a745, #20c997)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 8px rgba(40, 167, 69, 0.2)',
                  }}
                >
                  인증 확인
                </motion.button>
              </S.InputWithButton>
            </S.InputGroup>
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          style={{
            padding: '16px 24px',
            background: 'linear-gradient(135deg, #4a90e2, #357abd)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '20px',
            width: '100%',
            boxShadow: '0 6px 12px rgba(74, 144, 226, 0.2)',
          }}
        >
          {loading ? '가입 중...' : '회원 가입'}
        </motion.button>
      </motion.form>

      <motion.div variants={itemVariants} style={{ textAlign: 'center', marginTop: '20px' }}>
        <span style={{ fontSize: '14px', color: '#666' }}>이미 계정이 있으신가요? </span>
        <motion.button
          onClick={() => switchForm('login')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'none',
            border: 'none',
            color: '#4a90e2',
            fontSize: '14px',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontWeight: '700',
          }}
        >
          로그인
        </motion.button>
      </motion.div>
    </motion.div>
  );

  // 비밀번호 찾기 폼 렌더링
  const renderResetForm = () => (
    <motion.div
      key="reset"
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2
          style={{
            margin: 0,
            color: '#333',
            fontSize: '28px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #4a90e2, #357abd)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          비밀번호 찾기
        </h2>
        <p
          style={{
            color: '#666',
            fontSize: '14px',
            lineHeight: '1.6',
            marginTop: '15px',
            marginBottom: 0,
          }}
        >
          가입 시 사용한 이메일을 입력하시면
          <br />
          비밀번호 재설정 링크를 보내드립니다.
        </p>
      </motion.div>

      <motion.form onSubmit={handlePasswordReset} variants={itemVariants}>
        <S.InputGroup>
          <S.Label>이메일</S.Label>
          <motion.div whileFocus={{ scale: 1.02 }}>
            <S.Input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
            />
          </motion.div>
        </S.InputGroup>

        <motion.button
          type="submit"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          style={{
            padding: '16px 24px',
            background: 'linear-gradient(135deg, #4a90e2, #357abd)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '10px',
            width: '100%',
            boxShadow: '0 6px 12px rgba(74, 144, 226, 0.2)',
          }}
        >
          재설정 링크 보내기
        </motion.button>
      </motion.form>

      <motion.div variants={itemVariants} style={{ textAlign: 'center', marginTop: '25px' }}>
        <motion.button
          onClick={() => switchForm('login')}
          whileHover={{ color: '#333', x: -5 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'none',
            border: 'none',
            color: '#666',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: '500',
            padding: '8px 16px',
            borderRadius: '8px',
          }}
        >
          ← 로그인으로 돌아가기
        </motion.button>
      </motion.div>
    </motion.div>
  );

  return (
    <S.LoginPage>
      <motion.div
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '40px',
          width: '100%',
          maxWidth: '450px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
        variants={cardVariants}
        initial="initial"
        animate={isAnimating ? 'exit' : 'enter'}
        whileHover={{
          y: -5,
          scale: 1.02,
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
          transition: { duration: 0.3 },
        }}
      >
        <AnimatePresence mode="wait">
          {currentForm === 'login' && renderLoginForm()}
          {currentForm === 'register' && renderRegisterForm()}
          {currentForm === 'reset' && renderResetForm()}
        </AnimatePresence>
      </motion.div>
    </S.LoginPage>
  );
}

export default LoginPage;
