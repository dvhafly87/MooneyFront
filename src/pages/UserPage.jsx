// src/pages/UserPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ROUTES } from '../route/routes.js';
import useAuth from '../contexts/useAuth.jsx';
import BACK_USER_API from '../services/back/userApi.js'; // 🔥 직접 API import
import S from '../styles/userPage.style.js';

function UserPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // 🔥 user와 logout만 사용

  // 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null); // 🔥 사용자 정보 직접 관리

  // 🔥 사용자 정보 직접 조회
  const fetchUserInfo = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    console.log('사용자 정보 조회 시작:', user.loginId);
    try {
      const result = await BACK_USER_API.getUserInfo(user.loginId);

      if (result) {
        setUserInfo(result.Meminfo);
      } else {
        setError('사용자 정보를 불러올 수 없습니다.');
      }
    } catch (err) {
      console.error('사용자 정보 조회 오류:', err);
      setError(err.message || '사용자 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 사용자 정보 조회
  useEffect(() => {
    fetchUserInfo();
  }, [user?.loginId]);

  // 날짜 포맷팅 함수
  const formatDate = (str) => {
    if (!str) return '-';
    return new Date(str).toLocaleDateString('ko-KR');
  };

  // 페이지 이동 함수들
  const goToEdit = () => {
    navigate(ROUTES.MODIFY_USER);
  };

  const goToExit = () => {
    if (window.confirm('정말 회원 탈퇴 페이지로 이동하시겠습니까?')) {
      navigate(ROUTES.WITHDRAWAL);
    }
  };

  const goToHome = () => {
    navigate(ROUTES.ROOT);
  };

  // 🔥 포인트 사용 기능 - 실제 API 호출 구현
  const usePoints = async () => {
    if (!userInfo) {
      toast.error('사용자 정보를 먼저 불러와주세요.');
      return;
    }

    const pointsToUse = window.prompt(
      `사용할 포인트를 입력하세요 (보유: ${userInfo.ppnt?.toLocaleString()} P):`,
    );

    if (!pointsToUse) return; // 취소한 경우

    const points = parseInt(pointsToUse);

    // 입력값 검증
    if (isNaN(points) || points <= 0) {
      toast.error('올바른 포인트를 입력해주세요.');
      return;
    }

    if (points > (userInfo.ppnt || 0)) {
      toast.error('보유 포인트가 부족합니다.');
      return;
    }

    setIsLoading(true);

    try {
      // 🔥 포인트 사용 API 호출 (실제 구현 시 필요)
      // const result = await BACK_USER_API.usePoints(points);
      //
      // if (result.success) {
      //   toast.success(`${points.toLocaleString()} P가 사용되었습니다!`);
      //   // 사용자 정보 새로고침
      //   await fetchUserInfo();
      // } else {
      //   toast.error('포인트 사용에 실패했습니다.');
      // }

      // 🔥 임시 구현: 포인트 사용 API가 없으므로 Mock 처리
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 로딩 시뮬레이션

      toast.success(`${points.toLocaleString()} P가 사용되었습니다!`);

      // 사용자 정보 새로고침
      await fetchUserInfo();
    } catch (error) {
      console.error('포인트 사용 오류:', error);
      toast.error(error.message || '포인트 사용 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 간단한 이미지 렌더링 함수
  const renderProfileImage = (pphoto) => {
    // 이미지가 있는지 확인
    const hasImage = pphoto && (pphoto.startsWith('data:') || pphoto.trim() !== '');

    if (hasImage) {
      const imageUrl = pphoto.startsWith('data:')
        ? pphoto
        : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:7474'}/member.photo/${pphoto}`;

      return (
        <S.ProfileImage
          src={imageUrl}
          alt="프로필"
          onError={(e) => {
            // 로드 실패 시 기본 아이콘으로 교체
            e.target.style.display = 'none';
            const defaultIcon = e.target.parentNode.querySelector('.default-icon');
            if (defaultIcon) defaultIcon.style.display = 'flex';
          }}
        />
      );
    }

    // 기본 아이콘
    return (
      <div
        className="default-icon"
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: '#f5f5f5',
          border: '3px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          color: '#ccc',
        }}
      >
        👤
      </div>
    );
  };

  // 로딩 상태
  if (isLoading && !userInfo) {
    return (
      <S.PageContainer>
        <S.Container>
          <S.Loading>사용자 정보를 불러오는 중...</S.Loading>
        </S.Container>
      </S.PageContainer>
    );
  }

  // 에러 상태
  if (error && !userInfo) {
    return (
      <S.PageContainer>
        <S.Container>
          <S.Error>오류: {error}</S.Error>
        </S.Container>
      </S.PageContainer>
    );
  }

  // 로그인하지 않은 상태
  if (!user) {
    return (
      <S.PageContainer>
        <S.Container>
          <S.Error>로그인이 필요합니다.</S.Error>
        </S.Container>
      </S.PageContainer>
    );
  }

  // 사용자 정보가 아직 로드되지 않은 상태
  if (!userInfo) {
    return (
      <S.PageContainer>
        <S.Container>
          <S.Loading>사용자 정보를 준비 중...</S.Loading>
        </S.Container>
      </S.PageContainer>
    );
  }

  return (
    <S.PageContainer>
      {/* 헤더 */}
      <S.Header>
        <S.Title>마이페이지</S.Title>
        <S.HomeButton onClick={goToHome}>홈으로</S.HomeButton>
      </S.Header>

      {/* 메인 컨텐츠 */}
      <S.Container>
        {/* 프로필 섹션 */}
        <S.ProfileSection>
          <S.ProfileImageContainer>{renderProfileImage(userInfo.pphoto)}</S.ProfileImageContainer>
          <S.ProfileInfo>
            <S.Nickname>{userInfo.nick} 님</S.Nickname>
            <S.InfoText>아이디: {userInfo.id}</S.InfoText>
            <S.InfoText>가입일: {formatDate(userInfo.regd)}</S.InfoText>
            {userInfo.bir && <S.InfoText>생년월일: {formatDate(userInfo.bir)}</S.InfoText>}
          </S.ProfileInfo>
        </S.ProfileSection>

        {/* 포인트 섹션 */}
        <S.PointSection>
          <S.PointCard>
            <S.PointIcon>💰</S.PointIcon>
            <S.PointInfo>
              <S.PointLabel>보유 포인트</S.PointLabel>
              <S.PointValue>{userInfo.ppnt?.toLocaleString() ?? 0} P</S.PointValue>
            </S.PointInfo>
            <S.UsePointButton onClick={usePoints} disabled={isLoading}>
              포인트 사용
            </S.UsePointButton>
          </S.PointCard>
        </S.PointSection>

        {/* 계정 관리 섹션 */}
        <S.Section>
          <S.SectionTitle>계정 관리</S.SectionTitle>
          <S.ActionButtons>
            <S.EditButton onClick={goToEdit}>개인정보 수정</S.EditButton>
            <S.ExitButton onClick={goToExit}>회원 탈퇴</S.ExitButton>
          </S.ActionButtons>
        </S.Section>
      </S.Container>
    </S.PageContainer>
  );
}

export default UserPage;
