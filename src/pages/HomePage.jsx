import { useState } from 'react';
import TogglePage from './TogglePage';
import { Apexcharts } from '../components/Apexcharts';
import MyCalendar from '../components/MyCalendar';
import CategoryChart from '../components/CategoryChart';
import '../css/homepage.css';

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
            <div className="icome-card-title">수입</div>
            <Apexcharts win={70} defeat={30} />
            <div className="income-card-amount">20000 원</div>
          </div>

          <div className="outcome-card">
            <div className="outcome-card-title">지출</div>
            <Apexcharts win={40} defeat={60} />
          </div>

          <div className="chatbot-mooney">무니</div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
