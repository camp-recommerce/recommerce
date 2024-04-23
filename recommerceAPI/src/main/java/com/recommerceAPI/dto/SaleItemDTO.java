package com.recommerceAPI.dto;


import lombok.Data;


@Data
public class SaleItemDTO {
    private Long sino;
    // 판매 아이템 번호

    private String Email;
    // 사용자의 이메일 주소. 판매 아이템을 사용자 계정에 연결하는 데 사용됩니다.

    private Long pno;
    // 상품 번호. 이 필드는 판매할 특정 상품을 식별합니다.

    private String pcategory; // 상품 카테고리 필드 추가

    private int price; // 상품 가격 필드 추가

    private String addressLine; // 제품판매장소 동 정보 필드 추가
}
