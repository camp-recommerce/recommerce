import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { readUser } from "../../api/userApi";
import { fetchSaleItems } from "../../api/salesApi";
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
        const items = await fetchSaleItems(email);
        console.log("Sale items:", items); // 로그 추가
        if (Array.isArray(items)) {
          setSaleItems(items);
        } else {
          setSaleItems([]); // 반환된 데이터가 배열이 아니면 빈 배열을 설정
        }
      } catch (error) {
        console.error("Error fetching user sale items:", error);
        setError("Failed to load sale items.");
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

      {saleItems.length > 0 ? (
        <div>
          <h2>판매목록</h2>
          <ul>
            {saleItems.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>판매중인 상품이 없습니다.</div>
      )}
      <div>
        <ProfileComponent />
      </div>
    </div>
  );
};

export default PublicProfileComponent;
