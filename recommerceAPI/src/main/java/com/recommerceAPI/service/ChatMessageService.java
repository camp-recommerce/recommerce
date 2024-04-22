package com.recommerceAPI.service;

import com.recommerceAPI.domain.AuctionBidding;
import com.recommerceAPI.domain.ChatMessage;
import com.recommerceAPI.dto.ChatMessageDTO;
import org.springframework.web.socket.WebSocketSession;

public interface ChatMessageService {
    void sendPreviousChatHistory(String room, WebSocketSession session);

    public ChatMessage saveChat(ChatMessageDTO chatMessageDTO);
}
