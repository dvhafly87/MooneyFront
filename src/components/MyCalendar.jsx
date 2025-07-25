import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/calendar.css';

function MyCalendar({ value, onChange, financeData }) {
  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  return (
    <div className="calendar-wrapper">
      <Calendar
        onChange={onChange}
        value={value}
        calendarType="gregory"
        showNeighboringMonth={false}
        tileContent={({ date, view }) => {
          const key = formatDate(date);
          const data = financeData[key];

          return view === 'month' ? (
            <div className="calendar-cell-content">
              <div className="calendar-finance fixed-height">
                {data ? (
                  <>
                    {data.income > 0 && (
                      <div className="income">+{data.income.toLocaleString()}원</div>
                    )}
                    {data.expense > 0 && (
                      <div className="expense">-{data.expense.toLocaleString()}원</div>
                    )}
                  </>
                ) : (
                  <>
                    <div style={{ height: '1em' }}></div>
                    <div style={{ height: '1em' }}></div>
                  </>
                )}
              </div>
              <div className="calendar-underline" />
            </div>
          ) : null;
        }}
      />
    </div>
  );
}

export default MyCalendar;
