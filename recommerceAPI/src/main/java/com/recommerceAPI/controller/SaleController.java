package com.recommerceAPI.controller;

import com.recommerceAPI.dto.SaleItemListDTO;
import com.recommerceAPI.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    // 사용자의 이메일을 기반으로 해당 사용자의 판매 목록을 조회하는 엔드포인트
    @GetMapping("/{email}")
    public ResponseEntity<List<SaleItemListDTO>> getSaleItems(@PathVariable String email) {
        List<SaleItemListDTO> saleItems = saleService.getSaleItems(email);
        return ResponseEntity.ok(saleItems);
    }

    // 판매 아이템을 삭제하는 엔드포인트
    @DeleteMapping("/{sino}")
    public ResponseEntity<List<SaleItemListDTO>> removeSaleItem(@PathVariable Long sino) {
        List<SaleItemListDTO> remainingSaleItems = saleService.remove(sino);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(remainingSaleItems);
    }
}
