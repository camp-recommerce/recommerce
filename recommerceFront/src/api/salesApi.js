import axios from "axios";
import { API_SERVER_HOST } from "./userApi";

const host = `${API_SERVER_HOST}/sales`;

export const fetchSaleItems = async (email) => {
  const res = await axios.get(`${host}/items/${email}`);
  return res.data;
};

// 판매 아이템 삭제하기
export const deleteSaleItem = async (sino) => {
  try {
    await axios.delete(`${host}/${sino}`);
  } catch (error) {
    throw new Error("Failed to delete sale item");
  }
};
