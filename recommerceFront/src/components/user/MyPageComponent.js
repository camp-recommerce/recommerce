import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { readUser } from "../../api/userApi";
import { fetchSaleItems } from "../../api/salesApi";
import { fetchPurchaseItems } from "../../api/purchaseApi";
import { getBidList } from "../../api/auctionBidApi";
import { getRoomList, readAlarms, deleteAlarm } from "../../api/chatAlarmApi";
import { getMyList } from "../../api/auctionApi";
import useCustomMovePage from "../../hooks/useCustomMovePage";
import { API_SERVER_HOST } from "../../api/userApi";
import ImageModal from "../modal/ImageModal";
import A_Chat from "../auction/chat/A_Chat";
import useCustomChatModal from "../../hooks/useCustomChatModal";
import { useNavigate } from "react-router-dom";
import styles from "../../scss/user/MyPageComponent.module.scss";
import UserProductComponent from "./UserProductComponent"; // 판매 목록 컴포넌트
import Chat from "../product/chat/chatcomponents/Chat";

const host = API_SERVER_HOST;

const MyPageComponent = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.loginSlice);
  const [userData, setUserData] = useState(null);
  const [saleItems, setSaleItems] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [activeMenu, setActiveMenu] = useState("profile");
  const { page, size, moveMyPageToAuctonRead } = useCustomMovePage();
  const [auction, setAuction] = useState(null);
  const [room, setRoom] = useState(null);
  const [bidlist, setBidList] = useState(null);
  const [openImg, setOpenImg] = useState(false);
  const [selectedImgPath, setSelectedImgPath] = useState("");
  const { openChatModal, closeChatModal, isChatModalOpen, socket, roomId } =
    useCustomChatModal(); // useNavigate 훅 사용
  const closeImageModal = () => {
    setOpenImg(false);
  };
  const email = user.email;
  const apBuyer = user.email;

  const handleDeleteClick = async (roomId) => {
    try {
      await deleteAlarm(roomId);
      // 페이지 새로고침 전에 setActiveMenu를 호출하여 Chat 화면을 보여줍니다.
      setActiveMenu("Chat");
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const handleClickPayment = (item) => {
    navigate("/payment", {
      state: {
        productName: item.apName,
        productPrice: item.apCurrentPrice,
        productId: item.pno,
        quantity: 1,
      },
    });
    window.location.reload();
  };

  const handleImageClick = (imageName) => {
    setSelectedImgPath(`${host}/auction/view/${imageName}`);
    setOpenImg(true);
  };

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

          getMyList({ page, size, apBuyer }).then((data) => {
            console.log(data);
            setAuction(data);
          });
          getRoomList({ email }).then((data) => {
            console.log(data);
            setRoom(data);
          });
          getBidList(email).then((data) => {
            console.log(data);
            setBidList(data);
          });
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
          onClick={() => setActiveMenu("profile")}
        >
          프로필
        </div>
        <div className={styles.menuItem} onClick={goToSales}>
          판매목록
        </div>
        <div className={styles.menuItem} onClick={() => setActiveMenu("bid")}>
          경매
        </div>
        <div className={styles.menuItem} onClick={() => setActiveMenu("Chat")}>
          내 채팅
        </div>
        <div
          className={styles.menuItem}
          onClick={() => setActiveMenu("settings")}
        >
          정보 설정
        </div>
      </div>
      <h1 className={styles.title}>My Page</h1>
      <div className={styles.infoBundle}>
        {activeMenu === "profile" && userData && (
          <div className={styles.userInfo}>
            <p>Email: {userData.email}</p>
            <p>닉네임: {userData.nickname}</p>
            <p>휴대폰: {userData.phone}</p>
            <p>생년월일: {userData.birth}</p>
          </div>
        )}

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
            <Link to={`/user/modify`}>
              <button className={styles.button}>정보 변경</button>
            </Link>
            <Link to={`/user/address/${user.email}`}>
              <button className={styles.button}>주소 변경</button>
            </Link>
            <Link to={`/user/password/${user.email}`}>
              <button className={styles.button}>비밀번호 변경</button>
            </Link>
            <Link to={`/user/remove/${user.email}`}>
              <button className={styles.button}>탈퇴하기</button>
            </Link>
          </div>
        )}

        {activeMenu === "sales" && saleItems && saleItems.length > 0 && (
          <ul className={styles.list}>
            <li className={styles.title}>판매리스트:</li>
            {saleItems.map((item) => (
              <li key={item.id} className={styles.listItem}>
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
