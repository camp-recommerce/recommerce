package com.recommerceAPI.service;


import com.recommerceAPI.dto.PageRequestDTO;
import com.recommerceAPI.dto.ProductDTO;
import com.recommerceAPI.dto.ProductPageResponseDTO;
import org.springframework.transaction.annotation.Transactional;


@Transactional
public interface ProductService {


    //list
    ProductPageResponseDTO<ProductDTO> getList(PageRequestDTO pageRequestDTO, String pname, String pcategory, String addressLine);
    //create
    Long register(ProductDTO productDTO);
    ProductDTO get(Long pno);
    void modify(ProductDTO productDTO);
    void remove(Long pno);

    // 사용자 이메일과 판매 상태 기반의 제품 목록 조회
    //0425 임형욱
    ProductPageResponseDTO<ProductDTO> getProductsByUserAndStatus(PageRequestDTO pageRequestDTO, String userEmail, Boolean soldOut);
}
