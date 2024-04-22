package com.recommerceAPI.domain;

import jakarta.persistence.*;
import lombok.*;

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
    private User user;

    private Long roomId;
    private boolean read;
    private String createdAt; // LocalDateTime 대신 String으로 변경

    // 생성자, 빌더, 메서드 등 필요한 내용 추가 가능
}
