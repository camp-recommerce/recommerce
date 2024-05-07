import useCustomLogin from "../../hooks/useCustomLoginPage";

const LogoutComponent = () => {
  const { doLogout, moveToPath } = useCustomLogin();

  const handleClickLogout = () => {
    doLogout();
    alert("로그아웃되었습니다.");
    moveToPath("/");
  };

  // 인라인 스타일 정의
  const styles = {
    logOutBg: {
      padding: "20px",
      backgroundColor: "#f7f7f7",
      border: "1px solid #ccc",
      borderRadius: "5px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      maxWidth: "400px",
      margin: "100px auto",
      textAlign: "center",
    },
    logOutTitle: {
      marginBottom: "20px",
      fontSize: "1.4rem",
      color: "#333",
    },
    logOutButton: {
      fontSize: "1.2rem",
      padding: "10px 20px",
      backgroundColor: "#000",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  return (
    <div style={{ minHeight: 600 }}>
      <div style={styles.logOutBg}>
        <div style={styles.logOutTitle}>
          <div>
            <span>로그아웃</span>을 원하시면
          </div>
          <div>
            아래 <span>로그아웃</span> 버튼을 눌러주세요
          </div>
        </div>

        <button onClick={handleClickLogout} style={styles.logOutButton}>
          LOGOUT
        </button>
      </div>
    </div>
  );
};

export default LogoutComponent;
