package com.recommerceAPI.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recommerceAPI.dto.ChatMessageDTO;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.net.URI;
import java.util.*;

@Log4j2
@Component
public class ChatHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final  Set<WebSocketSession> sessions = new HashSet<>();

    private final Map<String, List<WebSocketSession>> sessionToUsername = new HashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        log.info("{} connect", session.getId());
        // 여기서 세션과 사용자 이름을 매핑하고 저장
        URI uri = session.getUri();
        String room = extractRoomFromUri(uri);
        List<WebSocketSession> sessionList = sessionToUsername.getOrDefault(room, new ArrayList<>());
        sessionList.add(session);
        sessionToUsername.put(room, sessionList);
        String author = "알림";
        String message = "유저 입장";
        String time = " ";
        ChatMessageDTO notificationDTO = new ChatMessageDTO(room, author, message, ChatMessageDTO.MessageType.NOTIFICATION,time );

        sendMessageToRoom(room,notificationDTO,session);
    }

    private String extractRoomFromUri(URI uri) {
        String queryString = uri.getQuery();
        String[] queryParams = queryString.split("&");
        for (String param : queryParams) {
            String[] keyValue = param.split("=");
            if (keyValue.length == 2 && keyValue[0].equals("room")) {
                return keyValue[1];
            }
        }
        return null;
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        log.info("Received message: {}", payload);

        ChatMessageDTO chatMessageDTO = objectMapper.readValue(payload, ChatMessageDTO.class);
        log.info("Received chat message: {}", chatMessageDTO);

        String author = chatMessageDTO.getAuthor();
        String room = chatMessageDTO.getRoom();
        String content = chatMessageDTO.getMessage();
        String time = chatMessageDTO.getTime(); // time 필드 추가

        log.info("Author: {}", chatMessageDTO.getAuthor());
        log.info("Room: {}", chatMessageDTO.getRoom());
        log.info("Message: {}", chatMessageDTO.getMessage());
        log.info("Time: {}", chatMessageDTO.getTime());

        if (chatMessageDTO.getMessageType() == null) {
            log.error("Message type is null: {}", payload);
            return;
        }

        sendMessageToRoom(room, chatMessageDTO, session); // 수정된 부분
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) throws Exception {

        URI uri = session.getUri();
        String room = extractRoomFromUri(uri);

        String author = "알림";
        String message = "유저 퇴장";
        String time = " ";
        ChatMessageDTO notificationDTO = new ChatMessageDTO(room, author, message, ChatMessageDTO.MessageType.NOTIFICATION,time );

        sendMessageToRoom(room,notificationDTO,session);

        sessions.remove(session);
        sessionToUsername.remove(session.getId());
        log.info("{} disconnect", session.getId());
    }

    // handleTextMessage 메서드 내부에서 사용자가 입력한 채팅을 해당 방의 모든 세션에게 전달하는 부분입니다.
    private void sendMessageToRoom(String room, ChatMessageDTO messageDTO, WebSocketSession senderSession) {
        log.info("=============================" + messageDTO);
        log.info("======================" + sessionToUsername);
        log.info("=============================" + room);

        // 방 번호와 일치하는 모든 세션에 메시지를 보냅니다.
        List<WebSocketSession> sessionsInRoom = sessionToUsername.get(room);
        if (sessionsInRoom != null) {
            for (WebSocketSession session : sessionsInRoom) {
                if (!session.getId().equals(senderSession.getId())) { // 자기 자신에게 보낸 메시지는 제외
                    sendMessage(session, messageDTO);
                }
            }
        }
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
