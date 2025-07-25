import { useState, useEffect } from 'react';
import TogglePage from './TogglePage';
import { Apexcharts } from '../components/Apexcharts';
import MyCalendar from '../components/MyCalendar';
import CategoryChart from '../components/CategoryChart';
import '../css/homepage.css';
import chatImg from '../img/chatbotmooney.png';

const BASE_URL = 'http://192.168.0.4:7474';
const MEMBER_ID = 'hhhh234';

function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [monthlyData, setMonthlyData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayDetail, setDayDetail] = useState({ income: 0, expense: 0 });
  const [categoryData, setCategoryData] = useState([]);

  const fetchMonthlyData = async () => {
    const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    const format = (d) => d.toISOString().split('T')[0];

    try {
      const res = await fetch(
        `${BASE_URL}/expenses/member/${MEMBER_ID}/by-date-range?startDate=${format(
          start,
        )}&endDate=${format(end)}`,
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
      <TogglePage onToggle={setSidebarOpen} isLoggedIn={true} userId="user01" />

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

          <div className="chatbot-mooney">
            <div className="chatbot-bubble">
              <p>
                무니가 예측한 지출은 <span className="highlight">72,000</span>원이에요.
                <br />
                목표에 맞을까요?
              </p>
            </div>
            <img src={chatImg} alt="챗봇 무니" className="chatboticon" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
