package com.recommerceAPI.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long upno;

    private String email; // 사용자 이메일 추가
    private String topPurchaseCategory;
    private String topSaleCategory;
    private Double averagePrice;
    private String topSellingLocation;
}