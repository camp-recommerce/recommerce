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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>No data available.</div>; // 데이터가 비어 있는 경우(응답, 요청은 되나 데이터가 없음)
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>Email: {profile.email}</p>
      <p>Top Purchase Category: {profile.topPurchaseCategory}</p>
      <p>Top Sale Category: {profile.topSaleCategory}</p>
      <p>Average Price: {profile.averagePrice}</p>
      <p>Top Selling Location: {profile.topSellingLocation}</p>
    </div>
  );
};

export default ProfileComponent;
