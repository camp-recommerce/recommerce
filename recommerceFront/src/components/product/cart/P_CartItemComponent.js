import { formatNumber } from "../../../util/formatNumberUtil";
import { IoCloseOutline } from "react-icons/io5";
import { API_SERVER_HOST } from "../../../api/userApi";

const P_CartItemComponent = ({
  wino,
  pname,
  price,
  pno,
  imageFile,
  changeCart,
  email,
  onSelect,
  isSelected,
}) => {
  const host = API_SERVER_HOST;
  const handleDelete = () => {
    
    changeCart({ email, wino, pno, qty: 0});
  };

  return (
    <div className="cartItem-group">
      <div className="cartItem-area flex items-center">
        <div className="cartItem-wrap cartItemSelect w-16 flex justify-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(wino)}
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
