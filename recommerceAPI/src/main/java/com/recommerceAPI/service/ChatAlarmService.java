package com.recommerceAPI.service;

import com.recommerceAPI.domain.ChatAlarm;
import com.recommerceAPI.dto.ChatAlarmDTO;

import java.util.List;

public interface ChatAlarmService {
    List<ChatAlarmDTO> saveModChatAlarm(ChatAlarmDTO chatAlarmDTO);
    List<ChatAlarmDTO> getAlarmList(String email);
    List<ChatAlarmDTO> updateMultipleChatAlarmsToRead(Long alarmId);
    List<ChatAlarmDTO> getRoomList(String email);
    void sendAuctionAlarm(ChatAlarmDTO chatAlarmDTO);
    void deleteAllChatAlarmsByRoomId(String roomId);
}
