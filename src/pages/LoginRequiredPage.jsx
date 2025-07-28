// src/pages/LoginRequiredPage.jsx
// 🔑 로그인이 필요한 페이지

import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../route/routes";

const LoginRequiredPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // 뒤로가기
  };

  const handleGoToLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        {/* 아이콘 */}
        <div style={iconStyle}>🔒</div>

        {/* 제목 */}
        <h1 style={titleStyle}>로그인이 필요합니다</h1>

        {/* 설명 */}
        <p style={descriptionStyle}>
          이 페이지를 보려면 먼저 로그인해주세요.
          <br />
          계정이 없으시다면 회원가입을 진행해주세요.
        </p>

        {/* 버튼들 */}
        <div style={buttonContainerStyle}>
          <button
            onClick={handleGoBack}
            style={backButtonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#6c757d")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#868e96")}
          >
            ← 뒤로가기
          </button>

          <button
            onClick={handleGoToLogin}
            style={loginButtonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
};

// 💄 스타일
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#f8f9fa",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
};

const contentStyle = {
  textAlign: "center",
  backgroundColor: "white",
  padding: "60px 40px",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
  maxWidth: "500px",
  width: "100%",
};

const iconStyle = {
  fontSize: "64px",
  marginBottom: "24px",
};

const titleStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#333",
  marginBottom: "16px",
  margin: "0 0 16px 0",
};

const descriptionStyle = {
  fontSize: "16px",
  color: "#666",
  lineHeight: "1.6",
  marginBottom: "40px",
  margin: "0 0 40px 0",
};

const buttonContainerStyle = {
  display: "flex",
  gap: "12px",
  justifyContent: "center",
  flexWrap: "wrap",
};

const baseButtonStyle = {
  padding: "12px 24px",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "background-color 0.2s",
  minWidth: "120px",
};

const backButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: "#868e96",
  color: "white",
};

const loginButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: "#007bff",
  color: "white",
};

export default LoginRequiredPage;
