import axios from "axios";
import { API_SERVER_HOST } from "./userApi";
import jwtAxios from "../util/jwtUtil";

const host = `${API_SERVER_HOST}/auction/bid`;

export const getBidList = async (email) => {
  try {
    const res = await jwtAxios.get(`${host}/list`, {
      params: { email },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching auction list:", error);
    throw error; // 오류를 호출자에게 전파
  }
};
