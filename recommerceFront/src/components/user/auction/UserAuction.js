import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getBidList } from "../../../api/auctionBidApi";
import { getMyList } from "../../../api/auctionApi";
import useCustomMovePage from "../../../hooks/useCustomMovePage";
import { API_SERVER_HOST } from "../../../api/userApi";
import ImageModal from "../../modal/ImageModal";
import A_Chat from "../../auction/chat/A_Chat";
import useCustomChatModal from "../../../hooks/useCustomChatModal";
import { useNavigate } from "react-router-dom";
import styles from "../../../scss/user/MyPageComponent.module.scss";
import { CgEnter } from "react-icons/cg";
const host = API_SERVER_HOST;
const UserAuction = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.loginSlice);
  const { page, size, moveMyPageToAuctonRead } = useCustomMovePage();
  const [auction, setAuction] = useState(null);
  const [bidlist, setBidList] = useState(null);
  const [openImg, setOpenImg] = useState(false);
  const [selectedImgPath, setSelectedImgPath] = useState("");
  const { openChatModal, closeChatModal, isChatModalOpen, socket, roomId } =
    useCustomChatModal();
  const email = user.email;
  const apBuyer = user.email;
  useEffect(() => {
    if (user && user.email) {
      const fetchData = async () => {
        const auctionData = await getMyList({ page, size, apBuyer });
        setAuction(auctionData);

        const bidListData = await getBidList(email);
        setBidList(bidListData);
      };
      fetchData();
    }
  }, [user]);
  const handleClickPayment = (item) => {
    navigate("/payment", {
      state: {
        productName: item.apName,
        productPrice: item.apCurrentPrice,
        productId: item.apno,
        quantity: 1,
      },
    });
  };
  const handleImageClick = (imageName) => {
    setSelectedImgPath(`${host}/auction/view/${imageName}`);
    setOpenImg(true);
  };
  const closeImageModal = () => {
    setOpenImg(false);
  };
  return (
    <>
      <div
        style={{
          minHeight: 600,
          marginTop: 10,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ul className={styles.list}>
          <li className={styles.title}>낙찰 물품</li>
          {auction &&
            auction.dtoList.map((item) => (
              <div key={item.apno}>
                <img
                  style={{ width: 400, height: 400 }}
                  alt={item.apno}
                  src={`${host}/auction/view/${item.uploadFileNames[0]}`}
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
                  onClick={() => handleClickPayment(item)}
                >
                  결제
                </button>
              </div>
            ))}
          {auction && auction.dtoList.length === 0 && (
            <p className="mt-3 text-gray-500">낙찰한 물품이 없습니다.</p>
          )}
        </ul>

        <div
          className="ml-10"
          style={{
            minHeight: 500,

            display: "flex",
            justifyContent: "center",
          }}
        >
          <ul className={styles.list}>
            <li className={styles.title}>입찰한 경매</li>
            {bidlist && bidlist.length > 0 ? (
              bidlist.map((item) => {
                if (item.apStatus !== "CLOSED") {
                  return (
                    <div key={item.apno}>
                      <img
                        alt={item.auctionApno}
                        style={{ width: 400, height: 400 }}
                        src={`${host}/auction/view/${item.uploadFileNames[0]}`}
                        className={styles.image}
                        onClick={() =>
                          handleImageClick(item.uploadFileNames[0])
                        }
                      />
                      <li className={styles.listItem}>
                        상품 이름: {item.apName}, 내 입찰가: {item.bidAmount}
                        원, 현재 입찰가: {item.currentPrice}
                      </li>
                      <button
                        className="bg-black text-white font-bold mt-1 mb-2"
                        onClick={() => moveMyPageToAuctonRead(item.auctionApno)}
                        style={{ width: 130, height: 28, borderRadius: 5 }}
                      >
                        페이지 이동
                      </button>
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
                      {isChatModalOpen && roomId === item.auctionApno && (
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
                }
                return null;
              })
            ) : (
              <p className="text-gray-500">현재 입찰중인 상품이 없습니다.</p>
            )}
          </ul>
          {openImg && (
            <ImageModal
              openImg={openImg}
              callbackFn={closeImageModal}
              imagePath={selectedImgPath}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default UserAuction;
