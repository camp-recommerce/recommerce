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

  const handleItemSelect = (cino) => {
    if (selectedItems.includes(cino)) {
      setSelectedItems(selectedItems.filter((item) => item !== cino));
    } else {
      setSelectedItems([...selectedItems, cino]);
    }
  };

  useEffect(() => {
    if (isLogin) {
      refreshCart();
    }
  }, [isLogin]);

  useEffect(() => {
    const total = calculateTotalAmount();
    setTotalAmount(total);
  }, [cartItems, selectedItems]);

  return (
    <div className="cart-group basketdiv">
      {isLogin ? (
        <div className="cart-area">
          <div className="cart-wrap itemWrap">
            <div className="cart-box cartLength">
              장바구니 상품({cartItems.length})
            </div>
            <ul className="cart-box cartMenu flex justify-between font-bold text-sm border-t border-b">
              <li>선택</li>
              <li>사진</li>
              <li>상품명</li>
              <li>판매가</li>
              <li>취소</li>
            </ul>
            <ul>
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
            </ul>
          </div>
          <div className="cart-wrap cartTotal">
            <div className="cart-box cartTprice">
              <div>총 상품 금액</div>
              <div>{formatNumber(totalAmount)}원</div>
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
