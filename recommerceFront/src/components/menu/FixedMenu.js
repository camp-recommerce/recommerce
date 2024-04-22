import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCustomLoginPage from "../../hooks/useCustomLoginPage";
import useCustomWishListPage from "../../hooks/useCustomWishListPage";

function FixedMenu() {
  const { isLogin } = useCustomLoginPage();
  const { refreshCart, cartItems } = useCustomWishListPage();

  const [isClosed, setIsClosed] = useState(false);

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
      className={`w-90 ${
        isClosed ? "h-25" : "h-200"
      } bg-opacity-85 bg-white border border-opacity-50 z-10 flex flex-col fixed top-200 right-5 transition-all duration-700 ease-in-out mt-20`}
    >
      {isClosed ? (
        <button
          className="w-full  text-gray-800 font-semibold text-sm border-b border-opacity-30 btn-top"
          style={{ height: 25 }}
          onClick={handleOpen}
        >
          열기
        </button>
      ) : (
        <>
          <button
            className="w-full  text-gray-800 font-semibold text-sm border-b border-opacity-30 btn-top"
            style={{ height: 50 }}
            onClick={moveShoppingBasket}
          >
            장바구니
          </button>
          <button
            className="w-full  text-gray-800 font-semibold text-sm border-b border-opacity-30 btn-top"
            onClick={moveShoppingBasket}
            style={{ height: 50 }}
          >
            1:1 채팅
          </button>
          <button
            className="w-full  text-gray-800 font-semibold text-sm border-b border-opacity-30 btn-top"
            onClick={handleClose}
            style={{ height: 25 }}
          >
            접기
          </button>
          <button
            className="w-full  text-gray-800 font-semibold text-sm border-b border-opacity-30 btn-top"
            style={{ height: 25 }}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            ▲ Top
          </button>
        </>
      )}
    </div>
  );
}

export default FixedMenu;
