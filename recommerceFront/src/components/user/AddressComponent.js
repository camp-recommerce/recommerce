import React, { useState } from "react";
import DaumPostcode from "react-daum-postcode";
import { useNavigate, useParams } from "react-router-dom";
import { updateAddress, updatePostcode } from "../../api/userApi";
import AlertModal from "../modal/AlertModal"; // 모달 컴포넌트 import

const AddressComponent = () => {
  const { email } = useParams();
  const [address, setAddress] = useState("");
  const [zoneCode, setZoneCode] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false); // 모달 표시 상태
  const [modalContent, setModalContent] = useState(""); // 모달 내용
  const [errorMessage, setErrorMessage] = useState(""); // 주소 입력 오류 메시지
  const navigate = useNavigate();

  const handleComplete = (data) => {
    setAddress(data.address);
    setZoneCode(data.zonecode);
  };

  const saveAddress = async () => {
    if (!address) {
      setErrorMessage("주소를 입력해주세요."); // 주소 입력 여부 확인
      return;
    }

    setIsLoading(true);
    try {
      await updateAddress(email, address, detailAddress, zoneCode);
      setModalContent("주소가 성공적으로 업데이트 되었습니다."); // 성공 메시지 설정
      setModalShow(true); // 모달 표시
      setTimeout(() => {
        setModalShow(false);
        navigate(`/user/mypage/${email}`);
      }, 2000);
    } catch (error) {
      console.error("주소 및 우편번호 업데이트 실패:", error);
      setModalContent("주소 업데이트에 실패했습니다."); // 실패 메시지 설정
      setModalShow(true); // 모달 표시
      setTimeout(() => setModalShow(false), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  // 인라인 CSS
  const styles = {
    container: {
      maxWidth: "500px",
      margin: "0 auto",
      padding: "20px",
    },
    input: {
      width: "100%",
      padding: "8px",
      marginTop: "8px",
      marginBottom: "8px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#000",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    errorMessage: {
      color: "red",
      marginTop: "5px",
    },
  };

  return (
    <div style={styles.container}>
      <h2>주소 검색</h2>
      <DaumPostcode onComplete={handleComplete} />
      <div>
        <b>우편번호:</b> {zoneCode}
      </div>
      <div>
        <b>주소:</b> {address}
      </div>
      <div>
        <label>
          <b>상세 주소:</b>
          <input
            type="text"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            style={styles.input}
            placeholder="건물명, 호수 등"
          />
        </label>
      </div>
      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
      {isLoading ? (
        <div>저장 중...</div>
      ) : (
        <button style={styles.button} onClick={saveAddress} disabled={isLoading}>
          저장하기
        </button>
      )}
      {modalShow && <AlertModal title="알림" content={modalContent} />}
    </div>
  );
};

export default AddressComponent;
