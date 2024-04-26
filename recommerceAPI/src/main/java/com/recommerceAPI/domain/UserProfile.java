package com.recommerceAPI.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity // 이 클래스가 JPA 엔티티임을 나타냄. 클래스의 인스턴스는 데이터베이스 테이블에 매핑됨.
@Builder // Lombok의 Builder 패턴 자동 생성. 객체 생성 시 빌더 패턴을 사용할 수 있게 함.
@AllArgsConstructor // 모든 필드 값을 인자로 받는 생성자를 자동 생성.
@NoArgsConstructor // 기본 생성자를 자동 생성.
@Getter // 모든 필드에 대한 getter 메서드를 자동 생성.
@ToString(exclude = "profileUser") // 객체를 문자열로 표현하는 toString() 메서드 자동 생성. owner 필드는 제외.
@Table(
        name = "tbl_profile", // 이 엔티티가 매핑될 데이터베이스 테이블의 이름을 지정.
        indexes = {@Index(name="idx_profile_email", columnList = "member_profileUser")} // member_owner 칼럼에 대한 인덱스 생성.
)
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long upno;

    @OneToOne
    @JoinColumn(name = "member_profileUser")
    private User profileUser;

    private String topPurchaseCategory;
    private String topSaleCategory;
    private Double averagePrice;
    private String topSellingLocation;
}