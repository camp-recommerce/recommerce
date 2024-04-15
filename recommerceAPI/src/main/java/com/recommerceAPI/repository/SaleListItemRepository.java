package com.recommerceAPI.repository;

import com.recommerceAPI.domain.SaleListItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleListItemRepository extends JpaRepository<SaleListItem, Long> {

    // 특정 판매 목록 ID에 속하는 모든 판매 목록 아이템을 조회하는 메서드
    @Query("select sli from SaleListItem sli where sli.saleList.sno = :saleListSno")
    List<SaleListItem> findBySaleListSno(@Param("saleListSno") Long saleListSno);

    // 특정 상품 번호(pno)를 포함하는 판매 목록 아이템을 조회하는 메서드
    @Query("select sli from SaleListItem sli where sli.product.pno = :productPno")
    List<SaleListItem> findByProductPno(@Param("productPno") Long productPno);
}
