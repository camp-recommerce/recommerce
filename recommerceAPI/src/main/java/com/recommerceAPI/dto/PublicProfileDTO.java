package com.recommerceAPI.dto;


import lombok.Data;

@Data
public class PublicProfileDTO {

    // 사용자의 이메일 주소
    private String email;

    // 사용자의 닉네임
    private String nickname;

    // 사용자의 전화번호
    private String phone;

    // 사용자의 생년월일
    private String birth;

    // 사용자의 평균 평점
    private double averageRating;

    // 사용자의 주소
    private String address;

    // 사용자의 우편번호
    private String postcode;

    // 사용자의 상세 주소
    private String addressDetail;

}

