// PasswordChangeFormComponent.js
import { useState } from "react";
import { changePassword } from "../../api/userApi";
import AlertModal from "../modal/AlertModal";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  currentPassword: Yup.string().required("현재 비밀번호를 입력하세요."),
  newPassword: Yup.string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,}$/,
      "비밀번호는 영문자, 숫자, 특수문자를 모두 포함하여 5자 이상이어야 합니다."
    )
    .required("새 비밀번호를 입력하세요."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "새 비밀번호와 일치해야 합니다.")
    .required("새 비밀번호 확인을 입력하세요."),
});

const PasswordChangeFormComponent = () => {
  const [passwords, setPasswords] = useState({
    pw: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({ ...prevPasswords, [name]: value }));
  };

  const handleClickChangePassword = async () => {
    try {
      await validationSchema.validate(passwords, { abortEarly: false });
      await changePassword(
        passwords.pw,
        passwords.newPassword,
        passwords.confirmPassword
      );
      setResult(true);
      navigate("/mypage");
    } catch (error) {
      setResult(false);
      setErrorMessage(error.errors[0] || "An unexpected error occurred.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        backgroundColor: "#f9f9f9",
      }}
    >
      {result && (
        <AlertModal
          title="비밀번호 변경"
          content="비밀번호가 성공적으로 변경되었습니다."
        />
      )}
      <h2>비밀번호 변경</h2>
      <div style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
        {errorMessage && <div>{errorMessage}</div>}
      </div>
      <form>
        <div style={{ marginBottom: "20px" }}>
          <label>현재 비밀번호</label>
          <input
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
            name="pw"
            type="password"
            value={passwords.pw}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>새 비밀번호</label>
          <input
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
            name="newPassword"
            type="password"
            value={passwords.newPassword}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>새 비밀번호 확인</label>
          <input
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
            name="confirmPassword"
            type="password"
            value={passwords.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#000",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
            onClick={handleClickChangePassword}
            type="button"
          >
            변경하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChangeFormComponent;
