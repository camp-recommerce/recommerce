import { Link } from "react-router-dom";
import { getKakaoLoginLink } from "../../api/kakaoApi";

const KakaoLoginComponent = () => {
  const link = getKakaoLoginLink();

  // 스타일 객체 정의
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      margin: "20px 0",
    },
    infoText: {
      textAlign: "center",
      color: "white",
      marginBottom: "10px",
    },
    button: {
      fontSize: "20px",
      fontWeight: "bold",
      backgroundColor: "#000", // 검은색 배경
      color: "#fff", // 하얀색 텍스트
      padding: "10px 20px",
      borderRadius: "5px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      width: "75%", // 너비 조절
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textDecoration: "none", // 링크 텍스트 밑줄 제거
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.infoText}>로그인시에 자동 가입처리 됩니다</div>
      {/* a 태그로 감싸서 외부 링크를 처리할 수 있도록 수정 */}
      <a href={link} style={styles.button}>
        Kakao 로그인
      </a>
    </div>
  );
};

export default KakaoLoginComponent;
