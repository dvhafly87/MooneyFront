import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../route/routes.js';
import useAuth from '../contexts/useAuth.jsx';
import S from '../styles/userPage.style.js';

function UserPage() {
  const navigate = useNavigate();
  const { user, refreshUserInfo, loading } = useAuth();

  // 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트 시 사용자 정보 새로고침
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        setIsLoading(true);
        try {
          await refreshUserInfo();
        } catch (err) {
          setError('사용자 정보를 불러오는 중 오류가 발생했습니다.');
          console.error('사용자 정보 새로고침 오류:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserInfo();
  }, []);

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
    if (confirm('정말 회원 탈퇴 페이지로 이동하시겠습니까?')) {
      navigate(ROUTES.WITHDRAWAL);
    }
  };

  const goToHome = () => {
    navigate(ROUTES.ROOT);
  };

  // 포인트 사용 기능
  const usePoints = async () => {
    if (!user) return;

    const pointsToUse = prompt(
      `사용할 포인트를 입력하세요 (보유: ${user.ppnt?.toLocaleString()} P):`,
    );
    const points = parseInt(pointsToUse);

    if (!pointsToUse) return;

    if (isNaN(points) || points <= 0) {
      alert('올바른 포인트를 입력해주세요.');
      return;
    }

    if (points > (user.ppnt || 0)) {
      alert('보유 포인트가 부족합니다.');
      return;
    }

    // TODO: 실제 포인트 사용 API 호출
    alert(`${points.toLocaleString()} P가 사용되었습니다!`);

    // 사용자 정보 새로고침
    await refreshUserInfo();
  };

  console.log('🔍 사용자 정보 디버깅:');
  console.log('user:', user);
  console.log('user.regd:', user.regd, typeof user.regd);
  console.log('user.bir:', user.bir, typeof user.bir);
  console.log('formatDate(user.regd):', formatDate(user.regd));

  // 로딩 상태
  if (loading || isLoading) {
    return (
      <S.PageContainer>
        <S.Container>
          <S.Loading>불러오는 중...</S.Loading>
        </S.Container>
      </S.PageContainer>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <S.PageContainer>
        <S.Container>
          <S.Error>오류: {error}</S.Error>
        </S.Container>
      </S.PageContainer>
    );
  }

  // 사용자 데이터가 없을 때
  if (!user) {
    return (
      <S.PageContainer>
        <S.Container>
          <S.Error>로그인이 필요합니다.</S.Error>
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
          <S.ProfileImageContainer>
            <S.ProfileImage
              src={
                user.pphoto
                  ? user.pphoto.startsWith('data:')
                    ? user.pphoto
                    : `http://localhost:7474/member.photo/${user.pphoto}`
                  : 'https://via.placeholder.com/100x100/ddd/666?text=USER'
              }
              alt="프로필"
            />
          </S.ProfileImageContainer>
          <S.ProfileInfo>
            <S.Nickname>{user.nick} 님</S.Nickname>
            <S.InfoText>아이디: {user.loginId}</S.InfoText>
            <S.InfoText>가입일: {formatDate(user.regd)}</S.InfoText>
            {user.bir && <S.InfoText>생년월일: {formatDate(user.bir)}</S.InfoText>}
          </S.ProfileInfo>
        </S.ProfileSection>

        {/* 포인트 섹션 */}
        <S.PointSection>
          <S.PointCard>
            <S.PointIcon>💰</S.PointIcon>
            <S.PointInfo>
              <S.PointLabel>보유 포인트</S.PointLabel>
              <S.PointValue>{user.ppnt?.toLocaleString() ?? 0} P</S.PointValue>
            </S.PointInfo>
            <S.UsePointButton onClick={usePoints}>포인트 사용</S.UsePointButton>
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
