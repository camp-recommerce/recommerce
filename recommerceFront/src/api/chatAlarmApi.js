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
  try {
    for (const alarmId of alarmIds) {
      await jwtAxios.put(`${host}/read/${alarmId}`);
    }
    console.log("Alarms marked as read.");
  } catch (error) {
    console.error("Error marking alarms as read:", error);
    throw error;
  }
};

export const getRoomList = async () => {
  try {
    const res = await jwtAxios.get(`${host}/room`);
    return res.data;
  } catch (error) {
    console.error("Error fetching auction list:", error);
    throw error; // 오류를 호출자에게 전파
  }
};
export const deleteAlarm = async (roomId) => {
  try {
    await jwtAxios.delete(`${host}/delete/${roomId}`);
    console.log("Alarm deleted successfully.");
  } catch (error) {
    console.error("Error deleting alarm:", error);
    throw error;
  }
};
