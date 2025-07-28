// src/pages/DiaryPage.jsx - 성능 최적화 버전
import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/DiaryPage.css';
import diaryImg from '../img/pencil_mooney.png';
import CategoryChart from '../components/CategoryChart';
import AuthContext from '../contexts/AuthContext.jsx';

import BACK_EXPENSE_API from './../services/back/expenseApi';
import BACK_DIARY_API from './../services/back/diaryApi';

const DiaryPage = () => {
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [diaryText, setDiaryText] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 차트 로딩 상태 분리 (차트만 따로 로딩 상태 관리)
  const [isChartLoading, setIsChartLoading] = useState(false);

  const { user, isAuthenticated } = useContext(AuthContext);

  // 소비 내역 상태
  const [expenseData, setExpenseData] = useState({
    income: 0,
    totalExpense: 0,
    chartData: [],
  });

  // 날짜 포맷팅 함수를 useMemo로 캐싱
  const formatDisplayDate = useMemo(() => {
    return (d) => `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  }, []);

  // 금액 포맷팅 함수를 useCallback으로 캐싱
  const formatAmount = useCallback((amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  }, []);

  // 일기 데이터 로드 함수 - useCallback으로 최적화
  const loadDiaryData = useCallback(async () => {
    setIsLoading(true);
    try {
      const diaryResult = await BACK_DIARY_API.getDiaryByDate(date);

      if (diaryResult.data) {
        setDiaryText(diaryResult.data.text || '');
      } else {
        setDiaryText('');
      }
    } catch (error) {
      console.error('일기 데이터 로드 오류:', error);
      setDiaryText('');
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  // 소비 내역 로드 함수 - useCallback으로 최적화 & 비동기 처리
  const loadExpenseData = useCallback(async () => {
    setIsChartLoading(true);

    try {
      // 비동기로 처리하여 UI 블로킹 방지
      await new Promise((resolve) => setTimeout(resolve, 0));

      const dayExpenseData = BACK_EXPENSE_API.getExpensesByDate(date);

      // 데이터가 실제로 변경된 경우에만 상태 업데이트
      setExpenseData((prevData) => {
        const hasChanged =
          prevData.income !== dayExpenseData.income ||
          prevData.totalExpense !== dayExpenseData.totalExpense ||
          JSON.stringify(prevData.chartData) !== JSON.stringify(dayExpenseData.chartData);

        return hasChanged ? dayExpenseData : prevData;
      });
    } catch (error) {
      console.error('지출 데이터 로드 오류:', error);
      setExpenseData({
        income: 0,
        totalExpense: 0,
        chartData: [],
      });
    } finally {
      setIsChartLoading(false);
    }
  }, [date]);

  // 날짜가 바뀔 때마다 데이터 로드 - 의존성 배열 최적화
  useEffect(() => {
    if (isAuthenticated && user) {
      // 병렬로 실행하여 속도 향상
      Promise.all([loadDiaryData(), loadExpenseData()]);
    }
  }, [date, isAuthenticated, user, loadDiaryData, loadExpenseData]);

  // 일기 저장 함수 - useCallback으로 최적화
  const saveDiary = useCallback(async () => {
    if (!diaryText.trim()) {
      alert('일기 내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await BACK_DIARY_API.saveDiary(date, diaryText);
      setEditMode(false);
      await loadDiaryData(); // 저장 후 다시 로드
      console.log('일기 저장 완료');
    } catch (error) {
      console.error('일기 저장 오류:', error);
      alert('일기 저장 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [date, diaryText, loadDiaryData]);

  // 일기 삭제 함수 - useCallback으로 최적화
  const deleteDiary = useCallback(async () => {
    if (!window.confirm('정말로 이 일기를 삭제하시겠습니까?')) {
      return;
    }

    setIsLoading(true);
    try {
      await BACK_DIARY_API.deleteDiary(date);
      await loadDiaryData(); // 삭제 후 다시 로드
      console.log('일기 삭제 완료');
    } catch (error) {
      console.error('일기 삭제 오류:', error);
      alert('일기 삭제 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [date, loadDiaryData]);

  // 버튼 텍스트 계산을 useMemo로 캐싱
  const buttonText = useMemo(() => {
    if (isLoading) {
      return '⏳ 처리중...';
    }
    if (editMode) {
      return '💾 저장';
    }
    return diaryText.trim() ? '✏️ 수정하기' : '✏️ 일기 쓰기';
  }, [isLoading, editMode, diaryText]);

  // 버튼 클릭 핸들러를 useCallback으로 최적화
  const handleButtonClick = useCallback(() => {
    if (isLoading) return;

    if (editMode) {
      saveDiary();
    } else {
      setEditMode(true);
    }
  }, [isLoading, editMode, saveDiary]);

  // 달력 변경 핸들러를 useCallback으로 최적화
  const handleDateChange = useCallback((newDate) => {
    setDate(newDate);
    setShowCalendar(false);
    setEditMode(false); // 날짜 변경 시 편집 모드 해제
  }, []);

  // 로그인하지 않은 경우
  if (!isAuthenticated || !user) {
    return (
      <div className="diary-container">
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666',
            fontSize: '18px',
          }}
        >
          일기를 사용하려면 로그인이 필요합니다.
        </div>
      </div>
    );
  }

  return (
    <div className="diary-container">
      <div className="left-panel">
        <div className="today-phrase">🌿 오늘도 내 하루를 기록해요</div>

        <div className="header-row">
          <h2 onClick={() => setShowCalendar(!showCalendar)}>
            <img src={diaryImg} alt="다이어리 무니" className="diary-img" />
            {formatDisplayDate(date)} ▼
          </h2>

          <div className="diary-calendar-wrapper">
            {showCalendar && (
              <div className="diary-calendar-popup">
                <Calendar onChange={handleDateChange} value={date} />
              </div>
            )}
          </div>
        </div>

        <div className="summary-box">
          <p className="summary-title">📌 이 날의 소비 내역</p>
          {expenseData.income > 0 && (
            <p className="income">수입 : {formatAmount(expenseData.income)}원</p>
          )}
          <p className="expense">지출 : {formatAmount(expenseData.totalExpense)}원</p>

          {expenseData.totalExpense === 0 && expenseData.income === 0 ? (
            <div className="empty-expense-msg">
              <p style={{ color: '#999', fontSize: '14px', marginTop: '20px' }}>
                이 날은 소비 내역이 없습니다
              </p>
            </div>
          ) : (
            <div className="chart-wrapper">
              {/* 차트 로딩 상태 별도 관리 */}
              {isChartLoading ? (
                <div
                  style={{
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                  }}
                >
                  📊 차트 로딩 중...
                </div>
              ) : (
                <CategoryChart data={expenseData.chartData} />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="right-panel">
        <div className="diary-box">
          {/* 헤더에 삭제 버튼 추가 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Diary</h2>
            {!editMode && diaryText.trim() && !isLoading && (
              <button
                onClick={deleteDiary}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                🗑️ 삭제
              </button>
            )}
          </div>

          {/* 로딩 상태 표시 */}
          {isLoading && (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#666',
                fontSize: '16px',
              }}
            >
              ⏳ 로딩 중...
            </div>
          )}

          {/* 편집 모드 */}
          {!isLoading && editMode ? (
            <>
              <textarea
                value={diaryText}
                onChange={(e) => setDiaryText(e.target.value)}
                placeholder="오늘의 소비와 하루를 돌아보며 일기를 작성해보세요..."
              />
              <button onClick={handleButtonClick}>{buttonText}</button>
            </>
          ) : (
            /* 읽기 모드 */
            !isLoading && (
              <>
                <div className="lined-paper">
                  {diaryText ? (
                    diaryText.split('\n').map((line, idx) => (
                      <div className="paper-line" key={idx}>
                        {line || <span>&nbsp;</span>}
                      </div>
                    ))
                  ) : (
                    <p className="empty-msg">아직 작성된 일기가 없습니다 😊</p>
                  )}
                </div>
                <button onClick={handleButtonClick}>{buttonText}</button>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DiaryPage;
