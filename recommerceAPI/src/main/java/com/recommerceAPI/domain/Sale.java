package com.recommerceAPI.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString(exclude = "seller")
@Table(
        name = "tbl_sale",
        indexes = {@Index(name="idx_sale_email", columnList = "member_seller")}
)
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sno;

    @ManyToOne
    @JoinColumn(name="member_seller")
    private User seller;

    // 판매 관련 필드들 추가
}
