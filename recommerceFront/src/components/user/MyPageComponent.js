import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { readUser } from "../../api/userApi";
import { fetchSaleItems } from "../../api/salesApi";
import { fetchPurchaseItems } from "../../api/purchaseApi";

const MyPageComponent = () => {
  const user = useSelector((state) => state.loginSlice);
  const [userData, setUserData] = useState(null);
  const [saleItems, setSaleItems] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [activeMenu, setActiveMenu] = useState("profile");
  const navigate = useNavigate(); // useNavigate 훅 사용

  const email = user.email;

  useEffect(() => {
    if (email) {
      const fetchData = async () => {
        try {
          const userData = await readUser(email);
          setUserData(userData);
          const sales = await fetchSaleItems(email);
          setSaleItems(sales);
          const purchases = await fetchPurchaseItems(email);
          setPurchaseItems(purchases);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [email]);

  // 주소 정보가 없을 경우 주소 변경 페이지로 리디렉션
  useEffect(() => {
    if (
      userData &&
      (!userData.address || !userData.postcode || !userData.addressDetail)
    ) {
      navigate(`/user/address/${email}`);
    }
  }, [userData, navigate, email]);

  // Inline styles
  const styles = {
    myPageBundle: {
      padding: "20px",
      margin: "20px auto",
      maxWidth: "800px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    },
    menuButtons: {
      display: "flex",
      justifyContent: "space-around",
      marginBottom: "20px",
    },
    button: {
      padding: "10px 15px",
      backgroundColor: "#000",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
    },
    infoBundle: {
      backgroundColor: "#f9f9f9",
      padding: "15px",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
    userInfo: {
      marginBottom: "10px",
    },
    list: {
      listStyle: "none",
      paddingLeft: "0",
    },
    listItem: {
      padding: "5px 0",
    },
    title: {
      fontWeight: "bold",
      fontSize: "18px",
      marginBottom: "10px",
    },
  };

  // 주소 및 우편번호 정보 표시 함수
  const handleAddressInfo = () => {
    setActiveMenu("address"); // "나의 주소" 버튼을 눌렀을 때 activeMenu를 "address"로 설정
  };

  return (
    <div style={styles.myPageBundle}>
      <h1 style={styles.title}>마이페이지</h1>
      <div style={styles.menuButtons}>
        <button style={styles.button} onClick={() => setActiveMenu("profile")}>
          프로필
        </button>
        <button
          style={styles.button}
          onClick={() => handleAddressInfo("address")}
        >
          나의 주소
        </button>
        <button style={styles.button} onClick={() => setActiveMenu("settings")}>
          정보변경
        </button>
        <button
          style={styles.button}
          onClick={() => setActiveMenu("purchases")}
        >
          내 경매
        </button>
        <button style={styles.button} onClick={() => setActiveMenu("sales")}>
          판매목록
        </button>
      </div>
      <div style={styles.infoBundle}>
        {activeMenu === "profile" && userData && (
          <div style={styles.userInfo}>
            <p>Email: {userData.email}</p>
            <p>닉네임: {userData.nickname}</p>
            <p>P.H: {userData.phone}</p>
            <p>생년월일: {userData.birth}</p>
            <Link to={`../profile/${email}`}>
              <button style={styles.button}>프로필 보기</button>
            </Link>
          </div>
        )}

        {activeMenu === "address" && userData && (
          <div style={styles.userInfo}>
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
          <div style={styles.userInfo}>
            <Link to={`/user/modify`}>
              <button style={styles.button}>정보 변경</button>
            </Link>
            <Link to={`/user/address/${email}`}>
              <button style={styles.button}>주소 변경</button>
            </Link>
            <Link to={`/user/remove/${email}`}>
              <button style={styles.button}>탈퇴하기</button>
            </Link>
          </div>
        )}

        {activeMenu === "purchases" &&
          purchaseItems &&
          purchaseItems.length > 0 && (
            <ul style={styles.list}>
              <li style={styles.title}>구매리스트:</li>
              {purchaseItems.map((item) => (
                <li key={item.id} style={styles.listItem}>
                  {item.name} - ${item.price}
                </li>
              ))}
            </ul>
          )}

        {activeMenu === "sales" && saleItems && saleItems.length > 0 && (
          <ul style={styles.list}>
            <li style={styles.title}>판매리스트:</li>
            {saleItems.map((item) => (
              <li key={item.id} style={styles.listItem}>
                {item.name} - ${item.price}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyPageComponent;
