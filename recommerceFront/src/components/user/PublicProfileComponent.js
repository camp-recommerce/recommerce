import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { readUser } from "../../api/userApi";
import { fetchSaleItems } from "../../api/salesApi";

const PublicProfileComponent = () => {
  const { email } = useParams(); // URL 파라미터에서 이메일 값을 가져옴
  const [profile, setProfile] = useState(null); // 공개 프로필 정보를 담을 상태
  const [saleItems, setSaleItems] = useState(null); // 판매 아이템 정보를 담을 상태

  useEffect(() => {
    // 이메일을 기반으로 서버에서 공개 프로필 정보를 가져옴
    const fetchProfile = async () => {
      try {
        const response = await readUser(email);
        setProfile(response); // 가져온 공개 프로필 정보를 상태에 저장
      } catch (error) {
        console.error("Error fetching public profile:", error);
      }
    };

    fetchProfile(); // 함수 호출

    // 사용자의 판매 아이템도 가져옴
    const fetchUserSaleItems = async () => {
      try {
        const items = await fetchSaleItems(email);
        setSaleItems(items); // 판매 아이템 정보를 상태에 저장
      } catch (error) {
        console.error("Error fetching user sale items:", error);
      }
    };

    fetchUserSaleItems(); // 함수 호출
  }, [email]); // 이메일이 변경될 때마다 호출되도록 설정

  return (
    <div>
      {profile ? (
        // 공개 프로필 정보가 있는 경우 출력
        <div>
          <h2>프로필</h2>
          <p>Email: {profile.email}</p>
          <p>닉네임: {profile.nickname}</p>
          {/* 필요한 다른 공개 정보들을 출력 */}
        </div>
      ) : (
        // 공개 프로필 정보가 없는 경우 로딩 메시지 출력
        <div>Loading...</div>
      )}

      {saleItems ? (
        // 판매 아이템 정보가 있는 경우 출력
        <div>
          <h2>판매목록</h2>
          <ul>
            {saleItems.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        // 판매 아이템 정보가 없는 경우 로딩 메시지 출력
        <div>Loading...</div>
      )}
    </div>
  );
};

export default PublicProfileComponent;
