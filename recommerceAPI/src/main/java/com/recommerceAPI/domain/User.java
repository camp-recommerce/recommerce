package com.recommerceAPI.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity // 이 클래스를 JPA 엔티티로 선언
@Setter // Lombok을 사용하여 모든 필드에 대한 setter 메서드 자동 생성
@Getter // Lombok을 사용하여 모든 필드에 대한 getter 메서드 자동 생성
@Builder // Lombok의 빌더 패턴을 사용하여 객체 생성을 쉽게 만듦
@AllArgsConstructor // 모든 필드 값을 매개변수로 받는 생성자를 자동으로 생성
@NoArgsConstructor // 매개변수가 없는 기본 생성자를 자동으로 생성
@ToString(exclude = {"userRoleList"}) // toString 메서드 자동 생성. userRoleList는 제외
public class User {

    @Id // 기본 키를 나타냄. 여기서는 email이 기본 키임
    private String email;

    private String pw; // 사용자 비밀번호
    private String nickname; // 사용자 닉네임
    private String phone; // 사용자 전화번호
    private String birth; // 사용자 생년월일
    private double averageRating; // 사용자의 평균 평점
    private String postcode; //우편번호
    private String address; // 사용자 주소
    private String addressDetail; // 추가된 상세 주소 필드

    @ElementCollection(fetch = FetchType.LAZY) // userRoleList를 별도의 컬렉션으로 관리하며 지연 로딩을 사용
    @Builder.Default // Lombok 빌더의 기본값으로, userRoleList를 비어 있는 ArrayList로 초기화
    private List<UserRole> userRoleList = new ArrayList<>();

    // 사용자에게 새 역할을 추가하는 메서드
    public void addRole(UserRole userRole) {
        userRoleList.add(userRole);
    }

    // 사용자의 비밀번호를 변경하는 메서드
    public void changePassword(String newPassword) {
        this.pw = newPassword;
    }

    // 새 비밀번호와 확인 비밀번호가 일치하는지 검사하는 메서드
    public boolean confirmNewPassword(String newPassword, String confirmPassword) {
        return newPassword.equals(confirmPassword);
    }


    // 사용자의 닉네임을 변경하는 메서드
    public void changeNickname(String nickname) {
        this.nickname = nickname;
    }

    // 사용자의 전화번호를 변경하는 메서드
    public void changePhone(String phone) {
        this.phone = phone;
    }

    // 사용자의 생년월일을 변경하는 메서드
    public void changeBirth(String birth) {
        this.birth = birth;
    }

    // 사용자의 평균 평점을 업데이트하는 메서드
    public void updateRating(double newRating) {
        this.averageRating = newRating;
    }

}
