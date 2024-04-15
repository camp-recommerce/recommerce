package com.recommerceAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleListItemDTO {
    private Long sino; // 판매 아이템의 고유 ID
    private Long saleListSino; // 이 아이템이 속한 판매 목록의 ID
    private Long productPno; // 판매된 상품의 ID
    private LocalDateTime saleDate; // 판매 날짜
}