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

  useEffect(() => {
    if (user && user.email) {
      const fetchData = async () => {
        try {
          const userData = await readUser(user.email);
          setUserData(userData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [user]);

  return (
    <div className={styles.myPageBundle}>
      <div className={styles.menuBar}>
        <div className={styles.menuItem}>
          <Link to="/myPage/profile">프로필</Link>
        </div>
        <div className={styles.menuItem}>
          <Link to="/myPage/by-user">판매목록</Link>
        </div>
        <div className={styles.menuItem}>
          <Link to="/myPage/auction">경매</Link>
        </div>
        <div className={styles.menuItem}>
          <Link to="/myPage/chat">내 채팅</Link>
        </div>
        <div className={styles.menuItem}>
          <Link to="/myPage/setting">정보 설정</Link>
        </div>
      </div>
    </div>
  );
};

export default MyPageComponent;
