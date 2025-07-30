// src/pages/ModifyUserPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../contexts/useAuth.jsx';
import BACK_USER_API from '../services/back/userApi.js';
import { ROUTES } from '../route/routes.js';
import S from '../styles/modifyUserPage.style.js';

const ModifyUserPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(false);

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    currentPassword: '',
    nickname: user?.nick || '',
    newPassword: '',
    confirmPassword: '',
    profilePhoto: null, // 🔥 File 객체를 저장
    profilePhotoPreview: null, // 🔥 미리보기용 URL
  });

  const [isNicknameChecked, setIsNicknameChecked] = useState(true);

  // 취소 버튼 처리
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

    setLoading(true);

    try {
      const result = await BACK_USER_API.checkNicknameDuplicate(formData.nickname);

      if (result.nickpossible) {
        toast.success(result.message);
        setIsNicknameChecked(true);
      } else {
        toast.error(result.message);
        setIsNicknameChecked(false);
      }
    } catch (error) {
      console.error('닉네임 중복 확인 오류:', error);
      toast.error(error.message || '닉네임 중복 확인 중 오류가 발생했습니다.');
      setIsNicknameChecked(false);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 프로필 사진 변경 - File 객체 직접 저장
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('파일 크기는 5MB 이하로 업로드해주세요.');
        return;
      }

      // 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        toast.error('이미지 파일만 업로드 가능합니다.');
        return;
      }

      // File 객체와 미리보기 URL 저장
      setFormData((prev) => ({
        ...prev,
        profilePhoto: file,
        profilePhotoPreview: URL.createObjectURL(file),
      }));

      toast.success('프로필 사진이 선택되었습니다.');
    }
  };

  // 🔥 이미지 렌더링 함수 수정
  const renderProfileImage = () => {
    // 새로 선택한 이미지가 있으면 미리보기 표시
    if (formData.profilePhotoPreview) {
      return (
        <S.ProfileImage
          src={formData.profilePhotoPreview}
          alt="프로필 미리보기"
        />
      );
    }

    // 기존 프로필 이미지 표시
    const hasImage = user?.pphoto && user.pphoto.trim() !== '';

    if (hasImage) {
      const imageUrl = user.pphoto.startsWith('data:')
        ? user.pphoto
        : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:7474'}/member.photo/${user.pphoto}`;

      return (
        <S.ProfileImage
          src={imageUrl}
          alt="현재 프로필"
          onError={(e) => {
            e.target.style.display = 'none';
            const defaultIcon = e.target.parentNode.querySelector('.default-icon');
            if (defaultIcon) defaultIcon.style.display = 'flex';
          }}
        />
      );
    }

    return <S.DefaultProfileIcon className="default-icon">👤</S.DefaultProfileIcon>;
  };

  // 🔥 폼 제출 처리 - FormData 사용
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 현재 비밀번호 필수 체크
    if (!formData.currentPassword.trim()) {
      toast.error('현재 비밀번호를 입력해주세요!');
      return;
    }

    // 변경사항이 있는지 확인
    const hasNicknameChange = formData.nickname !== user?.nick;
    const hasPasswordChange = formData.newPassword.trim() !== '';
    const hasImageChange = formData.profilePhoto !== null;

    if (!hasNicknameChange && !hasPasswordChange && !hasImageChange) {
      toast.info('변경할 정보를 선택해주세요.');
      return;
    }

    // 닉네임 변경 시 중복 확인 체크
    if (hasNicknameChange && !isNicknameChecked) {
      toast.error('닉네임 중복확인을 해주세요!');
      return;
    }

    // 새 비밀번호 유효성 검사
    if (hasPasswordChange) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('새 비밀번호가 일치하지 않습니다!');
        return;
      }

      if (formData.newPassword.length < 6) {
        toast.error('새 비밀번호는 6자 이상이어야 합니다!');
        return;
      }
    }

    if (!user) {
      toast.error('로그인이 필요합니다.');
      navigate(ROUTES.LOGIN);
      return;
    }

    setLoading(true);

    try {
      // 먼저 현재 비밀번호 확인
      const passwordResult = await BACK_USER_API.verifyPassword(
        user.loginId,
        formData.currentPassword,
      );

      if (!passwordResult.pwpossible) {
        toast.error('현재 비밀번호가 올바르지 않습니다.');
        return;
      }

      // 변경할 데이터 준비

      // 🔥 기존 updateUserInfo 메서드 사용 (이미 FormData 처리됨)
      const updateData = {};
      if (hasNicknameChange) updateData.nickname = formData.nickname;
      if (hasPasswordChange) updateData.password = formData.newPassword;
      if (hasImageChange) updateData.profilePhoto = formData.profilePhoto;

      const result = await BACK_USER_API.updateUserInfo(
        user.loginId,
        updateData,
        formData.currentPassword
      );

      if (result.resultD) {
        const changes = [];
        if (hasNicknameChange) changes.push('닉네임');
        if (hasPasswordChange) changes.push('비밀번호');
        if (hasImageChange) changes.push('프로필 사진');

        toast.success(`${changes.join(', ')}이(가) 성공적으로 수정되었습니다!`);

        // 비밀번호 변경 시 보안상 재로그인 요구
        if (hasPasswordChange) {
          await logout();
          toast.info('비밀번호가 변경되어 다시 로그인해주세요.');
          navigate(ROUTES.LOGIN);
        } else {
          navigate(ROUTES.USER);
        }
      } else {
        toast.error('회원정보 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원정보 수정 오류:', error);
      toast.error(error.message || '회원정보 수정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      // 🔥 미리보기 URL 정리
      if (formData.profilePhotoPreview) {
        URL.revokeObjectURL(formData.profilePhotoPreview);
      }
    }
  };

  return (
    <S.Container>
      <S.ModifyCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <S.Title>회원정보 수정</S.Title>
        <S.Subtitle>변경하고 싶은 정보만 선택해서 수정하세요</S.Subtitle>

        <S.Form onSubmit={handleSubmit}>
          {/* 현재 비밀번호 (필수) */}
          <S.RequiredSection>
            <S.SectionTitle>🔐 현재 비밀번호 확인 (필수)</S.SectionTitle>
            <S.InputGroup>
              <S.Label htmlFor="currentPassword">현재 비밀번호</S.Label>
              <S.Input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="현재 비밀번호를 입력해주세요"
                required
                disabled={loading}
                autoFocus
              />
              <S.HelpText>정보 수정을 위해 현재 비밀번호를 입력해주세요.</S.HelpText>
            </S.InputGroup>
          </S.RequiredSection>

          {/* 프로필 사진 (선택) */}
          <S.OptionalSection>
            <S.SectionTitle>🖼️ 프로필 사진 변경 (선택)</S.SectionTitle>
            <S.ProfileImageContainer>
              {renderProfileImage()}
              <S.ImageUploadButton
                type="button"
                onClick={() => document.getElementById('profileImage').click()}
                disabled={loading}
              >
                📷
              </S.ImageUploadButton>
            </S.ProfileImageContainer>
            <S.HiddenFileInput
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleProfileImageChange}
              disabled={loading}
            />
            <S.HelpText>클릭해서 새로운 프로필 사진을 선택하세요. (최대 5MB)</S.HelpText>
          </S.OptionalSection>

          {/* 닉네임 변경 (선택) */}
          <S.OptionalSection>
            <S.SectionTitle>👤 닉네임 변경 (선택)</S.SectionTitle>
            <S.InputGroup>
              <S.Label htmlFor="nickname">닉네임</S.Label>
              <S.NicknameInputGroup>
                <S.Input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  placeholder="새로운 닉네임을 입력해주세요"
                  style={{ flex: 1 }}
                  disabled={loading}
                />
                {formData.nickname !== user?.nick && (
                  <S.NicknameCheckButton
                    type="button"
                    onClick={handleNicknameCheck}
                    disabled={loading}
                  >
                    {loading ? '확인 중...' : '중복확인'}
                  </S.NicknameCheckButton>
                )}
              </S.NicknameInputGroup>
              <S.HelpText>현재 닉네임: {user?.nick}</S.HelpText>
            </S.InputGroup>
          </S.OptionalSection>

          {/* 비밀번호 변경 (선택) */}
          <S.OptionalSection>
            <S.SectionTitle>🔑 비밀번호 변경 (선택)</S.SectionTitle>
            <S.InputGroup>
              <S.Label htmlFor="newPassword">새 비밀번호</S.Label>
              <S.Input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="새 비밀번호를 입력해주세요"
                disabled={loading}
              />
              <S.HelpText>6자 이상 입력해주세요. 변경하지 않으려면 비워두세요.</S.HelpText>
            </S.InputGroup>

            {formData.newPassword && (
              <S.InputGroup>
                <S.Label htmlFor="confirmPassword">새 비밀번호 확인</S.Label>
                <S.Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="새 비밀번호를 다시 입력해주세요"
                  required
                  disabled={loading}
                />
              </S.InputGroup>
            )}
          </S.OptionalSection>

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
                  수정 중...
                </S.LoadingContainer>
              ) : (
                '수정 완료'
              )}
            </S.PrimaryButton>
          </S.ButtonGroup>
        </S.Form>
      </S.ModifyCard>
    </S.Container>
  );
};

export default ModifyUserPage;