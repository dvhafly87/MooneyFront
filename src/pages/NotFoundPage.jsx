// src/pages/NotFoundPage.jsx
// 🚫 404 페이지

import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // 뒤로가기
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        {/* 404 숫자 */}
        <div style={numberStyle}>404</div>

        {/* 제목 */}
        <h1 style={titleStyle}>페이지를 찾을 수 없습니다</h1>

        {/* 설명 */}
        <p style={descriptionStyle}>
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          <br />
          주소를 다시 확인해주세요.
        </p>

        {/* 버튼 */}
        <button
          onClick={handleGoBack}
          style={buttonStyle}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          ← 뒤로가기
        </button>
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

const numberStyle = {
  fontSize: "96px",
  fontWeight: "bold",
  color: "#dee2e6",
  marginBottom: "24px",
  lineHeight: "1",
};

const titleStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#495057",
  marginBottom: "16px",
  margin: "0 0 16px 0",
};

const descriptionStyle = {
  fontSize: "16px",
  color: "#6c757d",
  lineHeight: "1.6",
  marginBottom: "40px",
  margin: "0 0 40px 0",
};

const buttonStyle = {
  padding: "12px 24px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "background-color 0.2s",
  minWidth: "120px",
};

export default NotFoundPage;
