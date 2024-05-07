package com.recommerceAPI.repository;

import com.recommerceAPI.domain.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Long> {

    // 사용자의 이메일을 기반으로 해당 사용자의 판매 목록을 조회하는 쿼리 메서드
    @Query("SELECT s FROM Sale s WHERE s.seller.email = :email")
    List<Sale> findByEmail(@Param("email") String email);

}
