package com.recommerceAPI.dto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDTO {
    public enum MessageType {
        ENTER, MESSAGE, NOTIFICATION,BID
    }

    private String room;
    private String message;
    private MessageType messageType;
    private String author; // 새로운 필드 추가
    private String time; // 시간 필드 추가


    public ChatMessageDTO(String room, String author, String message, MessageType messageType, String time) {
        this.room = room;
        this.author = author;
        this.message = message;
        this.messageType = messageType;
        this.time=time;
    }


}