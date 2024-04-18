import { useEffect, useState } from "react";
import useCustomMovePage from "../../hooks/useCustomMovePage";
import { getOne } from "../../api/auctionApi";
import { API_SERVER_HOST } from "../../api/userApi";
import useCustomTimes from "../../hooks/useCustomTimes";
import { useNavigate, useParams } from "react-router-dom";
import { formatNumber } from "../../util/formatNumberUtil";
import { formatDateTime } from "../../util/formatTimeUtil";

import A_Chat from "../auction/chat/A_Chat";

const initState = {
  apName: "",
  apDesc: "",
  apStartPrice: 0,
  uploadFileNames: [],
};
const host = API_SERVER_HOST;

const A_ReadComponent = () => {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [username, setUsername] = useState("user0@aaa.com");
  const [room, setRoom] = useState(1); // 예시로 '기본 방'으로 설정
  const [auctionProduct, setAuctionProduct] = useState(initState);
  const { moveProductListPage, moveModifyPage } = useCustomMovePage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openImg, setOpenImg] = useState(false);
  const [selectedImgPath, setSelectedImgPath] = useState("");
  const { apno } = useParams();
  const remainingTime = useCustomTimes(auctionProduct.apStartTime);
  const [socket, setSocket] = useState(null);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedClosingDate, setFormattedClosingDate] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");

  useEffect(() => {
    setLoading(true);
    getOne(apno).then((data) => {
      console.log(data);
      setAuctionProduct(data);
      setFormattedDate(formatDateTime(data.apStartTime));
      setFormattedClosingDate(formatDateTime(data.apClosingTime));
      window.scrollTo(0, 0);
      setLoading(false);
    });
  }, [apno]);

  // openChatModal 함수 내에서 WebSocket을 열고 새로운 입찰가를 받았을 때 해당 값을 상태로 업데이트합니다.
  const openChatModal = () => {
    const newSocket = new WebSocket(`ws:/localhost:8080/api/chat?room=${room}`);
    newSocket.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(newSocket);
      setRoom(auctionProduct.apno);
      setIsChatModalOpen(true);
      console.log(isChatModalOpen);
    };
  };

  const closeChatModal = () => {
    setIsChatModalOpen(false);
    if (socket) {
      socket.close();
      setSocket(null);
    }
  };

  const closeImageModal = () => {
    setOpenImg(false);
  };

  const auctionStatusDesc = {
    PENDING: "경매 대기 중",
    ACTIVE: "경매 진행 중",
    CLOSED: "경매 종료",
    CANCELLED: "경매 취소",
  };

  return (
    <>
      <div className="flex justify-center mt-20" style={{ minHeight: "65vh" }}>
        <div className="grid grid-cols-2 gap-10">
          <div className="flex justify-center items-center">
            <div className="max-w-md">
              {auctionProduct.uploadFileNames.map((imgFile, i) => (
                <img
                  key={i}
                  src={`${host}/auction/view/${imgFile}`}
                  className="w-full rounded-lg shadow-md cursor-pointer"
                  alt="product"
                  style={{ height: "500px" }}
                  onClick={() => {
                    setOpenImg(true);
                    setSelectedImgPath(`${host}/auction/view/${imgFile}`);
                  }}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="max-w-md">
              <div className="text-lg mb-4">{auctionProduct.apCategory}</div>
              <div className="font-bold text-2xl mb-4">
                {auctionProduct.apName}
              </div>
              <div className="text-lg mb-4">{auctionProduct.apDesc}</div>
              <div className="text-gray-700 mb-4">
                물품 번호: {auctionProduct.apno}
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-lg">시작가</div>
                <div className="text-lg">
                  {formatNumber(auctionProduct.apStartPrice)}원
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-lg">입찰단위</div>
                <div className="text-lg">
                  {formatNumber(auctionProduct.apBidIncrement)}원
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                {(auctionProduct.apStatus === "ACTIVE" ||
                  auctionProduct.apStatus === "CLOSED") && (
                  <>
                    <div className="font-bold text-lg">현재 입찰가</div>
                    <div className="text-lg">
                      {formatNumber(
                        currentPrice || auctionProduct.apCurrentPrice
                      )}
                      원
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-lg">물품상태</div>
                <div className="text-lg">
                  {auctionStatusDesc[auctionProduct.apStatus]}
                </div>
              </div>
              {auctionProduct.apStatus === "CLOSED" && (
                <div className="flex items-center justify-between">
                  <div className="font-bold text-lg">낙찰자</div>
                  <div className="text-lg">{auctionProduct.apBuyer}</div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="font-bold text-lg">시작시간</div>
                <div className="text-lg">{formattedDate}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-bold text-lg">종료시간</div>
                <div className="text-lg">{formattedClosingDate}</div>
              </div>

              {auctionProduct.apStatus === "PENDING" && (
                <div className="flex items-center justify-between mb-4">
                  <div className="font-bold text-lg">경매 시작까지</div>
                  <div className="text-lg">{remainingTime}</div>
                </div>
              )}
              <div className="flex space-x-4">
                {auctionProduct.apStatus === "ACTIVE" && (
                  <button
                    className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900"
                    onClick={() => openChatModal()}
                  >
                    경매 채팅
                  </button>
                )}
                <div>
                  {isChatModalOpen && (
                    <A_Chat
                      username={username}
                      room={room}
                      socket={socket}
                      closeModal={closeChatModal}
                      startPrice={auctionProduct.apStartPrice}
                      bidIncrement={auctionProduct.apBidIncrement}
                      imageSrc={auctionProduct.uploadFileNames}
                    />
                  )}
                </div>
                <button
                  className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
                  onClick={moveProductListPage}
                >
                  목록
                </button>
                <button
                  className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900"
                  onClick={() => moveModifyPage(apno)}
                >
                  수정
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default A_ReadComponent;
