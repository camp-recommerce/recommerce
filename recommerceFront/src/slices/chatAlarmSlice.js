import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAlarms, sendAlarm } from "../api/chatAlarmApi";

export const getAlarmsAsync = createAsyncThunk("getAlarmsAsync", () => {
  return getAlarms();
});

export const sendAlarmAsync = createAsyncThunk("sendAlarmAsync", (param) => {
  return sendAlarm(param);
});
const initState = [];
const chatAlarmSlice = createSlice({
  name: "chatAlarmSlice",
  initialState: [initState],
  extraReducers: (bulder) => {
    bulder
      .addCase(getAlarmsAsync.fulfilled, (state, action) => {
        console.log("getAlarms");
        return action.payload;
      })
      .addCase(sendAlarmAsync.fulfilled, (state, action) => {
        console.log("sendAlarm");
        return action.payload;
      });
  },
});

export default chatAlarmSlice.reducer;
