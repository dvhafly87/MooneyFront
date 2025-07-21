import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/AccountBook.css';
import noExpImg from '../img/no_exp.png';

const AccountBookPage = () => {
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [memo, setMemo] = useState('');
  const [categories, setCategories] = useState(['식비', '교통비', '생활비']);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [entries, setEntries] = useState({ income: [], expense: [] });
  const [editingId, setEditingId] = useState(null);

  const MOCK_API_URL = 'https://687cf065918b6422433083ae.mockapi.io/entries';
  const CATEGORY_API_URL = 'https://687cf065918b6422433083ae.mockapi.io/category';

  const formatDateKey = (d) => d.toISOString().split('T')[0];

  const fetchDataByDate = async (targetDate) => {
    const key = formatDateKey(targetDate);
    try {
      const res = await fetch(MOCK_API_URL);
      const data = await res.json();
      const filtered = data.filter((e) => e.date === key);
      const income = filtered.filter((e) => e.type === '수입');
      const expense = filtered.filter((e) => e.type === '지출');
      setEntries({ income, expense });
    } catch (err) {
      console.error('불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchDataByDate(date);
  }, [date]);

  useEffect(() => {
    fetch(CATEGORY_API_URL)
      .then((res) => res.json())
      .then((data) => {
        const names = data.map((c) => c.name);
        setCategories(names);
      })
      .catch((err) => console.error('카테고리 불러오기 실패:', err));
  }, []);

  const handleSave = async () => {
    if (!type || !amount || Number(amount) <= 0 || selectedCategories.length === 0) {
      alert('모든 항목을 올바르게 입력해주세요.');
      return;
    }

    const entry = {
      date: formatDateKey(date),
      type,
      amount: Number(amount),
      category: selectedCategories,
      memo,
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`${MOCK_API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        });
      } else {
        res = await fetch(MOCK_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        });
      }

      if (!res.ok) throw new Error('저장 실패');

      setType('');
      setAmount('');
      setMemo('');
      setSelectedCategories([]);
      setEditingId(null);
      fetchDataByDate(date);
    } catch (err) {
      console.error(err);
      alert('⚠️ 저장 중 오류 발생');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제할까요?')) return;
    try {
      await fetch(`${MOCK_API_URL}/${id}`, { method: 'DELETE' });
      fetchDataByDate(date);
    } catch (err) {
      console.error('삭제 오류:', err);
    }
  };

  const handleEdit = (entry) => {
    setType(entry.type);
    setAmount(entry.amount);
    setSelectedCategories(entry.category);
    setMemo(entry.memo);
    setEditingId(entry.id);
    setDate(new Date(entry.date));
  };

  const addCustomCategory = async () => {
    if (customCategory && !categories.includes(customCategory)) {
      try {
        await fetch(CATEGORY_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: customCategory }),
        });

        setCategories([...categories, customCategory]);
        setCustomCategory('');
        setShowModal(false);
      } catch (err) {
        console.error('카테고리 저장 실패:', err);
      }
    }
  };

  const removeCategory = (catToRemove) => {
    setCategories(categories.filter((cat) => cat !== catToRemove));
    setSelectedCategories(selectedCategories.filter((cat) => cat !== catToRemove));
  };

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const formatDate = (d) => `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;

  return (
    <div className="ledger-container">
      <h2 className="ledger-title">수입지출</h2>
      <div className="ledger-grid">
        <div className="ledger-left">
          <p className="ledger-date">{formatDate(date)}</p>
          <Calendar value={date} onChange={(newDate) => setDate(newDate)} />

          <div className="ledger-entry-box">
            <h4>수입</h4>
            {entries.income.length > 0 ? (
              entries.income.map((e) => (
                <div key={e.id} className="entry income">
                  <span>{e.amount.toLocaleString()} 원</span>
                  <span className="tag">#{e.category?.join(', ')}</span>
                  <button onClick={() => handleEdit(e)}>수정</button>
                  <button onClick={() => handleDelete(e.id)}>삭제</button>
                </div>
              ))
            ) : (
              <div className="entry empty">
                <img src={noExpImg} alt="수입 없음" height={60} />
                <span>수입 내역이 없습니다</span>
              </div>
            )}
          </div>

          <div className="ledger-entry-box">
            <h4>지출</h4>
            {entries.expense.length > 0 ? (
              entries.expense.map((e) => (
                <div key={e.id} className="entry expense">
                  <span>{e.amount.toLocaleString()} 원</span>
                  <span className="tag">#{e.category?.join(', ')}</span>
                  <button onClick={() => handleEdit(e)}>✏</button>
                  <button onClick={() => handleDelete(e.id)}>🗑</button>
                </div>
              ))
            ) : (
              <div className="entry empty">
                <img src={noExpImg} alt="지출 없음" height={60} />
                <span>지출 내역이 없습니다</span>
              </div>
            )}
          </div>
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

          <label>카테고리 선택</label>
          <div className="category-list">
            {categories.map((cat) => (
              <div
                key={cat}
                className={`category-item ${selectedCategories.includes(cat) ? 'selected' : ''}`}
                onClick={() => toggleCategory(cat)}
              >
                <span>{cat}</span>
                <span className="remove-btn" onClick={() => removeCategory(cat)}>
                  ✕
                </span>
              </div>
            ))}
            <div className="category-add" onClick={() => setShowModal(true)}>
              ＋ 직접 입력하기
            </div>
          </div>

          <div className="selected-tags">
            {selectedCategories.map((cat, i) => (
              <span key={i} className="tag">
                #{cat}
                <button
                  className="tag-remove"
                  onClick={() => setSelectedCategories(selectedCategories.filter((c) => c !== cat))}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <label>
            메모
            <textarea
              placeholder="메모를 작성하세요"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </label>

          <div className="ledger-buttons">
            <button onClick={handleSave} className="save">
              {editingId ? '수정하기' : '저장'}
            </button>
            <button
              className="delete"
              onClick={() => {
                setType('');
                setAmount('');
                setMemo('');
                setSelectedCategories([]);
                setEditingId(null);
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
            <button onClick={addCustomCategory} className="save">
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
