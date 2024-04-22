import { useState } from "react";
import { formatNumber } from "../../../util/formatNumberUtil";
import { IoCloseOutline } from "react-icons/io5";
import { API_SERVER_HOST } from "../../../api/userApi";

const P_CartItemComponent = ({
  cino,
  pname,
  pdesc,
  price,
  pno,
  qty,
  imageFile,
  changeCart,
  email,
  onSelect,
  isSelected,
}) => {
  const [quantity, setQuantity] = useState(qty);
  const host = API_SERVER_HOST;
  const handleClickQty = (amount) => {
    const newQty = qty + amount;
    if (newQty > 0) {
      changeCart({ email, cino, pno, qty: newQty });
    } else {
      alert("수량은 1 이상이어야 합니다.");
    }
  };

  const handleDelete = () => {
    const newQty = 0;
    changeCart({ email, cino, pno, qty: newQty });
  };

  const handleQuantityInput = (event) => {
    const inputQuantity = parseInt(event.target.value, 10);
    if (!isNaN(inputQuantity) && inputQuantity >= 0) {
      setQuantity(inputQuantity);
      changeCart({ email, cino, pno, qty: inputQuantity });
    } else {
      alert("수량은 1 이상이어야 합니다.");
    }
  };

  return (
    <div className="cartItem-group">
      <div className="cartItem-area flex items-center">
        <div className="cartItem-wrap cartItemSelect w-16 flex justify-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(cino)}
          />
        </div>

        <div className="cartItem-wrap cartItemImg">
          <img src={`${host}/api/products/view/s_${imageFile}`} alt={pname} />
        </div>

        <div className="cartItem-wrap cartItemPname flex-grow pl-4">
          <div className="pname">{pname}</div>
        </div>
        <div className="cartItem-wrap cartItemPrice w-24">
          {formatNumber(price)} 원
        </div>
        <div className="cartItem-wrap cartItemQty flex items-center">
          <div className="cartItem-box flex items-center">
            <button
              className="quantity_button"
              onClick={() => handleClickQty(-1)}
            >
              -
            </button>
            <input
              type="text"
              className="quantity_display mx-2"
              value={qty}
              onChange={handleQuantityInput}
              min="1"
            />
            <button
              className="quantity_button"
              onClick={() => handleClickQty(1)}
            >
              +
            </button>
          </div>
        </div>
        <div className="cartItem-wrap cartItemTprice w-24">
          {formatNumber(qty * price)} 원
        </div>
        <div className="cartItem-wrap cartItemDelete w-16 flex justify-center">
          <button onClick={handleDelete}>
            <IoCloseOutline />
          </button>
        </div>
      </div>
    </div>
  );
};
export default P_CartItemComponent;
