package com.recommerceAPI.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
public class SaleItemListDTO {

    private Long sino; // 판매 아이템 고유 번호
    private Long pno; // 상품 번호
    private String pname; // 상품 이름
    private int price; // 상품 가격
    private String imageFile; // 상품 이미지 파일 경로 또는 URL

    // 모든 필드를 초기화하는 생성자
    public SaleItemListDTO(Long sino, Long pno, String pname, int price, String imageFile) {
        this.sino = sino; // 판매 아이템 고유 번호 초기화
        this.pno = pno; // 상품 번호 초기화
        this.pname = pname; // 상품 이름 초기화
        this.price = price; // 상품 가격 초기화
        this.imageFile = imageFile; // 상품 이미지 파일 경로 또는 URL 초기화
    }

}
