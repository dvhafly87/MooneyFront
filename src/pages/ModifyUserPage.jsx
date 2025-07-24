import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../contexts/useAuth.jsx';
import { ROUTES } from '../route/routes.js';

// 스타일 컴포넌트들 (WithdrawalPage와 동일한 디자인)
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModifyCard = styled(motion.div)`
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

  &:disabled {
    background: #f5f5f5;
    color: #666;
  }
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
  background: #667eea;
  color: white;

  &:hover {
    background: #5a6fd8;
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

const ProfileImageSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
`;

const ProfileImageContainer = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e0e0e0;
`;

const ImageUploadButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;

  &:hover {
    background: #5a6fd8;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const NicknameCheckButton = styled.button`
  padding: 8px 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;

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

const ModifyUserPage = () => {
  const navigate = useNavigate();
  const { user, updateUserInfo, verifyPassword, checkNicknameDuplicate, refreshUserInfo, loading } =
    useAuth();

  // 현재 단계 상태 (1: 비밀번호 확인, 2: 정보 수정)
  const [currentStep, setCurrentStep] = useState(1);
  const [password, setPassword] = useState('');

  // 수정할 정보 상태
  const [formData, setFormData] = useState({
    nickname: user?.nick || '',
    newPassword: '',
    confirmPassword: '',
    profilePhoto: user?.pphoto || null,
  });

  const [isNicknameChecked, setIsNicknameChecked] = useState(true); // 기본적으로 현재 닉네임은 유효

  // 취소 버튼 처리 - UserPage로 돌아가기
  const handleCancel = () => {
    navigate(ROUTES.USER);
  };

  // 폼 데이터 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 닉네임이 변경되면 중복 확인 상태 초기화
    if (name === 'nickname' && value !== user?.nick) {
      setIsNicknameChecked(false);
    } else if (name === 'nickname' && value === user?.nick) {
      setIsNicknameChecked(true);
    }
  };

  // 1단계: 비밀번호 확인 (WithdrawalPage와 동일)
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

  // 닉네임 중복 확인
  const handleNicknameCheck = async () => {
    if (!formData.nickname.trim()) {
      toast.error('닉네임을 입력해주세요!');
      return;
    }

    if (formData.nickname === user?.nick) {
      setIsNicknameChecked(true);
      toast.info('현재 사용 중인 닉네임입니다.');
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

  // 프로필 사진 변경
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 실제 환경에서는 파일을 서버에 업로드하고 URL을 받아야 함
      // 여기서는 Mock으로 파일 이름만 저장
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          profilePhoto: event.target.result, // base64 URL
        }));
      };
      reader.readAsDataURL(file);
      toast.success('프로필 사진이 선택되었습니다.');
    }
  };

  // 2단계: 회원정보 수정
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.nickname.trim()) {
      toast.error('닉네임을 입력해주세요!');
      return;
    }

    if (!isNicknameChecked && formData.nickname !== user?.nick) {
      toast.error('닉네임 중복확인을 해주세요!');
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다!');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      toast.error('새 비밀번호는 6자 이상이어야 합니다!');
      return;
    }

    try {
      const updateData = {
        nickname: formData.nickname,
        profilePhoto: formData.profilePhoto,
      };

      // 새 비밀번호가 있으면 추가
      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      const result = await updateUserInfo(updateData);

      if (result.success) {
        toast.success('회원정보가 성공적으로 수정되었습니다!');

        // 사용자 정보 새로고침
        await refreshUserInfo();

        // UserPage로 이동
        navigate(ROUTES.USER);
      }
    } catch (error) {
      toast.error(error.message || '회원정보 수정 중 오류가 발생했습니다.');
    }
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
      <ModifyCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 단계 표시기 */}
        <StepIndicator>
          <StepDot active={currentStep >= 1} />
          <StepDot active={currentStep >= 2} />
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
              <Subtitle>회원정보 수정을 위해 현재 비밀번호를 입력해주세요.</Subtitle>

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

          {/* 2단계: 회원정보 수정 */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Title>회원정보 수정</Title>
              <Subtitle>수정하고 싶은 정보를 변경해주세요.</Subtitle>

              <Form onSubmit={handleUpdateSubmit}>
                {/* 프로필 사진 */}
                <ProfileImageSection>
                  <ProfileImageContainer>
                    <ProfileImage
                      src={
                        formData.profilePhoto
                          ? formData.profilePhoto.startsWith('data:')
                            ? formData.profilePhoto
                            : `http://localhost:7474/member.photo/${formData.profilePhoto}`
                          : 'https://via.placeholder.com/100x100/ddd/666?text=USER'
                      }
                      alt="프로필"
                    />
                    <ImageUploadButton
                      type="button"
                      onClick={() => document.getElementById('profileImage').click()}
                    >
                      📷
                    </ImageUploadButton>
                  </ProfileImageContainer>
                  <HiddenFileInput
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                  />
                </ProfileImageSection>

                {/* 🔥 아이디 (수정 불가) - loginId 필드 사용 */}
                <InputGroup>
                  <Label htmlFor="userId">아이디</Label>
                  <Input type="text" id="userId" value={user?.loginId || user?.id || ''} disabled />
                </InputGroup>

                {/* 닉네임 */}
                <InputGroup>
                  <Label htmlFor="nickname">닉네임</Label>
                  <NicknameInputGroup>
                    <Input
                      type="text"
                      id="nickname"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleInputChange}
                      placeholder="닉네임을 입력해주세요"
                      style={{ flex: 1 }}
                      required
                    />
                    {formData.nickname !== user?.nick && (
                      <NicknameCheckButton
                        type="button"
                        onClick={handleNicknameCheck}
                        disabled={loading}
                      >
                        중복확인
                      </NicknameCheckButton>
                    )}
                  </NicknameInputGroup>
                </InputGroup>

                {/* 새 비밀번호 */}
                <InputGroup>
                  <Label htmlFor="newPassword">새 비밀번호 (선택사항)</Label>
                  <Input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="새 비밀번호를 입력해주세요 (변경하지 않으려면 비워두세요)"
                  />
                </InputGroup>

                {/* 새 비밀번호 확인 */}
                {formData.newPassword && (
                  <InputGroup>
                    <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                    <Input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="새 비밀번호를 다시 입력해주세요"
                      required
                    />
                  </InputGroup>
                )}

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
                        저장중...
                      </div>
                    ) : (
                      '저장'
                    )}
                  </PrimaryButton>
                </ButtonGroup>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </ModifyCard>
    </Container>
  );
};

export default ModifyUserPage;
