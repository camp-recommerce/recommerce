package com.recommerceAPI.controller;

import com.recommerceAPI.dto.SaleListDTO;
import com.recommerceAPI.dto.SaleListItemDTO;
import com.recommerceAPI.service.SaleListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 판매 목록과 판매 아이템을 관리하는 REST 컨트롤러입니다.
 */
@RestController
@RequestMapping("/api/sales")
public class SaleListController {

    @Autowired
    private SaleListService saleListService;

    // 판매 목록을 조회합니다.
    @GetMapping("/saleLists/{sno}")
    public ResponseEntity<SaleListDTO> getSaleList(@PathVariable Long sno) {
        return ResponseEntity.ok(saleListService.getSaleList(sno));
    }

    // 판매 아이템을 조회합니다.
    @GetMapping("/saleItems/{sino}")
    public ResponseEntity<SaleListItemDTO> getSaleListItem(@PathVariable Long sino) {
        return ResponseEntity.ok(saleListService.getSaleListItem(sino));
    }

    // 특정 판매 목록의 모든 판매 아이템을 조회합니다.
    @GetMapping("/saleLists/{sno}/items")
    public ResponseEntity<List<SaleListItemDTO>> listSaleItemsInSale(@PathVariable Long sno) {
        return ResponseEntity.ok(saleListService.listSaleItemsInSale(sno));
    }

    // 새로운 판매 목록을 생성합니다.
    @PostMapping("/saleLists")
    public ResponseEntity<SaleListDTO> createSaleList(@RequestBody SaleListDTO saleListDTO) {
        return new ResponseEntity<>(saleListService.createSaleList(saleListDTO), HttpStatus.CREATED);
    }

    // 특정 판매 목록에 판매 아이템을 추가합니다.
    @PostMapping("/saleLists/{sno}/items")
    public ResponseEntity<SaleListItemDTO> addSaleItemToSaleList(@PathVariable Long sno, @RequestBody SaleListItemDTO saleListItemDTO) {
        return new ResponseEntity<>(saleListService.addSaleItemToSaleList(sno, saleListItemDTO), HttpStatus.CREATED);
    }

    // 판매 목록을 업데이트합니다.
    @PutMapping("/saleLists/{sno}")
    public ResponseEntity<SaleListDTO> updateSaleList(@RequestBody SaleListDTO saleListDTO, @PathVariable Long sno) {
        saleListDTO.setSno(sno);
        return ResponseEntity.ok(saleListService.updateSaleList(saleListDTO));
    }

    // 주어진 ID의 판매 목록을 삭제합니다.
    @DeleteMapping("/saleLists/{sno}")
    public ResponseEntity<Void> deleteSaleList(@PathVariable Long sno) {
        saleListService.deleteSaleList(sno);
        return ResponseEntity.ok().build();
    }

    // 주어진 ID의 판매 아이템을 판매 목록에서 제거합니다.
    @DeleteMapping("/saleItems/{sino}")
    public ResponseEntity<Void> removeSaleItemFromSaleList(@PathVariable Long sino) {
        saleListService.removeSaleItemFromSaleList(sino);
        return ResponseEntity.ok().build();
    }
}
