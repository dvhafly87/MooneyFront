import { Link } from 'react-router-dom';

function Header() {
  return (
    <div style={{ width: 'window.width', height: '100px', backgroundColor: 'lightgray' }}>
      <Link to="/">
        <img src="src/img/logo.png" width="100px" />
      </Link>
    </div>
  );
}

export default Header;
