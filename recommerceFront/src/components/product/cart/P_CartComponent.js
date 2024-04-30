import React, { useEffect, useState } from "react";
import P_CartItemComponent from "./P_CartItemComponent";
import useCustomLoginPage from "../../../hooks/useCustomLoginPage";
import useCustomWishListPage from "../../../hooks/useCustomWishListPage";
import { formatNumber } from "../../../util/formatNumberUtil";
import { useNavigate } from "react-router-dom";

const P_CartComponent = () => {
  const { isLogin, loginState } = useCustomLoginPage();
  const { refreshCart, changeCart, cartItems } = useCustomWishListPage();
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogin) {
      setSelectedItems(cartItems.map((item) => item.wino));
      refreshCart();
    }
  }, [isLogin]);

  useEffect(() => {
    const handleResize = () => {
      // 화면의 너비에 따라 그리드의 열 수를 결정하여 설정합니다.
      const numCols = window.innerWidth > 1025 ? 4 : 2;
      document.documentElement.style.setProperty("--grid-cols", numCols);
    };

    // 컴포넌트가 마운트될 때 한 번 실행하고, 창의 크기가 변할 때마다 다시 실행합니다.
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const calculateTotalAmount = () => {
    let total = 0;
    selectedItems.forEach((wino) => {
      const selectedItem = cartItems.find((item) => item.wino === wino);
      if (selectedItem) {
        total += selectedItem.price * selectedItem.qty;
      }
    });
    return total;
  };

  const handleItemSelect = (wino) => {
    if (selectedItems.includes(wino)) {
      setSelectedItems(selectedItems.filter((item) => item !== wino));
    } else {
      setSelectedItems([...selectedItems, wino]);
    }
  };

  useEffect(() => {
    if (isLogin) {
      refreshCart();
    }
  }, [isLogin]); // 로그인 상태가 변경될 때만 refreshCart를 호출

  useEffect(() => {
    const total = calculateTotalAmount();
    setTotalAmount(total);
  }, [cartItems, selectedItems]);

  return (
    <div className="cart-group basketdiv" style={{ minHeight: 700 }}>
      {isLogin ? (
        <div className="cart-area">
          <div className="cart-wrap itemWrap">
            <div
              className="cart-box cartLength border-b-2 border-black font-bold text-lg mt-2"
              style={{ display: "flex", alignItems: "center", height: 50 }}
            >
              찜 목록({cartItems.length})
            </div>
            <div
              className="grid grid-cols-4 gap-4
            "
              style={{
                gridTemplateColumns: "repeat(var(--grid-cols), 1fr)",
                marginBottom: 35,
              }}
            >
              {cartItems.map((item) => (
                <P_CartItemComponent
                  {...item}
                  key={item.wino}
                  changeCart={changeCart}
                  email={loginState.email}
                  onSelect={() => handleItemSelect(item.wino)}
                  isSelected={selectedItems.includes(item.wino)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="empty">로그인이 필요합니다.</div>
      )}
    </div>
  );
};

export default P_CartComponent;
