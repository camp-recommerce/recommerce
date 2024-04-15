package com.recommerceAPI.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // ChatHandler 인스턴스 생성
        ChatHandler chatHandler = new ChatHandler();

        // WebSocket 핸들러 등록
        registry.addHandler(chatHandler, "/api/chat")
                .setAllowedOrigins("http://localhost:3000");
    }
}
