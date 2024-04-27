import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Link 추가
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
        console.log("Profile data:", response);
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
        setSaleItems(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching sale items:", error);
        setIsLoading(false);
      }
    };

    fetchProfile();
    fetchUserSaleItems();
  }, [email]);

  const profileStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  };

  const listItemStyle = {
    fontSize: '18px',
    marginBottom: '8px',
  };

  if (isLoading) {
    return <div style={profileStyle}>Loading...</div>;
  }

  if (error) {
    return <div style={profileStyle}>Error: {error}</div>;
  }

  return (
    <div style={profileStyle}>
      {profile ? (
        <div>
          <h2>프로필</h2>
          <p>Email: {profile.email}</p>
          <p>닉네임: {profile.nickname}</p>
        </div>
      ) : (
        <div>No profile data available.</div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h2>판매목록</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {saleItems && saleItems.dtoList && saleItems.dtoList.length > 0 ? (
            saleItems.dtoList.map((item) => (
              <li key={item.pno} style={listItemStyle}>
                {/* 링크 추가 */}
                <Link to={`/product/read/${item.pno}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div>
                    <strong>{item.pname}</strong> - {item.pcategory} - {item.price.toLocaleString()}원
                  </div>
                  <div>상태: {item.pstate}</div>
                  <div>위치: {item.plocat}</div>
                  <div>상세 설명: {item.pdesc}</div>
                </Link>
              </li>
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
