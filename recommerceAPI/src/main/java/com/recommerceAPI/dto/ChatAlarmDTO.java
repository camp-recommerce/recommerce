package com.recommerceAPI.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatAlarmDTO {

    private Long id;
    // 알람 받는사람
    private String userEmail;
  

    private String roomId;
    private String message;
    // 알람 보내는사람
    private String senderEmail;
    private boolean readCheck;

    private String createdAt;

    // 생성자, 빌더, 메서드 등 필요한 내용 추가 가능
}
