import jwtAxios from "../util/jwtUtil";
import { API_SERVER_HOST } from "./userApi";

const host = `${API_SERVER_HOST}/alarm`;

export const sendAlarm = async (alarm) => {
  // jwtAxios.post 메서드의 두 번째 매개변수로 요청 본문을 전달합니다.
  const res = await jwtAxios.post(`${host}/send`, alarm);

  return res.data;
};

export const getAlarms = async () => {
  const res = await jwtAxios.get(`${host}/list`);

  return res.data;
};

export const readAlarms = async (alarmIds) => {
  const res = await jwtAxios.post(`${host}/read`, alarmIds);
  return res.data;
};
