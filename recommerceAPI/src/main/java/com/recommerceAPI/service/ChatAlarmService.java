package com.recommerceAPI.service;

import com.recommerceAPI.dto.ChatAlarmDTO;

import java.util.List;

public interface ChatAlarmService {
    List<ChatAlarmDTO> saveModChatAlarm(ChatAlarmDTO chatAlarmDTO);
    List<ChatAlarmDTO> getAlarmList(String email);
    List<ChatAlarmDTO> updateMultipleChatAlarmsToRead(List<Long> alarmIds);
    void sendAuctionAlarm(ChatAlarmDTO chatAlarmDTO);
}
