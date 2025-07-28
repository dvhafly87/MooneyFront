import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Apexcharts } from '../components/Apexcharts';
import MyCalendar from '../components/MyCalendar';
import CategoryChart from '../components/CategoryChart';
import '../css/homepage.css';
import chatImg from '../img/chatbotmooney.png';
import ChatBotModal from '../components/ChatBotModal';


const BASE_URL = 'http://localhost:7474';
const MEMBER_ID = 'hhhh234';



function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [monthlyData, setMonthlyData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayDetail, setDayDetail] = useState({ income: 0, expense: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [showChatModal, setShowChatModal] = useState(false);

  const fetchMonthlyData = async () => {
    const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    const format = (d) => {
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1, 두 자리로 포맷
      const day = d.getDate().toString().padStart(2, '0');         // 일은 두 자리로 포맷
      return `${year}-${month}-${day}`;
    };

    try {
      const res = await fetch(
        `${BASE_URL}/expenses/member/${MEMBER_ID}/by-date-range?startDate=${format(start)}&endDate=${format(end)}`,
      );
      const data = await res.json();

      const map = {};
      const catMap = {};

      data.forEach((e) => {
        const date = e.mexpDt;
        if (!map[date]) map[date] = { income: 0, expense: 0 };
        if (e.mexpType === 'I') map[date].income += e.mexpAmt;
        else if (e.mexpType === 'E') map[date].expense += e.mexpAmt;

        if (e.mexpType === 'E') {
          const cname = e.category?.mcatName || '기타';
          if (!catMap[cname]) catMap[cname] = 0;
          catMap[cname] += e.mexpAmt;
        }
      });

      setMonthlyData(map);

      const chartData = Object.entries(catMap).map(([category, amount]) => ({
        category,
        amount,
      }));
      setCategoryData(chartData);
    } catch (err) {
      console.error('❌ 월간 데이터 불러오기 실패', err);
    }
  };

  const updateSelectedDayDetail = (date) => {
    const key = date.toISOString().split('T')[0];
    const data = monthlyData[key] || { income: 0, expense: 0 };
    setDayDetail(data);
  };

  useEffect(() => {
    fetchMonthlyData();
  }, [selectedDate]);

  useEffect(() => {
    updateSelectedDayDetail(selectedDate);
  }, [monthlyData, selectedDate]);

  return (
    <div className={`homepage-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar onToggle={setSidebarOpen} isLoggedIn={true} userId="user01" />

      <div className="main-content-wrapper">
        <div className="left-column">
          <div className="calender-container">
            <MyCalendar
              value={selectedDate}
              onChange={(d) => setSelectedDate(d)}
              financeData={monthlyData}
            />
            <CategoryChart data={categoryData} />
          </div>
        </div>

        <div className="right-column">
          <div className="income-card">
            <div className="income-card-left">
              <div className="icome-card-title">수입</div>
              <div className="income-card-amount">{dayDetail.income.toLocaleString()} 원</div>
            </div>
            <div className="income-card-chart">
              <Apexcharts
                key={`chart-${dayDetail.income}-${dayDetail.expense}`}
                win={dayDetail.income}
                defeat={dayDetail.expense}
              />
            </div>
          </div>

          <div className="outcome-card">
            <div className="outcome-card-left">
              <div className="outcome-card-title">지출</div>
              <div className="outcome-card-amount">{dayDetail.expense.toLocaleString()} 원</div>
            </div>
            <div className="outcome-card-chart">
              <Apexcharts
                key={`chart-${dayDetail.income}-${dayDetail.expense}`}
                win={dayDetail.income}
                defeat={dayDetail.expense}
              />
            </div>
          </div>

          {/* 챗봇 무니 카드 */}
          <div
            onClick={() => setShowChatModal(true)}
            style={{
              cursor: 'pointer',
              position: 'relative',
              height: '170px',
              width: '342px',
              backgroundColor: '#f4f4f4',
              borderRadius: '30px',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              overflow: 'visible',
            }}
          >
            <div
              style={{
                background: '#e0e0e0',
                borderRadius: '25px',
                padding: '20px',
                maxWidth: '200px',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#222',
                position: 'relative',
                boxShadow: 'inset 0px 0px 6px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-20px)',
              }}
            >
              <p style={{ margin: 0 }}>
                무니가 예측한 지출은{' '}
                <span style={{ color: '#e53935', fontWeight: 'bold' }}>72,000</span>원이에요.
                <br />
                목표에 맞을까요?
              </p>
              <div
                style={{
                  position: 'absolute',
                  right: '-12px',
                  bottom: '20px',
                  width: 0,
                  height: 0,
                  borderTop: '10px solid transparent',
                  borderBottom: '10px solid transparent',
                  borderLeft: '12px solid #e0e0e0',
                }}
              />
            </div>
            <img
              src={chatImg}
              alt="챗봇 무니"
              className="chatboticon"
              style={{ height: '110px' }}
            />
          </div>
        </div>
      </div>

      {/* 모달 컴포넌트 */}
      {showChatModal && <ChatBotModal onClose={() => setShowChatModal(false)} />}
    </div>
  );
}

export default HomePage;
