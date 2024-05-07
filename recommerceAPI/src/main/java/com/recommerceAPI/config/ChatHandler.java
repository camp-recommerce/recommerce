package com.recommerceAPI.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recommerceAPI.domain.Auction;
import com.recommerceAPI.domain.AuctionBidding;
import com.recommerceAPI.dto.AuctionBiddingDTO;
import com.recommerceAPI.dto.ChatMessageDTO;
import com.recommerceAPI.repository.AuctionBiddingRepository;
import com.recommerceAPI.service.AuctionBiddingService;
import com.recommerceAPI.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.net.URI;
import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@Log4j2
@Component
@RequiredArgsConstructor
public class ChatHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final  Set<WebSocketSession> sessions = new HashSet<>();

    private final Map<String, List<WebSocketSession>> sessionToUsername = new HashMap<>();
    private final AuctionBiddingService auctionBiddingService;

    private final ChatMessageService chatMessageService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {

        sessions.add(session);
        log.info("{} connect", session.getId());
        URI uri = session.getUri();
        String room = extractRoomFromUri(uri);

        if (isNumeric(room)) {
            // 숫자 형식이라면 아래옥션바이딩 서비스를 호출
            auctionBiddingService.sendPreviousBidHistory(Long.valueOf(room), session);
        } else {
            // 이메일 형식이라면 채팅 메시지 서비스를 호출
            chatMessageService.sendPreviousChatHistory(room, session);
        }

        List<WebSocketSession> sessionList = sessionToUsername.getOrDefault(room, new ArrayList<>());
        sessionList.add(session);
        sessionToUsername.put(room, sessionList);

        String author = "알림";
        String message = "유저 입장";
        String time = " ";
        ChatMessageDTO notificationDTO = new ChatMessageDTO(room, author, message, ChatMessageDTO.MessageType.NOTIFICATION, time);
        sendMessageToRoom(room, notificationDTO, session);


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
    private boolean isNumeric(String str) {
        return str != null && str.matches("\\d+");
    }


    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        log.info("Received message: {}", payload);
        // payload 값에 같이온값을 맵퍼 돌린다.
        ChatMessageDTO chatMessageDTO = objectMapper.readValue(payload, ChatMessageDTO.class);
        log.info("Received chat message: {}", chatMessageDTO);
        String room = chatMessageDTO.getRoom();
        if (chatMessageDTO.getMessageType() == null) {
            log.error("Message type is null: {}", payload);
            return;
        }
        if (chatMessageDTO.getMessageType() == ChatMessageDTO.MessageType.BID) {
            // BID 메시지 처리: 입찰 객체 등록 등 필요한 작업 수행
            // 여기선 타입이 경매 이기 때문에 해당 채팅을 입찰 내역으로 저장중
            auctionBiddingService.saveAuctionBidding(chatMessageDTO);
        }
        if(chatMessageDTO.getMessageType()== ChatMessageDTO.MessageType.MESSAGE){
            chatMessageService.saveChat(chatMessageDTO);
        } // 같은 Room 에 채팅을 전송
        sendMessageToRoom(room, chatMessageDTO, session);
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

        // 세션투유저네임 맵에 반복돌림
        Iterator<Map.Entry<String, List<WebSocketSession>>> iterator = sessionToUsername.entrySet().iterator();
        // 한줄씩 모든 내용 찾기.
        while (iterator.hasNext()) {
            // 내용을 저장
            Map.Entry<String, List<WebSocketSession>> entry = iterator.next();
            // 현재 방에 연결된 세션 리스트를 가져옵니다
            List<WebSocketSession> sessionsInRoom = entry.getValue();
            // 현재 세션을 세션 리스트에서 제거합니다.
            sessionsInRoom.remove(session);
            // 세션 리스트가 비어 있다면 해당 방의 엔트리를 맵에서 제거합니다.
            if (sessionsInRoom.isEmpty()) {
                iterator.remove();
            }
            log.info("{} disconnect", sessionToUsername);
        }
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
