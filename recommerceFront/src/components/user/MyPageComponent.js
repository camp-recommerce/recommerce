import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { readUser } from "../../api/userApi";
import { fetchSaleItems } from "../../api/salesApi";
import { fetchPurchaseItems } from "../../api/purchaseApi";
import useCustomMovePage from "../../hooks/useCustomMovePage";
import { API_SERVER_HOST } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import styles from "../../scss/user/MyPageComponent.module.scss";


const MyPageComponent = () => {

  const user = useSelector((state) => state.loginSlice);
  const [userData, setUserData] = useState(null);
  const [saleItems, setSaleItems] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [activeMenu, setActiveMenu] = useState("profile");


  useEffect(() => {
    if (user && user.email) {
      const fetchData = async () => {
        try {
          const userData = await readUser(user.email);
          setUserData(userData);
          const sales = await fetchSaleItems(user.email);
          setSaleItems(sales);
          const purchases = await fetchPurchaseItems(user.email);
          setPurchaseItems(purchases);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [user]);

  const goToSales = () => {
    setActiveMenu("sales"); // UserProducts 컴포넌트의 경로로 이동
  };

  return (
    <div className={styles.myPageBundle}>
      <div className={styles.menuBar}>
      
      <div
        className={styles.menuItem}
          >
          <Link to="/myPage/profile">프로필</Link>
        </div>
        <div
        className={styles.menuItem}
          >
          <Link to="/myPage/by-user">판매목록</Link>
        </div>
        <div
        className={styles.menuItem}
          >
          <Link to="/myPage/auction">경매</Link>
        </div>
        <div
        className={styles.menuItem}
          >
          <Link to="/myPage/chat">내 채팅</Link>
        </div>
        <div
          className={styles.menuItem}
          onClick={() => setActiveMenu("settings")}
        >
          정보 설정
        </div>
      </div>
      <h1 className={styles.title}>My Page</h1>
        {activeMenu === "address" && userData && (
          <div className={styles.userInfo}>
            <p>주소: {userData.address || "등록된 주소가 없습니다."}</p>
            <p>
              우편번호: {userData.postcode || "등록된 우편번호가 없습니다."}
            </p>
            <p>
              상세주소:{" "}
              {userData.addressDetail || "등록된 상세주소가 없습니다."}
            </p>
          </div>
        )}
        {activeMenu === "settings" && (
          <div className={styles.userInfo}>
            <Link to={`/myPage/modify`}>
              <button className={styles.button}>정보 변경</button>
            </Link>
            <Link to={`/myPage/address/${user.email}`}>
              <button className={styles.button}>주소 변경</button>
            </Link>
            <Link to={`/myPage/password/${user.email}`}>
              <button className={styles.button}>비밀번호 변경</button>
            </Link>
            <Link to={`/myPage/remove/${user.email}`}>
              <button className={styles.button}>탈퇴하기</button>
            </Link>
          </div>
        )}
      </div>

  );
};

export default MyPageComponent;
