import { useEffect, useState } from "react";
import useCustomMovePage from "../../hooks/useCustomMovePage";
import { getOne } from "../../api/auctionApi";
import { API_SERVER_HOST } from "../../api/userApi";
import useCustomTimes from "../../hooks/useCustomTimes";
import { useNavigate, useParams } from "react-router-dom";
import { formatNumber } from "../../util/formatNumberUtil";

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
  const [username, setUsername] = useState("1");
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

  useEffect(() => {
    setLoading(true);

    getOne(apno).then((data) => {
      console.log(data);
      setAuctionProduct(data);
      window.scrollTo(0, 0);
      setLoading(false);
    });
  }, [apno]);

  const connectWebSocket = () => {
    const soc = new WebSocket(`ws:/localhost:8080/api/chat?room=${room}`);

    soc.onopen = () => {
      console.log("WebSocket connection established");
      console.log("web:" + soc); // 소켓 값 확인
      setSocket(soc);
      setRoom(auctionProduct.apno);
      console.log("set socket" + soc);
      setIsChatModalOpen(true); // 소켓 연결이 완료된 후에 모달을 엽니다.
    };
  };
  const closeChatModal = () => {
    socket.close();
    setSocket(null);
    setIsChatModalOpen(false);
  };

  const closeImageModal = () => {
    setOpenImg(false);
  };

  const auctionStatusDescriptions = {
    PENDING: "경매 대기 중",
    ACTIVE: "경매 진행 중",
    CLOSED: "경매 종료",
    CANCELLED: "경매 취소",
  };

  return (
    <div className="flex justify-center mt-20">
      <div className="grid grid-cols-2 gap-10">
        <div className="flex justify-center items-center">
          <div className="max-w-md">
            {auctionProduct.uploadFileNames.map((imgFile, i) => (
              <img
                key={i}
                src={`${host}/auction/view/${imgFile}`}
                className="w-full rounded-lg shadow-md cursor-pointer"
                alt="product"
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
              <div className="font-bold text-lg">물품상태</div>
              <div className="text-lg">
                {auctionStatusDescriptions[auctionProduct.apStatus]}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="font-bold text-lg">시작시간</div>
              <div className="text-lg">{auctionProduct.apStartTime}</div>
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="text-sm">
                (경매는 시작 후 2시간 동안 진행됩니다)
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-lg">경매 시작까지</div>
              <div className="text-lg">{remainingTime}</div>
            </div>
            <div className="flex space-x-4">
              <button
                className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900"
                onClick={() => {
                  // handleChat logic here
                }}
              >
                경매 채팅
              </button>
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
      {openImg && (
        <ImageModal
          openImg={openImg}
          callbackFn={closeImageModal}
          imagePath={selectedImgPath}
        />
      )}
    </div>
    <div className="flex justify-center mt-20">
      <div className="grid grid-cols-2 gap-10">
        <div className="flex justify-center items-center">
          <div className="max-w-md">
            {auctionProduct.uploadFileNames.map((imgFile, i) => (
              <img
                key={i}
                src={`${host}/auction/view/${imgFile}`}
                className="w-full rounded-lg shadow-md cursor-pointer"
                alt="product"
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
            <div className="font-bold text-2xl mb-4">
              {auctionProduct.apName}
            </div>
            <div className="text-lg mb-4">{auctionProduct.apDesc}</div>
            <div className="text-gray-700 mb-4">
              상품 번호: {auctionProduct.apno}
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-lg">판매가</div>
              <div className="text-lg">
                {formatNumber(auctionProduct.apStartPrice)}원
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900"
                onClick={connectWebSocket}
              >
                경매 채팅
              </button>
              <button
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
                onClick={moveProoductListPage}
              >
                {isChatModalOpen && (
                  <A_Chat
                    username={username}
                    room={room}
                    socket={socket}
                    closeModal={() => closeChatModal}
                  />
                )}
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
      {/* {openImg && (
        <ImageModal
          openImg={openImg}
          callbackFn={closeImageModal}
          imagePath={selectedImgPath}
        />
      )} */}
    </div>
  );
};

export default A_ReadComponent;
