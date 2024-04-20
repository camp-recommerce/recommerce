package com.recommerceAPI.domain;

import com.recommerceAPI.dto.ChatMessageDTO;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String room;

    private String message;

    @Enumerated(EnumType.STRING)
    private ChatMessageDTO.MessageType messageType;

    private String author;

    private String time;

}
