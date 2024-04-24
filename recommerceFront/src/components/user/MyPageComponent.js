import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { readUser } from "../../api/userApi";
import { fetchSaleItems } from "../../api/salesApi";
import { fetchPurchaseItems } from "../../api/purchaseApi";
import { uploadUserImage } from "../../api/userimageApi"; // 유저 이미지 업로드 API 추가

const MyPageComponent = () => {
  const user = useSelector((state) => state.loginSlice);
  const [userData, setUserData] = useState(null);
  const [saleItems, setSaleItems] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [activeMenu, setActiveMenu] = useState("profile");
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

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

  const uploadImage = async () => {
    try {
      if (selectedImage) {
        const response = await uploadUserImage(selectedImage);
        setUserData({ ...userData, images: response.imageUrl }); // 업데이트된 이미지 URL을 userData에 반영
        alert("이미지 업로드가 완료되었습니다.");
      } else {
        alert("이미지를 선택해주세요.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    }
  };

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
      justifyContent: "space-between",
      marginTop: "20px",
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
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
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
    profileImageContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    profileImage: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
    },
    fileInput: {
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.myPageBundle}>
      <h1 style={styles.title}>마이페이지</h1>
      <div style={styles.infoBundle}>
        {activeMenu === "profile" && userData && (
          <div style={styles.profileImageContainer}>
            <img
              src={userData.images || "default-user-image.png"}
              alt="User Profile"
              style={styles.profileImage}
            />
            <input
              type="file"
              onChange={(e) => setSelectedImage(e.target.files[0])}
              style={styles.fileInput}
            />
            <button style={styles.button} onClick={uploadImage}>
              이미지
            </button>
          </div>
        )}

        {activeMenu === "profile" && userData && (
          <div style={styles.userInfo}>
            <p>Email: {userData.email}</p>
            <p>닉네임: {userData.nickname}</p>
            <p>휴대폰: {userData.phone}</p>
            <p>생년월일: {userData.birth}</p>
            <p>주소: {userData.address || "등록된 주소가 없습니다."}</p>
            <p>
              우편주소: {userData.postcode || "등록된 우편번호가 없습니다."}
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
            <Link to={`/user/address/${user.email}`}>
              <button style={styles.button}>주소 변경</button>
            </Link>
            <Link to={`/user/password/${user.email}`}>
              <button style={styles.button}>비밀번호 변경</button>
            </Link>
            <Link to={`/user/remove/${user.email}`}>
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
      <div style={styles.menuButtons}>
        <button style={styles.button} onClick={() => setActiveMenu("profile")}>
          프로필
        </button>
        <button style={styles.button} onClick={() => setActiveMenu("settings")}>
          정보변경
        </button>
        <button style={styles.button} onClick={() => setActiveMenu("sales")}>
          판매목록
        </button>
      </div>
    </div>
  );
};

export default MyPageComponent;
