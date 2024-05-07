package com.recommerceAPI.repository;

import com.recommerceAPI.domain.PurchaseItem;
import com.recommerceAPI.dto.PurchaseItemListDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PurchaseItemRepository extends JpaRepository<PurchaseItem, Long> {

    // 사용자의 이메일을 기반으로 해당 사용자의 구매 목록을 조회하는 쿼리 메서드
    @Query("SELECT NEW com.recommerceAPI.dto.PurchaseItemListDTO(pi.puino, pi.product.pno, pi.product.pname, pi.product.price, pi.fileName) " +
            "FROM PurchaseItem pi " +
            "WHERE pi.purchase.buyer.email = :email")
    List<PurchaseItemListDTO> getItemsOfPurchaseListDTOByEmail(@Param("email") String email);
}
