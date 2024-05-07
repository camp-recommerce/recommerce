package com.recommerceAPI.service;

import com.recommerceAPI.dto.PageRequestDTO;
import com.recommerceAPI.dto.PageResponseDTO;
import com.recommerceAPI.dto.ProductDTO;
import com.recommerceAPI.dto.ProductPageResponseDTO;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface ProductService {

    // 제품 목록 조회 (검색 필터 포함)
    ProductPageResponseDTO<ProductDTO> getList(PageRequestDTO pageRequestDTO, String pname, String pcategory, String addressLine);

    // 제품 등록
    Long register(ProductDTO productDTO);

    // 제품 상세 조회
    ProductDTO get(Long pno);

    // 제품 정보 수정
    void modify(ProductDTO productDTO);

    // 제품 삭제
    void remove(Long pno);

    //내 유저 상품
    PageResponseDTO<ProductDTO> getProductsByUserAndStatus(PageRequestDTO pageRequestDTO, String userEmail);
    // 판매 완료 버튼 누를떄
    void soldOut(Long pno);
}
