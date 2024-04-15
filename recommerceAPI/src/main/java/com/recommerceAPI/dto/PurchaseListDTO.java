package com.recommerceAPI.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseListDTO {
    private Long puno; // 구매 목록 ID
    private String userEmail; // 구매 목록의 소유자 이메일
    private List<Long> productPno; // 구매 목록에 포함된 상품들의 ID 리스트
}
