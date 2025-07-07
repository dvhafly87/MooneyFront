import { Link } from 'react-router-dom';

function HomePage() {
  const pages = [
    { name: '챌린지', path: '/challenge' },
    { name: '리포트', path: '/reports' },
    { name: '일기', path: '/diary' },
    { name: '로그인', path: '/login' },
    { name: '설정', path: '/setting' },
    { name: '가계부', path: 'accountbook' },
    { name: '구독', path: 'subscription' },
  ];

  return (
    <div>
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
    </div>
  );
}

export default HomePage;
