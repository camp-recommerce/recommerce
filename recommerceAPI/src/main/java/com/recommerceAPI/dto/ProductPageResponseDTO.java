package com.recommerceAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data // Lombok 애노테이션: Getter, Setter, Equals, HashCode 및 ToString을 자동으로 생성
@AllArgsConstructor // 모든 필드를 인자로 받는 생성자 생성
@NoArgsConstructor // 디폴트 생성자 생성
public class ProductPageResponseDTO<T> {
    // 제네릭 타입을 사용하여 다양한 유형의 데이터를 저장할 수 있는 리스트
    private List<T> data;

    // 현재 페이지 번호
    private int currentPage;

    // 전체 페이지 수
    private int totalPages;

    // 전체 항목 수
    private long totalItems;

    // 더 많은 항목이 있는지 여부
    private boolean hasMore;

    private String saleStatus; // 판매 상태를 나타내는 필드
}
