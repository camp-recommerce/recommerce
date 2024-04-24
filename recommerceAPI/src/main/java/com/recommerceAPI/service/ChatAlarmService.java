package com.recommerceAPI.service;

import com.recommerceAPI.domain.AuctionBidding;
import com.recommerceAPI.domain.ChatAlarm;
import com.recommerceAPI.dto.ChatAlarmDTO;
import com.recommerceAPI.dto.ChatAlarmListDTO;
import com.recommerceAPI.dto.ChatMessageDTO;

import java.util.List;

public interface ChatAlarmService {
    List<ChatAlarmDTO> saveModChatAlarm(ChatAlarmDTO chatAlarmDTO);
    List<ChatAlarmDTO> getAlarmList(String email);
}
