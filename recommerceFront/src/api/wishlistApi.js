import axios from "axios";
import jwtAxios from "../util/jwtUtil";
import { API_SERVER_HOST } from "./userApi";

const host = `${API_SERVER_HOST}/wishlist`;

export const getWishlistItems = async () => {
  const res = await jwtAxios.get(`${host}/items`);

  return res.data;
};

export const postWishlistItems = async (cartItem) => {
  const res = await jwtAxios.post(`${host}/change`, cartItem);

  return res.data;
};
