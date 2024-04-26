package com.recommerceAPI.dto;

import lombok.Data;

@Data
public class UserProfileDTO {
    private Long upno; // UserProfile의 고유 ID
    private String email; // 사용자 이메일
    private String topPurchaseCategory;
    private String topSaleCategory;
    private Double averagePrice;
    private String topSellingLocation;

    public UserProfileDTO(Long upno, String email, String topPurchaseCategory, String topSaleCategory, Double averagePrice, String topSellingLocation) {
        this.upno = upno;
        this.email = email;
        this.topPurchaseCategory = topPurchaseCategory;
        this.topSaleCategory = topSaleCategory;
        this.averagePrice = averagePrice;
        this.topSellingLocation = topSellingLocation;
    }

    // Getter와 Setter는 Lombok의 @Data 어노테이션에 의해 자동 생성됩니다.
}
