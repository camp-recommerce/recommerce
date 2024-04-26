import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { readUser } from "../../api/userApi";
import { fetchProductsByUserFrom } from "../../api/productApi";
import ProfileComponent from "./ProfileComponent";

const PublicProfileComponent = () => {
  const { email } = useParams();
  const [profile, setProfile] = useState(null);
  const [saleItems, setSaleItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await readUser(email);
        console.log("Profile data:", response); // 로그 추가
        setProfile(response);
      } catch (error) {
        console.error("Error fetching public profile:", error);
        setError("Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserSaleItems = async () => {
      try {
        const data = await fetchProductsByUserFrom({
          page: 1,
          size: 10,
          userEmail: email,
        });
        setSaleItems(data); // 제품 목록 설정
        setIsLoading(false); // 로딩 상태 갱신
      } catch (error) {
        console.error("Error fetching sale items:", error);
        setIsLoading(false); // 로딩 상태 갱신
      }
    };

    fetchProfile();
    fetchUserSaleItems();
  }, [email]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {profile ? (
        <div>
          <h2>프로필</h2>
          <p>Email: {profile.email}</p>
          <p>닉네임: {profile.nickname}</p>
        </div>
      ) : (
        <div>No profile data available.</div>
      )}

      <div>
        <h2>판매목록</h2>
        <ul>
          {saleItems && saleItems.dtoList && saleItems.dtoList.length > 0 ? (
            saleItems.dtoList.map((item) => (
              <li key={item.pno}>{item.pname}</li>
            ))
          ) : (
            <div>판매중인 상품이 없습니다.</div>
          )}
        </ul>
      </div>

      <div>
        <ProfileComponent />
      </div>
    </div>
  );
};

export default PublicProfileComponent;
