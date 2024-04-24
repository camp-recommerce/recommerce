package com.recommerceAPI.repository;

import com.recommerceAPI.domain.SaleItem;
import com.recommerceAPI.dto.SaleItemListDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SaleItemRepository extends JpaRepository<SaleItem, Long> {

//     사용자의 이메일을 기반으로 해당 사용자의 판매 목록을 조회하는 쿼리 메서드
    @Query("SELECT NEW com.recommerceAPI.dto.SaleItemListDTO(si.sino, si.product.pno, si.product.pname, si.product.price, si.fileName) " +
            "FROM SaleItem si " +
            "WHERE si.sale.seller.email = :email")
    List<SaleItemListDTO> getItemsOfSaleListDTOByEmail(@Param("email") String email);
}

