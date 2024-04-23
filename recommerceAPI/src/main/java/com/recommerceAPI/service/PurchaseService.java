package com.recommerceAPI.service;

import com.recommerceAPI.dto.PurchaseItemListDTO;

import java.util.List;

public interface PurchaseService {


    // 모든 구매 아이템 목록 조회
    List<PurchaseItemListDTO> getPurchaseItems(String Email);

    // 구매 아이템 삭제
    List<PurchaseItemListDTO> remove(Long puino);


}
