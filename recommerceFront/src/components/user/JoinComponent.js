import React, { useEffect, useState } from "react";
import { joinUser } from "../../api/userApi";
import AlertModal from "../modal/AlertModal";
import useCustomLogin from "../../hooks/useCustomLoginPage";
import * as Yup from "yup";

const initState = {
  email: "",
  pw: "",
  nickname: "",
  phone: "",
  birth: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("유효한 이메일을 입력하세요.")
    .required("이메일은 필수 항목입니다."),
  pw: Yup.string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,}$/,
      "비밀번호는 영문자, 숫자, 특수문자를 모두 포함하여 5자 이상이어야 합니다."
    )
    .required("비밀번호는 필수 항목입니다."),
  nickname: Yup.string().required("닉네임은 필수 항목입니다."),
  phone: Yup.string()
    .matches(/^\d{11}$/, "핸드폰 번호는 11자리여야 합니다.")
    .required("전화번호는 필수 항목입니다."),
  birth: Yup.string()
    .matches(/^\d{8}$/, "생년월일은 8자리여야 합니다.")
    .required("생년월일은 필수 항목입니다."),
});

const JoinComponent = () => {
  const [user, setUser] = useState(initState);
  const [result, setResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { moveToLogin } = useCustomLogin();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleClickJoin = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(user, { abortEarly: false });
      await joinUser(user);
      setResult(true);
    } catch (error) {
      setResult(false);
      if (error instanceof Yup.ValidationError) {
        setErrorMessage(error.errors[0]);
      } else {
        setErrorMessage("회원가입 처리 중 오류가 발생했습니다.");
      }
    }
  };

  const closeModal = () => {
    setResult(false);
    setUser(initState);
    moveToLogin();
  };

  // 스타일 객체 정의
  const styles = {
    formWrap: {
      maxWidth: "500px",
      margin: "40px auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      backgroundColor: "#f7f7f7",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    formTitle: {
      marginBottom: "20px",
      textAlign: "center",
      fontSize: "1.5rem",
      color: "#333",
    },
    formField: {
      marginBottom: "10px",
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "5px 0",
      border: "1px solid #ddd",
      borderRadius: "4px",
    },
    submitButton: {
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
    errorMessage: {
      color: "red",
      textAlign: "center",
      marginBottom: "10px",
    },
  };

  return (
    <div style={styles.formWrap}>
      {result && (
        <AlertModal
          title={"회원가입 성공"}
          content={"회원가입 성공"}
          callbackFn={closeModal}
        />
      )}
      <h2 style={styles.formTitle}>회원가입</h2>
      <form onSubmit={handleClickJoin}>
        {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
        <div style={styles.formField}>
          <label>Email</label>
          <input
            style={styles.input}
            name="email"
            type="text"
            placeholder="이메일 입력"
            value={user.email}
            onChange={handleChange}
          />
        </div>
        <div style={styles.formField}>
          <label>비밀번호</label>
          <input
            style={styles.input}
            name="pw"
            type="password"
            placeholder="비밀번호 입력"
            value={user.pw}
            onChange={handleChange}
          />
        </div>
        <div style={styles.formField}>
          <label>닉네임</label>
          <input
            style={styles.input}
            name="nickname"
            type="text"
            placeholder="닉네임 입력"
            value={user.nickname}
            onChange={handleChange}
          />
        </div>
        <div style={styles.formField}>
          <label>H.P</label>
          <input
            style={styles.input}
            name="phone"
            type="tel"
            placeholder="전화번호 입력"
            value={user.phone}
            onChange={handleChange}
          />
        </div>
        <div style={styles.formField}>
          <label>생년월일</label>
          <input
            style={styles.input}
            name="birth"
            type="text"
            placeholder="생년월일 입력"
            value={user.birth}
            onChange={handleChange}
          />
        </div>

        <button style={styles.submitButton} type="submit">
          제출
        </button>
      </form>
    </div>
  );
};

export default JoinComponent;
