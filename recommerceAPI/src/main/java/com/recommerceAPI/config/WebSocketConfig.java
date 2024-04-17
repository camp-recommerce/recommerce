package com.recommerceAPI.config;

import com.recommerceAPI.service.AuctionBiddingService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {
    private final AuctionBiddingService auctionBiddingService;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // ChatHandler 인스턴스 생성, 핸들러가 서비스 기능 사용중이므로 여기서도 추가
        ChatHandler chatHandler = new ChatHandler(auctionBiddingService);

        // WebSocket 핸들러 등록
        registry.addHandler(chatHandler, "/api/chat")
                .setAllowedOrigins("http://localhost:3000");
    }
}
