package com.recommerceAPI.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ChatAlarmDTO {

    private Long id;
    private String userEmail;
    private Long roomId;
    private boolean read;
    private String createdAt;

    // 생성자, 빌더, 메서드 등 필요한 내용 추가 가능
}
