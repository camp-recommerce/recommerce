package com.recommerceAPI.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    private String email;

    @OneToOne
    @MapsId
    @JoinColumn(name = "email")
    private User user; // 연결된 사용자 엔티티

    private String topPurchaseCategory;
    private String topSaleCategory;
    private Double averagePrice;
    private String topSellingLocation;
}
