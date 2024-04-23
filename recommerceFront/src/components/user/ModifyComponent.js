import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { modifyUser, readUser } from "../../api/userApi";
import AlertModal from "../modal/AlertModal";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

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

const ModifyComponent = () => {
  const loginInfo = useSelector((state) => state.loginSlice);
  const [user, setUser] = useState({
    email: "",
    pw: "",
    nickname: "",
    phone: "",
    birth: "",
  });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await readUser(loginInfo.email);
        // 비밀번호를 제외하고 사용자 데이터를 설정합니다.
        // 이렇게 하면 비밀번호 필드는 빈 값으로 유지됩니다.
        setUser({ ...userData, pw: "" });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (loginInfo.email) {
      fetchUserData();
    }
  }, [loginInfo.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleClickModify = async () => {
    try {
      await validationSchema.validate(user, { abortEarly: false });
      await modifyUser(user);
      setResult(true);
    } catch (error) {
      setResult(false);
      setErrorMessage(error.errors[0] || "An unexpected error occurred.");
    }
  };

  // 스타일 객체 정의
  const styles = {
    formWrap: {
      maxWidth: "600px",
      margin: "40px auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#f7f7f7",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    formField: {
      marginBottom: "20px",
    },
    input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "4px",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#000",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "1rem",
    },
    title: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "1.5rem",
      color: "#333",
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
          title="회원정보 수정"
          content="수정이 완료되었습니다."
          callbackFn={() => navigate("/")}
        />
      )}
      <h2 style={styles.title}>회원정보 수정</h2>
      <div style={styles.errorMessage}>
        {errorMessage && <div>{errorMessage}</div>}
      </div>
      <form>
        <div style={styles.formField}>
          <label>Email</label>
          <input
            style={styles.input}
            name="email"
            type="text"
            value={user.email}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div style={styles.formField}>
          <label>비밀번호</label>
          <input
            style={styles.input}
            name="pw"
            type="password"
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
            value={user.nickname}
            onChange={handleChange}
          />
        </div>
        <div style={styles.formField}>
          <label>P.H</label>
          <input
            style={styles.input}
            name="phone"
            type="text"
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
            value={user.birth}
            onChange={handleChange}
          />
        </div>
        <button style={styles.button} onClick={handleClickModify} type="button">
          수정하기
        </button>
      </form>
    </div>
  );
};

export default ModifyComponent;
