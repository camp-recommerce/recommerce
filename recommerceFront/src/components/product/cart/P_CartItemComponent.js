import { formatNumber } from "../../../util/formatNumberUtil";
import { IoCloseOutline } from "react-icons/io5";
import { API_SERVER_HOST } from "../../../api/userApi";
import useCustomMovePage from "../../../hooks/useCustomMovePage";

const P_CartItemComponent = ({
  wino,
  pname,
  price,
  pno,
  imageFile,
  changeCart,
  email,
  soldOut,
  userEmail,
}) => {
  const host = API_SERVER_HOST;

  const { moveCartToProductRead } = useCustomMovePage();

  const handleDelete = () => {
    changeCart({ email, wino, pno, qty: 0 });
  };

  return (
    <>
      <div
        key={pno}
        className="shopList_wrap"
        style={{ width: 350, height: 320, marginLeft: 20, marginTop: 10 }} // 검은색 1px 짜리 테두리
        onMouseEnter={(e) => {
          e.currentTarget.querySelector(".shopList_box").style.transform =
            "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.querySelector(".shopList_box").style.transform =
            "scale(1)";
        }}
      >
        <div className="cartItem-wrap cartItemDelete">
          <button onClick={handleDelete}>
            <IoCloseOutline />
          </button>
        </div>
        <div className="shopList_box w-full h-full">
          <div className="shopList_thum mb-2 flex justify-center ">
            <img
              alt={pname}
              src={`${host}/product/view/s_${imageFile}`}
              className="w-full h-full object-contain"
              onClick={() => moveCartToProductRead(pno)}
              style={{ width: 350, height: 250 }} // Adjusted style
            />
          </div>
          <div className="shopList_pname text-sm mb-1 flex justify-center">
            상품명: {pname} ({soldOut ? "판매완료" : "판매중"})
          </div>
          <div className="shopList_pname text-sm mb-1 flex justify-center">
            판매자: {userEmail}
          </div>
          <div className="shopList_pname text-sm mb-1 flex justify-center">
            가격: {formatNumber(price)}원
          </div>

          <div className="shopList_end text-sm"></div>
        </div>
      </div>
    </>
  );
};
export default P_CartItemComponent;
