package com.recommerceAPI.repository;

import com.recommerceAPI.domain.Auction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface AuctionRepository extends JpaRepository<Auction, Long> {
    @Query("select a, ai from Auction a left join a.imageList ai where " +
            "(:apName is null or a.apName like %:apName%) and " +
            "(:apCategory is null or a.apCategory like %:apCategory%)")
    Page<Object[]> selectList(@Param("apName") String apName, @Param("apCategory") String apCategory, Pageable pageable);
}
