package com.recommerceAPI.controller;

import com.recommerceAPI.dto.SaleItemDTO;
import com.recommerceAPI.dto.SaleItemListDTO;
import com.recommerceAPI.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 판매 아이템을 관리하는 REST 컨트롤러입니다.
 * 이 클래스는 판매 아이템의 조회, 생성, 삭제를 위한 API 엔드포인트를 제공합니다.
 */
@RestController
@RequestMapping("/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    /**
     * 주어진 사용자의 이메일을 기반으로 해당 사용자의 판매 아이템 목록을 조회합니다.
     * @param email 사용자의 이메일 주소
     * @return 판매 아이템 목록을 포함하는 ResponseEntity 객체
     */
    @GetMapping("/items/{email}")
    public ResponseEntity<List<SaleItemListDTO>> getSaleItems(@PathVariable String email) {
        List<SaleItemListDTO> saleItems = saleService.getSaleItems(email);
        return ResponseEntity.ok(saleItems);
    }

    /**
     * 주어진 판매 아이템 ID로 아이템을 삭제하고, 관련된 사용자의 업데이트된 판매 아이템 목록을 반환합니다.
     * @param sino 삭제할 판매 아이템의 ID
     * @return 상태 코드 204(NO CONTENT)와 함께 남은 판매 아이템 목록을 반환하는 ResponseEntity 객체
     */
    @DeleteMapping("/{sino}")
    public ResponseEntity<List<SaleItemListDTO>> removeSaleItem(@PathVariable Long sino) {
        List<SaleItemListDTO> remainingSaleItems = saleService.remove(sino);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(remainingSaleItems);
    }

    /**
     * 새로운 판매 아이템을 생성하고, 생성된 판매 아이템 정보를 반환합니다.
     * @param saleItemDTO 생성할 판매 아이템의 DTO 정보
     * @return 생성된 판매 아이템 정보를 포함하는 ResponseEntity 객체
     */
    @PostMapping("/item")
    public ResponseEntity<SaleItemDTO> createSaleItem(@RequestBody SaleItemDTO saleItemDTO) {
        SaleItemDTO createdSaleItem = saleService.createSaleItem(saleItemDTO);
        return ResponseEntity.ok(createdSaleItem);
    }
}
