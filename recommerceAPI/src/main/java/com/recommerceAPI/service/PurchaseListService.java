package com.recommerceAPI.service;

import com.recommerceAPI.dto.PurchaseListDTO;
import com.recommerceAPI.dto.PurchaseListItemDTO;

import java.util.List;

public interface PurchaseListService {
    // 구매 목록 관련 메서드
    PurchaseListDTO createPurchaseList(PurchaseListDTO purchaseListDTO);
    PurchaseListDTO updatePurchaseList(PurchaseListDTO purchaseListDTO);
    void deletePurchaseList(Long puno);
    PurchaseListDTO findPurchaseListByPuno(Long puno);
    List<PurchaseListDTO> findPurchaseListsByUserEmail(String email);

    // 구매 목록 아이템 관련 메서드
    PurchaseListItemDTO createPurchaseListItem(PurchaseListItemDTO purchaseListItemDTO);
    PurchaseListItemDTO updatePurchaseListItem(PurchaseListItemDTO purchaseListItemDTO);
    void deletePurchaseListItem(Long puino);
    PurchaseListItemDTO findPurchaseListItemBy(Long puino);
    List<PurchaseListItemDTO> findAllItemsByPurchaseListPuino(Long purchaseListPuino);
}
