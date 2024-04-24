package com.recommerceAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatAlarmListDTO {

    private Long id;
    // 알람 받는사람
    private String userEmail;
    private String roomId;
    private String message;
    // 알람 보내는사람
    private String senderEmail;
    private boolean readCheck;
    private String createdAt;

}
