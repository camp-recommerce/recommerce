package com.recommerceAPI.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString(exclude = "buyer")
@Table(
        name = "tbl_purchase",
        indexes = {@Index(name="idx_purchase_email", columnList = "member_buyer")}
)
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long puno;

    @ManyToOne
    @JoinColumn(name="member_buyer")
    private User buyer;



    // 구매 관련 필드들 추가
}
