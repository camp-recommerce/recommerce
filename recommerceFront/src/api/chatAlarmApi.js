
import jwtAxios from "../util/jwtUtil";
import { API_SERVER_HOST } from "./userApi";

const host = `${API_SERVER_HOST}/chat`;

export const sendAlarm = async (alarm, email) => {

      // jwtAxios.post 메서드의 두 번째 매개변수로 요청 본문을 전달합니다.
      const res = await jwtAxios.post(`${host}/alarm`, alarm,email);
      
      return res.data;
 
    
  };
  