package com.recommerceAPI.domain;

import jakarta.persistence.*;
import lombok.*;

@Builder
@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ChatAlarm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_email")
    //수신인
    private User user;

    private String roomId;
    private String message;
    //발신인
    private String senderEmail;
    @Builder.Default
    private boolean readCheck = false;

    private String createdAt; // LocalDateTime 대신 String으로 변경

    // 생성자, 빌더, 메서드 등 필요한 내용 추가 가능
}
