import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';

function Diary() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <Header />
      <div style={{ padding: '20px' }}>
        <h2>일기 페이지</h2>
        <Link to="/" style={{ color: 'blue' }}>
          대시보드로
        </Link>
        <button onClick={handleGoBack}>뒤로가기</button>
      </div>
    </div>
  );
}

export default Diary;
