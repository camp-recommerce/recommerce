import { useDispatch, useSelector } from "react-redux";
import {
  getWishlistItemsAsync,
  postWishlistItemsAsync,
} from "../slices/wishlistSlice";

const useCustomWishListPage = () => {
  const cartItems = useSelector((state) => state.wishlistSlice); //찜목록
  const dispatch = useDispatch();
  const refreshCart = () => {
    // 목록 새로고침
    dispatch(getWishlistItemsAsync());
  };

  const changeCart = (param) => {
    // 찜 목록의 변경 요청
    dispatch(postWishlistItemsAsync(param));
  };

  return { cartItems, refreshCart, changeCart };
};

export default useCustomWishListPage;
