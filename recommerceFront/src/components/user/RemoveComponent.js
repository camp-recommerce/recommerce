import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../../api/userApi";
import { logout } from "../../slices/loginSlice";

const RemoveComponent = () => {
  const [result, setResult] = useState(false);
  const [error, setError] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.loginSlice);
  const email = user.email;

  const handleClickRemove = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmRemove = async () => {
    try {
      if (!email) {
        throw new Error("로그인 정보가 존재하지 않습니다.");
      }
      await removeUser(email).then(() => {
        setResult(true);
        dispatch(logout());
        navigate("/");
      });
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      setError("회원 탈퇴에 실패했습니다.");
    }
  };

  const handleCancelRemove = () => {
    setIsConfirmationOpen(false);
  };

  // 인라인 스타일 정의
  const styles = {
    removeComponentWrap: {
      textAlign: "center",
      margin: "50px 0",
    },
    confirmationModal: {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modalContent: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      width: "400px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
    modalHeader: {
      fontSize: "1.5rem",
      marginBottom: "15px",
    },
    modalButtons: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "20px",
    },
    modalButton: {
      padding: "10px 20px",
      margin: "0 5px",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    confirmButton: {
      backgroundColor: "#000",
      color: "white",
    },
    cancelButton: {
      backgroundColor: "#000",
      color: "white",
    },
    errorMessage: {
      color: "#f44336",
      margin: "20px 0",
    },
  };

  return (
    <div style={styles.removeComponentWrap}>
      {result && <div style={styles.successMessage}>회원 탈퇴 성공</div>}
      {error && <p style={styles.errorMessage}>{error}</p>}
      <button onClick={handleClickRemove} style={styles.modalButton}>
        탈퇴하기
      </button>

      {isConfirmationOpen && (
        <div style={styles.confirmationModal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>회원 탈퇴 확인</div>
            <div>정말 탈퇴하시겠습니까?</div>
            <div style={styles.modalButtons}>
              <button
                onClick={handleConfirmRemove}
                style={{ ...styles.modalButton, ...styles.confirmButton }}
              >
                확인
              </button>
              <button
                onClick={handleCancelRemove}
                style={{ ...styles.modalButton, ...styles.cancelButton }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemoveComponent;
