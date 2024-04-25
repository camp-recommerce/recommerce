import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCustomLoginPage from "../../hooks/useCustomLoginPage";
import useCustomWishListPage from "../../hooks/useCustomWishListPage";
import useCustomChatAlarm from "../../hooks/useCustomChatAlarm";
import AlarmModal from "../modal/AlarmModal";
import useCustomChatModal from "../../hooks/useCustomChatModal";
import { IoTriangleOutline } from "react-icons/io5";
// <IoTriangleOutline />
import { FaHeart } from "react-icons/fa";
// <FaHeart />
import { AiOutlineMessage } from "react-icons/ai";
// <AiOutlineMessage />
import { TbArrowBarDown } from "react-icons/tb";
// <TbArrowBarDown />
import { TbArrowBarUp } from "react-icons/tb";
// <TbArrowBarUp />

function FixedMenu() {
  const { isLogin, loginState } = useCustomLoginPage();
  const { refreshCart, cartItems } = useCustomWishListPage();
  const { refreshAlarm, alarmList } = useCustomChatAlarm();
  const { closeChatModal } = useCustomChatModal();
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
    setIsModalOpen(true); // 모달창 열기
  };

  const closeModal = () => {
    closeChatModal();
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
      className={`w-[60px] ${
        isClosed ? "h-[25px]" : "h-[300px]"
      }  z-[9999] flex flex-col justify-end fixed bottom-[50px] right-[25px]`}
    >
      {isClosed ? (
        <button
          className="btn-unfold w-full h-[25px] flex justify-center items-center bg-[#E4E4E3] text-[#282222] font-semibold text-sm border"
          style={{ height: 25 }}
          onClick={handleOpen}
        >
          <TbArrowBarDown />
        </button>
      ) : (
        <>
          <button
            className="btn-top w-full h-[60px] rounded-[50%] flex flex-col justify-center items-center bg-[#282222] border-[#282222] text-[#E4E4E3] font-semibold text-sm border"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <IoTriangleOutline /> <span>Top</span>
          </button>
          <button
            className="btn-wishlist w-full h-[60px] rounded-[50%] flex flex-col justify-center items-center bg-[#E4E4E3] text-[#282222] font-semibold text-sm border mt-[10px]"
            onClick={moveShoppingBasket}
          >
            <FaHeart />({cartItems.length})
          </button>
          <button
            className="btn-chat w-full h-[60px] rounded-[50%] flex flex-col justify-center items-center bg-[#282222] border-[#282222] text-[#E4E4E3] font-semibold text-sm border mt-[10px]"
            onClick={() => openModal()} // 모달창 열기
          >
            <AiOutlineMessage />({unreadAlarmCount})
          </button>
          <button
            className="btn-fold w-full h-[25px] flex flex-col justify-center items-center bg-[#E4E4E3]  text-[#282222] font-semibold text-sm border mt-[10px]"
            onClick={handleClose}
          >
            <TbArrowBarUp />
          </button>
        </>
      )}
      {isModalOpen && ( // 모달창이 열려 있는 경우
        <AlarmModal email={loginState.email} closeModal={closeModal} />
      )}
    </div>
  );
}

export default FixedMenu;
