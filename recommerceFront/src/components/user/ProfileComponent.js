import { useState, useEffect } from "react";
import { getUserProfile } from "../../api/userApi";

const ProfileComponent = ({ userEmail }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (userEmail) {
      setLoading(true); // 로딩 시작
      getUserProfile(userEmail)
        .then((data) => {
          if (data) {
            setProfile(data);
            setError(false);
          } else {
            // 데이터가 정상적으로 없는 경우(데이터가 있는데 조건에 맞지 않음)
            setError("No profile data available.");
          }
          setLoading(false); // 로딩 종료
        })
        .catch((err) => {
          console.error("Error fetching user profile:", err);
          setError("Failed to fetch profile.");
          setLoading(false); // 로딩 종료
        });
    }
  }, [userEmail]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  if (!profile) {
    return <div>데이터가 비어 있습니다.</div>; // 데이터가 비어 있는 경우(응답, 요청은 되나 데이터가 없음)
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>{profile.email} 님</p>
      <p>가장 많이 구매한 항목: {profile.topPurchaseCategory}</p>
      <p>가장 많이 판매한 항목: {profile.topSaleCategory}</p>
      <p>평균 판매 가격: {profile.averagePrice}</p>
      <p>주요 거래 장소: {profile.topSellingLocation}</p>
    </div>
  );
};

export default ProfileComponent;
