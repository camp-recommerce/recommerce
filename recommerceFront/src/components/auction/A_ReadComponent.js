import { useEffect, useState } from "react";
import useCustomMovePage from "../../hooks/useCustomMovePage";
import { getOne } from "../../api/auctionApi";
import { API_SERVER_HOST } from "../../api/userApi";
import useCustomTimes from "../../hooks/useCustomTimes";
import { useParams } from "react-router-dom";
import { formatNumber } from "../../util/formatNumberUtil";
import { formatDateTime } from "../../util/formatTimeUtil";
import A_Chat from "../auction/chat/A_Chat";
import LoadingModal from "../modal/LoadingModal";
import ImageModal from "../modal/ImageModal";
import useCustomLoginPage from "../../hooks/useCustomLoginPage";
import useCustomChatModal from "../../hooks/useCustomChatModal";

const initState = {
  apName: "",
  apDesc: "",
  apStartPrice: 0,
  uploadFileNames: [],
};
const host = API_SERVER_HOST;

const A_ReadComponent = () => {
  const [auctionProduct, setAuctionProduct] = useState(initState);
  const { moveProductListPage, moveModifyPage } = useCustomMovePage();
  const [loading, setLoading] = useState(false);
  const [openImg, setOpenImg] = useState(false);
  const [selectedImgPath, setSelectedImgPath] = useState("");
  const { apno } = useParams();
  const remainingTime = useCustomTimes(auctionProduct.apStartTime);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedClosingDate, setFormattedClosingDate] = useState("");
  const { loginState } = useCustomLoginPage();
  const { openChatModal, closeChatModal, isChatModalOpen, socket } =
    useCustomChatModal();
  const isAdmin =
    loginState &&
    loginState.roleNames &&
    loginState.roleNames.includes("ADMIN");

  useEffect(() => {
    setLoading(true);
    console.log(loginState);
    getOne(apno).then((data) => {
      console.log(data);
      setAuctionProduct(data);
      setFormattedDate(formatDateTime(data.apStartTime));
      setFormattedClosingDate(formatDateTime(data.apClosingTime));
      window.scrollTo(0, 0);
      setLoading(false);
    });
  }, [apno, isChatModalOpen]);
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
      {loading ? <LoadingModal /> : <></>}
      <div
        className="flex justify-center mt-20"
        style={{ minHeight: "65vh", position: "relative" }}
      >
        <div className="grid grid-cols-2 gap-10" style={{ minHeight: 620 }}>
          <div className="flex justify-center items-center">
            <div className="max-w-md" style={{ width: "90%" }}>
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
              {openImg && (
                <ImageModal
                  openImg={openImg}
                  callbackFn={closeImageModal}
                  imagePath={selectedImgPath}
                />
              )}
            </div>
          </div>
          <div>
            <div className="max-w-md" style={{ minHeight: "550px" }}>
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
                      {auctionProduct.apCurrentPrice !== 0
                        ? formatNumber(auctionProduct.apCurrentPrice)
                        : formatNumber(auctionProduct.apStartPrice)}
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
              <div className="flex space-x-4 absolute bottom-20">
                {auctionProduct.apStatus === "ACTIVE" && loginState.email && (
                  <button
                    className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900"
                    onClick={() => openChatModal(apno)}
                  >
                    경매 채팅
                  </button>
                )}
                <div>
                  {isChatModalOpen && (
                    <A_Chat
                      username={loginState.email}
                      room={auctionProduct.apno}
                      apStatus={auctionProduct.apStatus}
                      socket={socket}
                      closeModal={closeChatModal}
                      startPrice={auctionProduct.apStartPrice}
                      bidIncrement={auctionProduct.apBidIncrement}
                      imageSrc={auctionProduct.uploadFileNames}
                      currentPrice={auctionProduct.apCurrentPrice}
                    />
                  )}
                </div>
                <button
                  className="bg-[#282222] hover:bg-[#515151] text-[#E4E4E3] px-6 py-2 rounded-md"
                  onClick={moveProductListPage}
                >
                  목록
                </button>
                {isAdmin && (
                  <button
                    className="bg-[#E4E4E3] hover:bg-[#515151] text-[#282222] px-6 py-2 rounded-md"
                    onClick={() => moveModifyPage(apno)}
                  >
                    수정
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default A_ReadComponent;
