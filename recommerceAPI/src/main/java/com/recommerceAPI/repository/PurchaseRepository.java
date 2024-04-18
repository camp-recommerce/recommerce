package com.recommerceAPI.repository;

import com.recommerceAPI.domain.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    // 사용자의 이메일을 기반으로 해당 사용자의 구매 목록을 조회하는 쿼리 메서드
    @Query("SELECT p FROM Purchase p WHERE p.buyer.email = :email")
    List<Purchase> findByEmail(@Param("email") String email);



}
