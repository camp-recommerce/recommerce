import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { readUser } from "../../api/userApi";
import { fetchPurchaseItems } from "../../api/purchaseApi";
import { getBidList } from "../../api/auctionBidApi";
import { getMyList } from "../../api/auctionApi";
import useCustomMovePage from "../../hooks/useCustomMovePage";
import { API_SERVER_HOST } from "../../api/userApi";
import ImageModal from "../modal/ImageModal";
import A_Chat from "../auction/chat/A_Chat";
import useCustomChatModal from "../../hooks/useCustomChatModal";
import { useNavigate } from "react-router-dom";
import UserProductComponent from "./UserProductComponent";
import styles from '../../scss/user/MyPageComponent.scss';

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
         
          const purchases = await fetchPurchaseItems(user.email);
          setPurchaseItems(purchases);

          getMyList({ page, size, apBuyer }).then((data) => {
            console.log(data);
            setAuction(data);
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
    navigate("/user/by-user"); // UserProducts 컴포넌트의 경로로 이동
  };

  return (
    <div className={styles.myPageContainer}>
      <div className={styles.sidebar}>
        <div className={`${styles.menuItem} ${activeMenu === "profile" ? styles.active : ""}`}
             onClick={() => setActiveMenu("profile")}>My Page</div>
        <div className={`${styles.menuItem} ${activeMenu === "sales" ? styles.active : ""}`}
             onClick={() => setActiveMenu("sales")}>판매목록</div>
        <div className={`${styles.menuItem} ${activeMenu === "bid" ? styles.active : ""}`}
             onClick={() => setActiveMenu("bid")}>경매</div>
        <div className={`${styles.menuItem} ${activeMenu === "settings" ? styles.active : ""}`}
             onClick={() => setActiveMenu("settings")}>설정</div>
      </div>
      <div className={styles.content}>
        {/* 컨텐츠는 activeMenu에 따라 다르게 렌더링 됩니다 */}
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
        {activeMenu === "sales" && (
          <div className={styles.userInfo}>
            <UserProductComponent /> {/* UserProductComponent 렌더링 */}
          </div>
        )}
        {activeMenu === "bid" && (
          <div>
            <ul className={styles.list}>
              <li className={styles.title}>낙찰 물품</li>
              {auction && auction.dtoList.map((item) => (
                <div key={item.apno}>
                  <img
                    alt={item.apno}
                    src={`${host}/auction/view/s_${item.uploadFileNames[0]}`}
                    className={styles.image}
                    onClick={() => handleImageClick(item.uploadFileNames[0])}
                  />
                  <li className={styles.listItem}>
                    상품 이름: {item.apName}, 낙찰가: {item.apCurrentPrice}원
                  </li>
                  <button
                    className="bg-black text-white font-bold mt-1 mb-2"
                    onClick={() => moveMyPageToAuctonRead(item.apno)}
                    style={{ width: 130, height: 28, borderRadius: 5 }}
                  >
                    페이지 이동
                  </button>
                  <button
                    className="bg-black text-white font-bold mt-1 ml-2 mb-2"
                    style={{ width: 130, height: 28, borderRadius: 5 }}
                  >
                    결제
                  </button>
                </div>
              ))}
              {auction && auction.dtoList.length === 0 && (
                <p className="mt-3 text-gray-500">낙찰한 물품이 없습니다.</p>
              )}
            </ul>
            {bidlist && bidlist.length > 0 && (
              <div className="mt-5">
                <ul className={styles.list}>
                  <li className={styles.title}>입찰한 경매</li>
                  {bidlist.map((item) => {
                    let status;
                    if (item.apStatus === "ACTIVE") {
                      status = "경매중";
                    } else if (item.apStatus === "CLOSED") {
                      status = "경매 종료";
                      return null;
                    } else {
                      status = item.apStatus;
                    }
                    return (
                      <div key={item.apno}>
                        <div>
                          <img
                            alt={item.auctionApno}
                            src={`${host}/auction/view/s_${item.uploadFileNames[0]}`}
                            className={styles.image}
                            onClick={() => handleImageClick(item.uploadFileNames[0])}
                          />
                        </div>
                        <li className={styles.listItem}>
                          상품 이름: {item.apName}, 내 입찰가: {item.bidAmount}원,
                          현재 입찰가: {item.currentPrice}
                        </li>
                        <button
                          className="bg-black text-white font-bold mt-1 mb-2"
                          onClick={() => moveMyPageToAuctonRead(item.auctionApno)}
                          style={{ width: 130, height: 28, borderRadius: 5 }}
                        >
                          페이지 이동
                        </button>
                        {item.apStatus !== "CLOSED" && (
                          <button
                            className="bg-black text-white font-bold mt-1 ml-2 mb-2"
                            style={{ width: 130, height: 28, borderRadius: 5 }}
                            onClick={() => openChatModal(item.auctionApno, {
                              startPrice: item.startPrice,
                              bidIncrement: item.bidIncrement,
                              imageSrc: item.uploadFileNames,
                              currentPrice: item.currentPrice
                            })}
                          >
                            입찰 하기
                          </button>
                        )}
                        {roomId === item.auctionApno && (
                          <A_Chat
                            username={email}
                            room={item.auctionApno}
                            socket={socket}
                            closeModal={closeChatModal}
                            startPrice={item.startPrice}
                            bidIncrement={item.bidIncrement}
                            imageSrc={item.uploadFileNames}
                            currentPrice={item.currentPrice}
                          />
                        )}
                      </div>
                    );
                  })}
                </ul>
                {openImg && (
                  <ImageModal
                    openImg={openImg}
                    callbackFn={closeImageModal}
                    imagePath={selectedImgPath}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPageComponent;
