package com.recommerceAPI.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recommerceAPI.domain.ChatMessage;
import com.recommerceAPI.dto.ChatMessageDTO;
import com.recommerceAPI.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.List;

@Service
@Log4j2
@RequiredArgsConstructor
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ChatMessageRepository chatMessageRepository;
    private final ModelMapper modelMapper;


    @Override
    public void sendPreviousChatHistory(String room, WebSocketSession session) {
        List<ChatMessage> previousChatHistory = chatMessageRepository.findByRoom(room);

        // 채팅 내역이 없는 경우
        if (previousChatHistory == null || previousChatHistory.isEmpty()) {
            // 세션에 메시지 전송
            ChatMessageDTO messageDTO = new ChatMessageDTO();
            messageDTO.setMessage("채팅방에 어서오세요!");
            sendMessage(session, messageDTO);
            return;
        }
        // 채팅 내역이 있는 경우
        for (ChatMessage chatMessage : previousChatHistory) {
            ChatMessageDTO chatMessageDTO = modelMapper.map(chatMessage, ChatMessageDTO.class);
            sendMessage(session, chatMessageDTO);
        }
    }


    @Override
    public ChatMessage saveChat(ChatMessageDTO chatMessageDTO) {
        ChatMessage chatMessage = modelMapper.map(chatMessageDTO, ChatMessage.class);
        return chatMessageRepository.save(chatMessage);
    }

    private void sendMessage(WebSocketSession session, ChatMessageDTO messageDTO) {
        log.info("----------------------------"+messageDTO);
        try {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(messageDTO)));
        } catch (IOException e) {
            log.error("Error sending message to session {}: {}", session.getId(), e.getMessage(), e);
        }
    }


}
