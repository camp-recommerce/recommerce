package com.recommerceAPI.dto;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleListDTO {
    private Long sno; // 판매 목록의 고유 ID
    private Long sellerSno; // 판매자의 ID

}