package com.recommerceAPI.repository;

import java.util.List;
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
            "p.delFlag = false and (" +
            "(:pname is null or p.pname like %:pname%) or " +
            "(:addressLine is null or p.addressLine like %:addressLine%)) and " +
            "(:pcategory is null or p.pcategory like %:pcategory%)")
    Page<Object[]> selectList(@Param("pname") String pname, @Param("pcategory") String pcategory,
                              @Param("addressLine") String addressLine, Pageable pageable);



    //ProductRepository에 사용자 이메일과 판매 상태(soldOut)를 기준으로 제품을 조회하는 메소드를 추가합니다.
    // 이 메소드는 판매 상태가 null일 경우 모든 상태의 제품을 반환하고,
    // 특정 상태(판매 중 또는 판매 완료)가 지정되었을 때 해당 상태의 제품만 반환합니다.
    @Query("SELECT p, pi FROM Product p LEFT JOIN p.imageList pi WHERE " +
            "(:userEmail is null OR p.userEmail = :userEmail)")
    Page<Object[]> findAllByUserEmailWithImages(@Param("userEmail") String userEmail, Pageable pageable);

    List<Product> findAllByUserEmailAndSoldOutTrue(String email);


}