package com.recommerceAPI.dto;

import lombok.Data;

@Data
public class PurchaseItemDTO {

    private String Email;
    // 사용자의 이메일 주소. 구매 아이템을 사용자 계정에 연결하는 데 사용됩니다.

    private Long pno;
    // 상품 번호. 이 필드는 구매할 특정 상품을 식별합니다.

    private Long puino;
    // 구매 아이템 번호. 구매 아이템을 식별하는 고유한 ID입니다.

    private String pcategory; // 상품 카테고리 필드 추가
}

