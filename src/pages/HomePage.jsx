import { Link } from 'react-router-dom';
import { ROUTES } from '@route/routes.js';

function HomePage() {
  const pages = [
    { name: '챌린지', path: ROUTES.CHALLENGE },
    { name: '일기', path: ROUTES.DIARY },
    { name: '로그인', path: ROUTES.LOGIN },
    { name: '설정', path: ROUTES.SETTING },
    { name: '가계부', path: ROUTES.ACCOUNT_BOOK },
    { name: '구독', path: ROUTES.SUBSCRIPTION },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>대시보드</h2>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginTop: '20px',
        }}
      >
        {pages.map((page) => (
          <Link
            key={page.path}
            to={page.path}
            style={{
              padding: '10px 15px',
              backgroundColor: 'red',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
            }}
          >
            {page.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
