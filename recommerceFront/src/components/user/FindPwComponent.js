import React, { useState } from "react";
import { sendEmail } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

const FindPwComponent = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      await sendEmail(email);
      alert("임시 비밀번호를 발송했습니다. 이메일을 확인해주세요.");
      navigate("/user/login");
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          alert("등록되지 않은 이메일입니다. 다시 확인해주세요.");
        } else {
          alert(
            data.message ||
              "비밀번호 재설정 요청에 실패했습니다. 다시 시도해주세요."
          );
        }
      }
    }
  };

  // 인라인 스타일 정의
  const styles = {
    findWrap: {
      maxWidth: "400px",
      margin: "2rem auto",
      padding: "2rem",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: "10px",
      backgroundColor: "#fff",
      textAlign: "center",
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "10px 0",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
    button: {
      width: "100%",
      padding: "10px 20px",
      backgroundColor: "#000",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  return (
    <div style={{ minHeight: 650 }}>
      <div style={styles.findWrap}>
        <h2>비밀번호 찾기</h2>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          style={styles.input}
          placeholder="이메일 입력"
        />
        <button onClick={handleSubmit} style={styles.button}>
          임시비밀번호 발송
        </button>
      </div>
    </div>
  );
};

export default FindPwComponent;
