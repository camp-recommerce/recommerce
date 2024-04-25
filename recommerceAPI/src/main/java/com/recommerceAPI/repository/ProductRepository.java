package com.recommerceAPI.repository;

import java.util.Optional;

import com.recommerceAPI.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface ProductRepository extends JpaRepository<Product, Long>{

    @EntityGraph(attributePaths = "imageList")
    @Query("select p from Product p where p.pno = :pno")
    Optional<Product> selectOne(@Param("pno") Long pno);

    @Modifying
    @Query("update Product p set p.delFlag = :flag where p.pno = :pno")
    void updateToDelete(@Param("pno") Long pno, @Param("flag") boolean flag);

    //   이미지가 포함된 목록 처리
    @Query("select p, pi from Product p left join p.imageList pi where " +
           "(:pname is null or p.pname like %:pname%) and " +
           "(:pcategory is null or p.pcategory like %:pcategory%) and " +
           "(:addressLine is null or p.addressLine like %:addressLine%) and " +
           "p.delFlag = false")
    Page<Object[]> selectList(@Param("pname") String pname, @Param("pcategory") String pcategory,
                              @Param("addressLine") String addressLine, Pageable pageable);


    // 사용자 이메일과 판매 상태에 따른 제품 목록 조회 0425임형욱
    @Query("select p from Product p where p.userEmail = :userEmail and p.soldOut = :soldOut and p.delFlag = false")
    Page<Product> findByUserEmailAndSoldOutAndNotDeleted(
            @Param("userEmail") String userEmail,
            @Param("soldOut") boolean soldOut,
            Pageable pageable
    );

    Product findByPname(String pname);
}