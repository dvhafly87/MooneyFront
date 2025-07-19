import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/DiaryPage.css';
import diaryImg from '../img/pencil_mooney.png';
import CategoryChart from '../components/CategoryChart';

const DiaryPage = () => {
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [diaryText, setDiaryText] = useState('');
  const [savedDiaries, setSavedDiaries] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [mood, setMood] = useState('😀');
  const [summary, setSummary] = useState('');

  const formatDateKey = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(
      2,
      '0',
    )}`;

  const formatDisplayDate = (d) => `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;

  useEffect(() => {
    const stored = localStorage.getItem('diaries');
    if (stored) {
      const parsed = JSON.parse(stored);
      setSavedDiaries(parsed);
      const key = formatDateKey(date);
      setDiaryText(parsed[key]?.text || '');
      setSummary(parsed[key]?.summary || '');
      setMood(parsed[key]?.mood || '😀');
    }
  }, [date]);

  const saveDiary = () => {
    const key = formatDateKey(date);
    const updated = {
      ...savedDiaries,
      [key]: {
        text: diaryText,
        summary,
        mood,
      },
    };
    setSavedDiaries(updated);
    localStorage.setItem('diaries', JSON.stringify(updated));
    setEditMode(false);
  };

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
                <Calendar
                  onChange={(newDate) => {
                    setDate(newDate);
                    setShowCalendar(false);
                  }}
                  value={date}
                />
              </div>
            )}
          </div>
        </div>

        <div className="summary-box">
          <p className="summary-title">📌 이 날의 소비 내역</p>
          <p className="income">수입 : 2,000,000원</p>
          <p className="expense">지출 : 20,000원</p>
          <div className="chart-wrapper">
            <CategoryChart />
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="diary-box">
          <h2>Diary</h2>

          {editMode ? (
            <>
              <textarea value={diaryText} onChange={(e) => setDiaryText(e.target.value)} />
              <textarea
                className="one-line-thought"
                placeholder="오늘의 한 줄 요약 ✍️"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
              <div className="mood-selector">
                오늘 기분:
                {['😀', '😐', '😴', '😔'].map((face) => (
                  <span
                    key={face}
                    onClick={() => setMood(face)}
                    style={{ opacity: mood === face ? 1 : 0.4 }}
                  >
                    {face}
                  </span>
                ))}
              </div>
              <button onClick={saveDiary}>💾 저장</button>
            </>
          ) : (
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
              <div className="summary-and-mood">
                <p className="summary-display">오늘의 한 마디: {summary || '💬'}</p>
                <p className="mood-display">오늘 기분: {mood}</p>
              </div>
              <button onClick={() => setEditMode(true)}>✏️ 수정하기</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiaryPage;
