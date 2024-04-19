import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import $ from "jquery";
import { readUser } from "../../api/userApi";
import { fetchSaleItems } from "../../api/salesApi";
import { fetchPurchaseItems } from "../../api/purchaseApi"; // API 함수 임포트

const MyPageComponent = () => {
  const user = useSelector((state) => state.loginSlice); // 리덕스 스토어에서 로그인 정보 가져오기
  const [userData, setUserData] = useState(null); // 사용자 데이터 상태
  const [saleItems, setSaleItems] = useState([]); // 판매 아이템 상태
  const [purchaseItems, setPurchaseItems] = useState([]); // 구매 아이템 상태
  const [activeMenu, setActiveMenu] = useState("profile"); // 활성 메뉴 상태

  const email = user.email; // 사용자 이메일

  useEffect(() => {
    $(document).ready(function () {
      $(".menuButtons button").css({
        padding: "10px 20px",
        margin: "5px",
        background: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
      });

      $(".InfoBundle").css({
        marginTop: "20px",
        padding: "15px",
        backgroundColor: "#f8f8f8",
      });

      $(".userInfo div, .userSettings button").css({
        margin: "10px 0",
      });
    });

    // 사용자 데이터와 판매, 구매 목록을 불러오는 함수
    const fetchUserData = async () => {
      try {
        const userData = await readUser(email);
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchSales = async () => {
      try {
        const sales = await fetchSaleItems(email);
        setSaleItems(sales);
      } catch (error) {
        console.error("Error fetching sale items:", error);
      }
    };

    const fetchPurchases = async () => {
      try {
        const purchases = await fetchPurchaseItems(email);
        setPurchaseItems(purchases);
      } catch (error) {
        console.error("Error fetching purchase items:", error);
      }
    };

    if (email) {
      fetchUserData();
      fetchSales();
      fetchPurchases();
    }
  }, [email]);

  return (
    <div className="myPageBundle">
      <span>마이 페이지</span>
      <div className="menuButtons">
        {/* 메뉴 버튼을 클릭하면 activeMenu 상태를 변경 */}
        <button onClick={() => setActiveMenu("profile")}>프로필</button>
        <button onClick={() => setActiveMenu("settings")}>설정</button>
        <button onClick={() => setActiveMenu("purchases")}>구매 목록</button>
        <button onClick={() => setActiveMenu("sales")}>판매 목록</button>
      </div>
      <div className="InfoBundle">
        {/* activeMenu 상태에 따라 조건부 렌더링으로 해당 정보 표시 */}
        {activeMenu === "profile" && userData && (
          <div className="userInfo">
            <div>E-mail: {userData.email}</div>
            <div>닉네임: {userData.nickname}</div>
            <div>P.H: {userData.phone}</div>
            <div>생년월일: {userData.birth}</div>
          </div>
        )}
        {activeMenu === "settings" && (
          <div className="userSettings">
            <Link to={`/user/modify`}>
              <button>정보 수정</button>
            </Link>
            <Link to={`/user/remove/${email}`}>
              <button>회원 탈퇴</button>
            </Link>
          </div>
        )}
        {activeMenu === "purchases" &&
          purchaseItems &&
          purchaseItems.length > 0 && (
            <div>
              <h2>구매한 상품 목록</h2>
              <ul>
                {purchaseItems.map((item) => (
                  <li key={item.id}>
                    {item.name} - {item.price}
                  </li>
                ))}
              </ul>
            </div>
          )}
        {activeMenu === "sales" && saleItems && saleItems.length > 0 && (
          <div>
            <h2>판매한 상품 목록</h2>
            <ul>
              {saleItems.map((item) => (
                <li key={item.id}>
                  {item.name} - {item.price}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPageComponent;
