import React, { useState } from "react";
import DaumPostcode from "react-daum-postcode";
import { useNavigate, useParams } from "react-router-dom";
import { updateAddress, updatePostcode } from "../../api/userApi";

const AddressComponent = () => {
  const { email } = useParams();
  const [address, setAddress] = useState("");
  const [zoneCode, setZoneCode] = useState("");
  const [detailAddress, setDetailAddress] = useState(""); // 상세 주소 상태 추가
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleComplete = (data) => {
    setAddress(data.address);
    setZoneCode(data.zonecode);
  };

  const saveAddress = async () => {
    setIsLoading(true);
    try {
      await updateAddress(email, address, detailAddress, zoneCode); // API 호출 시 상세 주소 포함
      console.log("주소 및 우편번호 업데이트 성공");
      navigate(`/user/mypage/${email}`);
    } catch (error) {
      console.error("주소 및 우편번호 업데이트 실패:", error);
      alert("주소 및 우편번호 업데이트에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
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
            placeholder="건물명, 호수 등"
          />
        </label>
      </div>
      {isLoading ? (
        <div>저장 중...</div>
      ) : (
        <button onClick={saveAddress} disabled={isLoading}>
          저장하기
        </button>
      )}
    </div>
  );
};

export default AddressComponent;
