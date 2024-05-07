package com.recommerceAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private Long upno;
    private String email;  // 사용자 이메일 추가
    private String topPurchaseCategory;
    private String topSaleCategory;
    private Double averagePrice;
    private String topSellingLocation;
}