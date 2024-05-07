package com.recommerceAPI.config;

import com.recommerceAPI.dto.AuctionBiddingDTO;
import com.recommerceAPI.repository.AuctionBiddingRepository;
import com.recommerceAPI.service.AuctionBiddingService;
import com.recommerceAPI.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final AuctionBiddingService auctionBiddingService;
    private final ChatMessageService chatMessageService;
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // ChatHandler 인스턴스 생성
        ChatHandler chatHandler = new ChatHandler(auctionBiddingService,chatMessageService);
        // WebSocket 핸들러 등록
        registry.addHandler(chatHandler, "/api/chat")
                .setAllowedOrigins("http://localhost:3000");
    }
}
