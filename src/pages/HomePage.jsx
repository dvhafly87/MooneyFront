import { useState } from 'react';
import TogglePage from './TogglePage';
import { Apexcharts } from '../components/Apexcharts';
import MyCalendar from '../components/MyCalendar';
import CategoryChart from '../components/CategoryChart';
import '../css/homepage.css';
import chatImg from '../img/chatbotmooney.png';

function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isLoggedIn = true;
  const userId = 'user01';

  return (
    <div className={`homepage-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <TogglePage onToggle={setSidebarOpen} isLoggedIn={isLoggedIn} userId={userId} />

      <div className="main-content-wrapper">
        <div className="left-column">
          <div className="calender-container">
            <MyCalendar />
            <CategoryChart />
          </div>
        </div>

        <div className="right-column">
          <div className="income-card">
            <div className="income-card-left">
              <div className="icome-card-title">수입</div>
              <div className="income-card-amount">20000 원</div>
            </div>
            <div className="income-card-chart">
              <Apexcharts win={70} defeat={30} />
            </div>
          </div>

          <div className="outcome-card">
            <div className="outcome-card-left">
              <div className="outcome-card-title">지출</div>
              <div className="outcome-card-amount">20000 원</div>
            </div>
            <div className="outcome-card-chart">
              <Apexcharts win={70} defeat={30} />
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
