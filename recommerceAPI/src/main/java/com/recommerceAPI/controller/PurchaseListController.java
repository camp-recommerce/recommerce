package com.recommerceAPI.controller;

import com.recommerceAPI.dto.PurchaseListDTO;
import com.recommerceAPI.dto.PurchaseListItemDTO;
import com.recommerceAPI.service.PurchaseListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase")
@RequiredArgsConstructor
public class PurchaseListController {

    private final PurchaseListService purchaseListService;

    // 새로운 구매 목록 생성
    @PostMapping("/lists")
    public ResponseEntity<PurchaseListDTO> createPurchaseList(@RequestBody PurchaseListDTO purchaseListDTO) {
        PurchaseListDTO created = purchaseListService.createPurchaseList(purchaseListDTO);
        return ResponseEntity.ok(created);
    }

    // 기존 구매 목록 업데이트
    @PutMapping("/lists/{puno}")
    public ResponseEntity<PurchaseListDTO> updatePurchaseList(@PathVariable Long puno, @RequestBody PurchaseListDTO purchaseListDTO) {
        purchaseListDTO.setPuno(puno);
        PurchaseListDTO updated = purchaseListService.updatePurchaseList(purchaseListDTO);
        return ResponseEntity.ok(updated);
    }

    // 구매 목록 삭제
    @DeleteMapping("/lists/{puno}")
    public ResponseEntity<Void> deletePurchaseList(@PathVariable Long puno) {
        purchaseListService.deletePurchaseList(puno);
        return ResponseEntity.ok().build();
    }

    // ID로 구매 목록 조회
    @GetMapping("/lists/{puno}")
    public ResponseEntity<PurchaseListDTO> getPurchaseListByPuno(@PathVariable Long puno) {
        PurchaseListDTO purchaseList = purchaseListService.findPurchaseListByPuno(puno);
        return ResponseEntity.ok(purchaseList);
    }

    // 사용자 이메일로 모든 구매 목록 조회
    @GetMapping("/lists/user/{email}")
    public ResponseEntity<List<PurchaseListDTO>> getPurchaseListsByUserEmail(@PathVariable String email) {
        List<PurchaseListDTO> purchaseLists = purchaseListService.findPurchaseListsByUserEmail(email);
        return ResponseEntity.ok(purchaseLists);
    }

    // 구매 목록 아이템 생성
    @PostMapping("/items")
    public ResponseEntity<PurchaseListItemDTO> createPurchaseListItem(@RequestBody PurchaseListItemDTO purchaseListItemDTO) {
        PurchaseListItemDTO createdItem = purchaseListService.createPurchaseListItem(purchaseListItemDTO);
        return ResponseEntity.ok(createdItem);
    }

    // 구매 목록 아이템 업데이트
    @PutMapping("/items/{puino}")
    public ResponseEntity<PurchaseListItemDTO> updatePurchaseListItem(@PathVariable Long puino, @RequestBody PurchaseListItemDTO purchaseListItemDTO) {
        purchaseListItemDTO.setPuino(puino);
        PurchaseListItemDTO updatedItem = purchaseListService.updatePurchaseListItem(purchaseListItemDTO);
        return ResponseEntity.ok(updatedItem);
    }

    // 구매 목록 아이템 삭제
    @DeleteMapping("/items/{puino}")
    public ResponseEntity<Void> deletePurchaseListItem(@PathVariable Long puino) {
        purchaseListService.deletePurchaseListItem(puino);
        return ResponseEntity.ok().build();
    }

    // 특정 구매 목록 ID에 속하는 모든 아이템 조회
    @GetMapping("/items/list/{purchaseListPuino}")
    public ResponseEntity<List<PurchaseListItemDTO>> getAllItemsByPurchaseListPuno(@PathVariable Long purchaseListPuno) {
        List<PurchaseListItemDTO> items = purchaseListService.findAllItemsByPurchaseListPuino(purchaseListPuno);
        return ResponseEntity.ok(items);
    }
}
