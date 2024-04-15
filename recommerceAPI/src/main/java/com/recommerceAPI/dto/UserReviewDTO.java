package com.recommerceAPI.dto;

import lombok.Data;

/**
 * 사용자 후기 데이터 전송 객체 (DTO).
 * 사용자 후기 정보를 서비스 또는 컨트롤러 계층간 전달할 때 사용합니다.
 */
@Data // Lombok 라이브러리의 @Data 어노테이션을 사용하여 getter, setter, toString, equals, hashCode 메서드 자동 생성
public class UserReviewDTO {

    private Long reviewId; // 후기의 고유 식별자
    private String content; // 후기 내용
    private double rating; // 후기 평점
    private String userEmail; // 후기를 남긴 사용자의 이메일


}
