package com.recommerceAPI.service;

import com.recommerceAPI.dto.SaleListDTO;
import com.recommerceAPI.dto.SaleListItemDTO;

import java.util.List;

/**
 * 판매 목록과 판매 아이템에 대한 서비스 인터페이스를 제공합니다.
 * 이 인터페이스는 판매 목록과 관련된 아이템의 데이터를 조회, 생성, 수정, 삭제 작업을 정의합니다.
 */
public interface SaleListService {
    SaleListDTO getSaleList(Long sno); // 주어진 판매 목록 ID에 해당하는 판매 목록을 조회합니다.

    SaleListItemDTO getSaleListItem(Long sino); // 주어진 판매 아이템 ID에 해당하는 판매 아이템을 조회합니다.

    List<SaleListItemDTO> listSaleItemsInSale(Long sno); // 특정 판매 목록에 속하는 모든 판매 아이템을 조회합니다.

    SaleListDTO createSaleList(SaleListDTO saleListDTO); // 새로운 판매 목록을 생성합니다.

    SaleListItemDTO addSaleItemToSaleList(Long sno, SaleListItemDTO saleListItemDTO); // 특정 판매 목록에 새로운 판매 아이템을 추가합니다.

    SaleListDTO updateSaleList(SaleListDTO saleListDTO); // 판매 목록 정보를 업데이트합니다.

    void deleteSaleList(Long sno); // 주어진 판매 목록 ID에 해당하는 판매 목록을 삭제합니다.

    void removeSaleItemFromSaleList(Long sino); // 주어진 판매 아이템 ID에 해당하는 아이템을 판매 목록에서 제거합니다.
}
