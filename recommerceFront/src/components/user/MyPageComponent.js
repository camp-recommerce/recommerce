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
          const sales = await fetchSaleItems(user.email);
          setSaleItems(sales);
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
  const styles = {
    myPageBundle: {
      padding: "20px",
      margin: "40px auto",
      maxWidth: "800px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    },
    menuButtons: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "20px",
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
      transition: "background-color 0.3s ease",
      ':hover': { // 가상 클래스는 인라인 스타일에서 지원하지 않으므로 다른 방법을 사용해야 함
        backgroundColor: "#0056b3"
      }
    },
    infoBundle: {
      backgroundColor: "#fff",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    },
    userInfo: {
      marginBottom: "15px",
      fontSize: "16px",
      color: "#333",
    },
    list: {
      listStyle: "none",
      paddingLeft: "0",
      width: "100%",
    },
    listItem: {
      padding: "10px 0",
      borderBottom: "1px solid #eee",
      ':last-child': {
        borderBottom: "none"
      }
    },
    title: {
      fontWeight: "bold",
      fontSize: "18px",
      marginBottom: "15px",
      color: "#333",
    },
    profileImageContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "15px",
    },
    profileImage: {
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      border: "3px solid #000",
      padding: "3px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    fileInput: {
      marginTop: "15px",
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
          </div>
        )}

        {activeMenu === "profile" && userData && (
          <div style={styles.userInfo}>
            <p>Email: {userData.email}</p>
            <p>닉네임: {userData.nickname}</p>
            <p>휴대폰: {userData.phone}</p>
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

        {activeMenu === "bid" && (
          <div>
            <ul style={styles.list}>
              <li style={styles.title}>낙찰 물품</li>
              {auction.dtoList.map((item) => (
                <div key={item.apno}>
                  <img
                    alt={item.apno}
                    src={`${host}/auction/view/s_${item.uploadFileNames[0]}`}
                    style={{ width: 180, height: 120, cursor: "pointer" }}
                    onClick={() => handleImageClick(item.uploadFileNames[0])}
                  />
                  <li style={styles.listItem}>
                    상품이름: {item.apName} , 낙찰가: {item.apCurrentPrice}원
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
            </ul>
            {auction.dtoList.length === 0 && (
              <p className="mt-3 text-gray-500">낙찰한 물품이 없습니다.</p>
            )}
          </div>
        )}
        {activeMenu === "bid" && (
          <div className="mt-5">
            <ul style={styles.list}>
              <li style={styles.title}>입찰한 경매</li>
              {bidlist && bidlist.length > 0 ? (
                bidlist.map((item) => {
                  // apStatus에 따라 표시할 상태 설정
                  let status;
                  if (item.apStatus === "ACTIVE") {
                    status = "경매중";
                  } else if (item.apStatus === "CLOSED") {
                    status = "경매 종료";
                    // 경매 종료 상태인 경우 렌더링을 건너뜁니다.
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
                          style={{ width: 180, height: 120 }}
                          onClick={() =>
                            handleImageClick(item.uploadFileNames[0])
                          } // 이미지 클릭 시 모달 열림
                        />
                      </div>
                      <li style={styles.listItem}>
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
                          onClick={() =>
                            openChatModal(item.auctionApno, {
                              startPrice: item.startPrice,
                              bidIncrement: item.bidIncrement,
                              imageSrc: item.uploadFileNames,
                              currentPrice: item.currentPrice,
                            })
                          }
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
                })
              ) : (
                <p className="mt-3 text-gray-500">입찰 중인 물품이 없습니다.</p>
              )}
            </ul>
            {openImg && ( // 모달 열림 상태에 따라 모달 렌더링
              <ImageModal
                openImg={openImg}
                callbackFn={closeImageModal}
                imagePath={selectedImgPath}
              />
            )}
          </div>
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
        <button style={styles.button} onClick={goToSales}>
          판매목록
        </button>
        <button style={styles.button} onClick={() => setActiveMenu("bid")}>
          경매
        </button>
      </div>
    </div>
  );
};

export default MyPageComponent;
