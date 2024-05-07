import React, { useState } from "react";
import useCustomLogin from "../../hooks/useCustomLoginPage";
import KakaoLoginComponent from "./KakaoLoginComponent";
import { useNavigate } from "react-router-dom";

const LoginComponent = () => {
  const [loginParam, setLoginParam] = useState({ email: "", pw: "" });
  const { doLogin, moveToPath } = useCustomLogin();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginParam((prev) => ({ ...prev, [name]: value }));
  };

  const handleClickLogin = async () => {
    doLogin(loginParam).then((data) => {
      if (data.error) {
        alert("이메일과 패스워드를 다시 확인하세요");
      } else {
        alert("로그인 성공");
        moveToPath("/");
      }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleClickLogin();
    }
  };

  const styles = {
    loginWrap: {
      maxWidth: "400px",
      margin: "40px auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      backgroundColor: "#f7f7f7",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    inputSection: {
      marginBottom: "15px",
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "5px 0",
      border: "1px solid #ddd",
      borderRadius: "4px",
    },
    button: {
      width: "100%",
      padding: "10px 0",
      backgroundColor: "#000",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginTop: "10px",
      fontSize: "1rem",
    },

    title: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "1.5rem",
      color: "#333",
    },
  };

  return (
    <div style={{ minHeight: 700 }}>
      <div style={styles.loginWrap}>
        <div style={styles.title}>
          <span>로그인을 해주세요</span>
        </div>
        <div style={styles.inputSection}>
          <input
            style={styles.input}
            name="email"
            type="text"
            placeholder="이메일"
            value={loginParam.email}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
          <input
            style={styles.input}
            name="pw"
            type="password"
            placeholder="비밀번호"
            value={loginParam.pw}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
        </div>
        <button style={styles.button} onClick={handleClickLogin}>
          로그인
        </button>
        <button
          style={styles.button}
          onClick={() => navigate("/user/reset-pw")}
        >
          비밀번호 찾기
        </button>
        <button style={styles.button} onClick={() => navigate("/user/join")}>
          회원가입
        </button>
        <KakaoLoginComponent />
      </div>
    </div>
  );
};

export default LoginComponent;
