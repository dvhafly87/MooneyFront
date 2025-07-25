import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/AccountBook.css';
import noExpImg from '../img/no_exp.png';

const BASE_URL = 'http://192.168.0.4:7474';
const MEMBER_ID = 'hhhh234';

const AccountBookPage = () => {
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [entries, setEntries] = useState({ income: [], expense: [] });
  const [editTarget, setEditTarget] = useState(null);
  const [repeat, setRepeat] = useState(false);

  const formatDateKey = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/categories/member/${MEMBER_ID}`);
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (err) {
      console.error('❌ 카테고리 불러오기 실패:', err);
    }
  };

  const fetchEntriesByDate = async (targetDate) => {
    const dateStr = formatDateKey(targetDate);
    try {
      const res = await fetch(
        `${BASE_URL}/expenses/member/${MEMBER_ID}/by-date-range?startDate=${dateStr}&endDate=${dateStr}`,
      );
      const data = await res.json();
      setEntries({
        income: data.filter((e) => e.mexpType === 'I'),
        expense: data.filter((e) => e.mexpType === 'E'),
      });
    } catch (err) {
      console.error('❌ 수입지출 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchEntriesByDate(date);
  }, []);

  const handleDateChange = (d) => {
    setDate(d);
    fetchEntriesByDate(d);
  };

  const handleSave = async () => {
    console.log('💾 저장 직전 메모:', memo);
    if (!type || !amount || !selectedCategoryId || Number(amount) <= 0 || memo.trim() === '') {
      alert('⚠️ 모든 항목을 입력해주세요.');
      return;
    }

    const payload = {
      mexpDt: formatDateKey(date),
      mexpAmt: Number(amount),
      mexpDec: memo,
      mexpType: type === '수입' ? 'I' : 'E',
      mexpRpt: repeat ? 'T' : 'F',
      mexpStatus: 'COMPLETED',
      memberId: MEMBER_ID,
    };
    try {
      if (editTarget) {
        await fetch(`${BASE_URL}/expenses/member/${MEMBER_ID}?mcatId=${selectedCategoryId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            mexpId: editTarget.mexpId,
          }),
        });
      } else {
        await fetch(`${BASE_URL}/expenses/member/${MEMBER_ID}?mcatId=${selectedCategoryId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setType('');
      setAmount('');
      setMemo('');
      setSelectedCategoryId(null);
      setEditTarget(null);
      fetchEntriesByDate(date);
    } catch (err) {
      console.error('❌ 저장 실패:', err);
    }
  };

  const handleDelete = async (entryId) => {
    if (!entryId) return;
    const confirmed = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmed) return;
    try {
      const res = await fetch(`${BASE_URL}/expenses/${entryId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('삭제 실패');
      fetchEntriesByDate(date);
    } catch (err) {
      console.error('❌ 삭제 실패:', err);
    }
  };

  const handleEdit = (entry) => {
    setEditTarget(entry);
    setType(entry.mexpType === 'I' ? '수입' : '지출');
    setAmount(entry.mexpAmt.toString());
    setMemo(entry.mexpDec);
    setSelectedCategoryId(entry.category?.mcatId || null);
    setDate(new Date(entry.mexpDt));
  };

  const handleAddCategory = async () => {
    if (!customCategory.trim()) return;
    try {
      await fetch(`${BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mcatName: customCategory,
          mcatColor: '#AAAAAA',
          mcatId: Date.now().toString(),
          memberId: MEMBER_ID,
        }),
      });
      setCustomCategory('');
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      console.error('❌ 카테고리 추가 실패:', err);
    }
  };

  const handleDeleteCategory = async (mcatId) => {
    try {
      await fetch(`${BASE_URL}/categories/${mcatId}`, { method: 'DELETE' });
      fetchCategories();
      if (selectedCategoryId === mcatId) setSelectedCategoryId(null);
    } catch (err) {
      console.error('❌ 카테고리 삭제 실패:', err);
    }
  };

  const formatDate = (d) => `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;

  return (
    <div className="ledger-container">
      <h2 className="ledger-title">수입지출</h2>
      <div className="ledger-grid">
        <div className="ledger-left">
          <p className="ledger-date">{formatDate(date)}</p>
          <Calendar value={date} onChange={handleDateChange} />

          {[
            { title: '수입', key: 'income' },
            { title: '지출', key: 'expense' },
          ].map((section) => (
            <div className="ledger-entry-box" key={section.key}>
              <h4>{section.title}</h4>
              {entries[section.key].length > 0 ? (
                entries[section.key].map((e) => (
                  <div key={e.mexpId} className={`entry ${section.key}`}>
                    <span>{e.mexpAmt.toLocaleString()} 원</span>
                    <span className="tag">#{e.category?.mcatName}</span>
                    <button onClick={() => handleEdit(e)}>수정</button>
                    <button onClick={() => handleDelete(e.mexpId)}>삭제</button>
                  </div>
                ))
              ) : (
                <div className="entry empty">
                  <img src={noExpImg} alt="내역 없음" height={60} />
                  <span>{section.title} 내역이 없습니다</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="ledger-right">
          <label>
            거래 유형
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">선택</option>
              <option value="수입">수입</option>
              <option value="지출">지출</option>
            </select>
          </label>

          <label>
            금액 입력
            <input
              type="number"
              placeholder="예: 20000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <div className="repeat-checkbox">
            <label htmlFor="repeat">💡 반복되는 지출인가요?</label>
            <input
              id="repeat"
              type="checkbox"
              checked={repeat}
              onChange={(e) => setRepeat(e.target.checked)}
            />
          </div>

          <label>카테고리 선택</label>
          <div className="category-list">
            {categories.map((cat) => (
              <div
                key={cat.mcatId}
                className={`category-item ${selectedCategoryId === cat.mcatId ? 'selected' : ''}`}
              >
                <span onClick={() => setSelectedCategoryId(cat.mcatId)}>{cat.mcatName}</span>
                <span className="remove-btn" onClick={() => handleDeleteCategory(cat.mcatId)}>
                  ✕
                </span>
              </div>
            ))}
            <div className="category-add" onClick={() => setShowModal(true)}>
              ＋ 직접 입력하기
            </div>
          </div>

          {selectedCategoryId && (
            <div className="selected-tag">
              <span className="tag">
                #{categories.find((cat) => cat.mcatId === selectedCategoryId)?.mcatName}
              </span>
              <button className="tag-remove" onClick={() => setSelectedCategoryId(null)}>
                ✕
              </button>
            </div>
          )}

          <label>
            메모
            <textarea
              placeholder="메모를 작성하세요 📊 작성하신 메모로 AI가 분석해드려요!"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </label>

          <div className="ledger-buttons">
            <button className="save" onClick={handleSave}>
              {editTarget ? '수정 완료' : '저장'}
            </button>
            <button
              className="delete"
              onClick={() => {
                setType('');
                setAmount('');
                setMemo('');
                setSelectedCategoryId(null);
                setEditTarget(null);
              }}
            >
              취소
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="category-modal">
          <h4>카테고리 직접 입력</h4>
          <input
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="새 카테고리 입력"
          />
          <div className="modal-buttons">
            <button onClick={handleAddCategory} className="save">
              저장
            </button>
            <button onClick={() => setShowModal(false)} className="cancel">
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountBookPage;
