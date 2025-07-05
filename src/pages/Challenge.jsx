import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';

function Challenge() {
  return (
    <div>
      <Header />
      <div style={{ padding: '20px' }}>
        <h2>챌린지 페이지</h2>
        <Link to="/" style={{ color: 'blue' }}>
          대시보드로
        </Link>
      </div>
    </div>
  );
}

export default Challenge;
