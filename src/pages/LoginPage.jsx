function LoginPage() {
  return (
    <div>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>로그인 페이지</h2>
        <br />
        <label htmlFor="loginID">ID</label> <input type="text" id="loginID" />
        <br />
        <label htmlFor="loginPW">PW</label> <input type="text" id="loginPW" />
      </div>
    </div>
  );
}

export default LoginPage;
