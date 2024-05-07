import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCustomLoginPage from "../../hooks/useCustomLoginPage";
import useCustomWishListPage from "../../hooks/useCustomWishListPage";
import useCustomChatAlarm from "../../hooks/useCustomChatAlarm";
import AlarmModal from "../modal/AlarmModal";
import { IoTriangle } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { TbArrowBarDown } from "react-icons/tb";
import { TbArrowBarUp } from "react-icons/tb";

function FixedMenu() {
  const { isLogin, loginState } = useCustomLoginPage();
  const { refreshCart, cartItems } = useCustomWishListPage();
  const { refreshAlarm, alarmList } = useCustomChatAlarm();
  const [isClosed, setIsClosed] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달창 상태 변수 추가
  const unreadAlarmCount = alarmList.filter((alarm) => !alarm.readCheck).length;

  const handleClose = () => {
    setIsClosed(true);
  };

  const handleOpen = () => {
    setIsClosed(false);
  };

  const navigate = useNavigate();

  const moveShoppingBasket = useCallback(() => {
    navigate({ pathname: "/product/cart" });
  });

  const openModal = (alarm) => {
    refreshAlarm();
    setIsModalOpen(true); // 모달창 열기
  };

  const closeModal = () => {
    refreshAlarm();
    setIsModalOpen(false); // 모달창 닫기
  };

  useEffect(() => {
    if (isLogin) {
      refreshCart();
      refreshAlarm();
    }
    // 장바구니 상태 최신화
  }, [isLogin]);

  useEffect(() => {
    const handleScrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const btn = document.querySelector(".btn-top");
    btn.addEventListener("click", handleScrollToTop);

    return () => {
      btn.removeEventListener("click", handleScrollToTop);
    };
  }, []); // useEffect의 의존성 배열에 빈 배열 추가

  return (
    <div
      className={`w-[63px] ${
        isClosed ? "h-[25px]" : "h-[300px]"
      }  z-[9993] flex flex-col justify-end fixed bottom-[50px] right-[10px]`}
    >
      {isClosed ? (
        <button
          className="btn-unfold w-full h-[25px] flex justify-center items-center bg-[#E4E4E3] text-[#282222] font-semibold text-lg"
          style={{ height: 25 }}
          onClick={handleOpen}
        >
          <TbArrowBarUp />
        </button>
      ) : (
        <>
          <button
            className="btn-fold w-full h-[25px] flex flex-col justify-center items-center bg-[#E4E4E3]  text-[#282222] font-semibold text-lg"
            onClick={handleClose}
          >
            <TbArrowBarDown />
          </button>
          <button
            className="btn-top w-full h-[60px] rounded-[50%] flex flex-col justify-center items-center bg-[#282222] border-2 border-[#282222] hover:bg-[#515151] hover:border-[#515151] text-[#E4E4E3] font-normal text-sm mt-[10px]"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <IoTriangle />
            <span>Top</span>
          </button>
          <button
            className="btn-wishlist w-full h-[60px] rounded-[50%] flex flex-col justify-center items-center bg-[#E4E4E3] hover:bg-[#515151] text-[#282222] font-semibold text-xs mt-[10px]"
            onClick={moveShoppingBasket}
          >
            <FaHeart className="text-lg" />
            {isLogin ? `(${cartItems.length})` : "(0)"}
          </button>
          <button
            className="btn-chat w-full h-[60px] rounded-[50%] flex flex-col justify-center items-center bg-[#282222] border-2 border-[#282222] hover:bg-[#515151] hover:border-[#515151] text-[#E4E4E3] font-normal text-xs mt-[10px]"
            onClick={() => openModal()} // 모달창 열기
          >
            <AiFillMessage className="text-lg" />
            {isLogin ? `(${unreadAlarmCount})` : "(0)"}
          </button>
          {/* 챗봇 추가용 */}
          {/* <button
            className="btn-chat w-full h-[60px] rounded-[50%] flex flex-col justify-center items-center bg-[#E4E4E3] hover:bg-[#515151] text-[#282222] font-semibold text-xs mt-[10px]"
            onClick={openBotModal} // 모달창 열기
          >
            <RiRobot2Fill className="text-lg" />
            <span>챗봇</span>
          </button> */}
        </>
      )}
      {isModalOpen && ( // 모달창이 열려 있는 경우
        <AlarmModal
          email={loginState.email}
          closeModal={closeModal}
          isModalOpen={isModalOpen}
        />
      )}
    </div>
  );
}

export default FixedMenu;
