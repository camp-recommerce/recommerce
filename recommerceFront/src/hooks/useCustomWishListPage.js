import { useDispatch, useSelector } from "react-redux";
import {
  getWishlistItemsAsync,
  postWishlistItemsAsync,
} from "../slices/wishlistSlice";

const useCustomWishListPage = () => {
  const cartItems = useSelector((state) => state.wishlistSlice);
  const dispatch = useDispatch();
  const refreshCart = () => {
    dispatch(getWishlistItemsAsync());
  };

  const changeCart = (param) => {
    dispatch(postWishlistItemsAsync(param));
  };

  return { cartItems, refreshCart, changeCart };
};

export default useCustomWishListPage;
