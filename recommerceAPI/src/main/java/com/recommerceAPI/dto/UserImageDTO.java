package com.recommerceAPI.dto;

import lombok.Data;

/**
 * UserImageDTO 클래스는 사용자의 프로필 이미지를 전송하는데 사용되는 데이터 전송 객체(Data Transfer Object)입니다.
 * @Data 애너테이션은 Lombok 라이브러리를 사용하여, 이 클래스에 대한 getter, setter,
 * toString(), equals(), hashCode() 메서드를 자동으로 생성합니다.
 * 이를 통해 코드의 반복을 줄이고, 간결성을 유지할 수 있습니다.
 */
@Data
public class UserImageDTO {

    // 사용자의 이메일 주소를 식별자로 사용하여 해당 사용자의 프로필 이미지를 저장합니다.
    private String userEmail;

    // 프로필 이미지의 파일 경로를 저장합니다.
    private String imagePath;

    // 프로필 이미지의 파일 이름을 저장합니다.
    private String imageName;

    // 프로필 이미지의 파일 확장자를 저장합니다.
    private String imageExtension;

    // 프로필 이미지의 파일 크기를 저장합니다.
    private long imageSize;

}
