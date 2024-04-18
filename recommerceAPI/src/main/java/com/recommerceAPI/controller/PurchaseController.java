package com.recommerceAPI.controller;

import com.recommerceAPI.dto.PurchaseItemListDTO;
import com.recommerceAPI.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/purchase")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;

    // 사용자의 이메일을 기반으로 구매 아이템 목록을 조회합니다.
    @GetMapping("/items/{email}")
    public ResponseEntity<List<PurchaseItemListDTO>> getPurchaseItems(@RequestParam String email) {
        List<PurchaseItemListDTO> purchaseItems = purchaseService.getPurchaseItems(email);
        return ResponseEntity.ok(purchaseItems);
    }

    // 주어진 구매 아이템 번호에 해당하는 아이템을 삭제하고 남은 구매 아이템 목록을 반환합니다.
    @DeleteMapping("/{puino}")
    public ResponseEntity<List<PurchaseItemListDTO>> removePurchaseItem(@PathVariable Long puino) {
        List<PurchaseItemListDTO> remainingItems = purchaseService.remove(puino);
        return ResponseEntity.ok(remainingItems);
    }
}
