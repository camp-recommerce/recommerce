import { useDispatch, useSelector } from "react-redux";
import { getAlarmsAsync, sendAlarmAsync } from "../slices/chatAlarmSlice";

const useCustomChatAlarm = () => {
  const alarmList = useSelector((state) => state.chatAlarmSlice);
  const dispatch = useDispatch();
  const refreshAlarm = () => {
    dispatch(getAlarmsAsync());
  };
  const sendAlarm = (param) => {
    dispatch(sendAlarmAsync(param));
  };
  return { alarmList, refreshAlarm, sendAlarm };
};

export default useCustomChatAlarm;
