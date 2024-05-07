import React, { useState, useEffect } from "react";
import { getUserProfileStatisticsByEmail } from "../../api/userApi";
import { formatPrice } from "../../util/formatNumberUtil";

const AnalysisComponent = ({ email }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getUserProfileStatisticsByEmail(email)
      .then((data) => {
        setProfile(data);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        console.error("사용자 프로필 통계를 가져오는 중 오류 발생:", err);
        setError("프로필 통계를 가져오는 데 실패했습니다.");
        setLoading(false);
      });
  }, [email]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  if (!profile) {
    return <div>프로필 데이터를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex flex-col p-[20px] rounded-md bg-[#F0F0F0] w-[500px]">
      {/* <div className="flex justify-between">
        <p className="min-w-[150px]">최다 구매 카테고리</p>
        <p>{profile.topPurchaseCategory}</p>
      </div> */}
      <div className="flex justify-between">
        <p className="min-w-[150px]">최다 판매 카테고리</p>
        <p>
          {profile.topSaleCategory !== "None"
            ? profile.topSaleCategory
            : "판매 내역 없음"}
        </p>
      </div>
      <div className="flex justify-between">
        <p className="min-w-[150px]">평균 판매가</p>
        <p>
          {profile.averagePrice > 0
            ? formatPrice(profile.averagePrice) + "원"
            : ""}
        </p>
      </div>
      <div className="flex justify-between">
        <p className="min-w-[150px]">주요 거래 지역</p>
        <p>
          {profile.topSellingLocation !== "None"
            ? profile.topSellingLocation
            : ""}
        </p>
      </div>
    </div>
  );
};

export default AnalysisComponent;
