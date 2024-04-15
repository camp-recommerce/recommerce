package com.recommerceAPI.dto;

import lombok.Data;

/**
 * UserDTO 클래스는 사용자 관련 데이터를 전송하는데 사용되는 데이터 전송 객체(Data Transfer Object)입니다.
 * @Data 애너테이션은 Lombok 라이브러리를 사용하여, 이 클래스에 대한 getter, setter,
 * toString(), equals(), hashCode() 메서드를 자동으로 생성합니다.
 * 이를 통해 코드의 반복을 줄이고, 간결성을 유지할 수 있습니다.
 */
@Data
public class UserDTO {

    // 사용자의 이메일 주소를 저장합니다. 일반적으로 사용자를 식별하는 데 사용됩니다.
    private String email;

    // 사용자의 비밀번호를 저장합니다. 보안을 위해 저장되거나 전송될 때 적절히 암호화하는 것이 중요합니다.
    private String pw;

    // 사용자의 닉네임을 저장합니다. 사용자가 시스템 내에서 사용할 이름이나 별명입니다.
    private String nickname;

    // 사용자의 전화번호를 저장합니다. 연락처 정보로 사용될 수 있습니다.
    private String phone;

    // 사용자의 생년월일을 저장합니다. 개인 식별 정보나 연령 확인에 사용될 수 있습니다.
    private String birth;

    // 사용자의 평균 평점을 저장합니다. 사용자가 남긴 후기의 평균 평점을 나타냅니다.
    private double averageRating;

    // 비밀번호 변경이나 계정 삭제 시 현재 비밀번호를 검증하기 위한 필드.
    // 이 필드는 사용자가 비밀번호를 변경하거나 계정을 삭제할 때 입력한 현재 비밀번호를 저장하기 위해 사용됩니다.
    // 해당 작업에서만 사용되며, 데이터베이스에는 저장되지 않습니다.
    private String currentPassword;

    // 사용자의 계정 삭제 요청 시 사용됩니다.
    // 계정 삭제 로직에서만 사용되며, 데이터베이스에는 저장되지 않습니다.
    private String deletionPassword;
}
