package com.recommerceAPI.service;

import com.recommerceAPI.dto.SaleItemDTO;
import com.recommerceAPI.dto.SaleItemListDTO;

import java.util.List;

public interface SaleService {

    // 모든 판매 아이템 목록 조회
    List<SaleItemListDTO> getSaleItems(String email);

    // 판매 아이템 생성
    SaleItemDTO createSaleItem(SaleItemDTO saleItemDTO);

    // 판매 아이템 삭제
    List<SaleItemListDTO> remove(Long sino);
}
