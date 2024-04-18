import axios from "axios";
import { API_SERVER_HOST } from "./userApi";

const host = `${API_SERVER_HOST}/purchase`;

export const fetchPurchaseItems = async (email) => {
  const res = await axios.get(`${host}/items/${email}`);
  return res.data;
};

// 구매 아이템 삭제하기
export const deletePurchaseItem = async (puino) => {
  try {
    await axios.delete(`${host}/${puino}`);
  } catch (error) {
    throw new Error("Failed to delete purchase item");
  }
};
