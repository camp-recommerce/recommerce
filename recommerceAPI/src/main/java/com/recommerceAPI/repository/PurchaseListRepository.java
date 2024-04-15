package com.recommerceAPI.repository;

import com.recommerceAPI.domain.PurchaseList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseListRepository extends JpaRepository<PurchaseList, Long> {

    // 사용자의 이메일을 기반으로 모든 구매 목록을 조회하는 쿼리 메서드
    @Query("select pl from PurchaseList pl where pl.user.email = :email")
    List<PurchaseList> findAllByUserEmail(@Param("email") String email);

    // 사용자의 이메일과 상품 번호를 기반으로 해당 상품을 포함한 구매 목록을 조회하는 쿼리 메서드
    @Query("select pl from PurchaseList pl join pl.items items where pl.user.email = :email and items.product.pno = :pno")
    List<PurchaseList> findByUserEmailAndProductPno(@Param("email") String email, @Param("pno") Long pno);

    // 구매 목록 ID를 사용하여 구매 목록을 삭제
    void deleteByPuno(Long puno);
}
