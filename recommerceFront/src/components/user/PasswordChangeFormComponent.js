import React, { useState } from "react";
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

const styles = {
  container: {
    maxWidth: "400px",
    margin: "100px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  button: {
    width: "100%",
    padding: "10px 20px",
    backgroundColor: "#000",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  label: {
    display: "block",
    marginBottom: "5px",
  },
};

const PasswordChangeFormComponent = () => {
  const [passwords, setPasswords] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(passwords, { abortEarly: false });
      await changePassword(
        passwords.email,
        passwords.currentPassword,
        passwords.newPassword,
        passwords.confirmPassword
      );
      setResult(true);
      setModalOpen(true);
    } catch (error) {
      setResult(false);
      if (error instanceof Yup.ValidationError) {
        setErrorMessage(error.inner.map((err) => err.message).join(", "));
      } else {
        setErrorMessage("비밀번호 변경 중 오류가 발생했습니다.");
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    navigate("/mypage/profile");
  };

  return (
    <div style={styles.container}>
      {result === true && modalOpen && (
        <AlertModal
          title="비밀번호 변경"
          content="비밀번호가 성공적으로 변경되었습니다."
          callbackFn={handleModalClose}
        />
      )}
      {result === false && <AlertModal title="오류" content={errorMessage} />}

      <form onSubmit={handleSubmit}>
        <div>
          <label style={styles.label}>현재 비밀번호</label>
          <input
            style={styles.input}
            name="currentPassword"
            type="password"
            value={passwords.currentPassword}
            onChange={handleChange}
          />
        </div>
        <div>
          <label style={styles.label}>새 비밀번호</label>
          <input
            style={styles.input}
            name="newPassword"
            type="password"
            value={passwords.newPassword}
            onChange={handleChange}
          />
        </div>
        <div>
          <label style={styles.label}>새 비밀번호 확인</label>
          <input
            style={styles.input}
            name="confirmPassword"
            type="password"
            value={passwords.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <button style={styles.button} type="submit">
          변경하기
        </button>
      </form>
    </div>
  );
};

export default PasswordChangeFormComponent;
