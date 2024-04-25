package com.recommerceAPI.repository;

import com.recommerceAPI.domain.Auction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;


public interface AuctionRepository extends JpaRepository<Auction, Long> {
    @Query("select a, ai from Auction a left join a.imageList ai where " +
            "(:apName is null or a.apName like %:apName%) and " +
            "(:apCategory is null or a.apCategory like %:apCategory%) and " +
            "a.deleted = false")
    Page<Object[]> selectList(@Param("apName") String apName, @Param("apCategory") String apCategory, Pageable pageable);

    // 아래 3개는 현재 시간이랑 경매 시작시간, 종료시간 검사해서 검색하는 리파지토리입니다
    List<Auction> findByApStartTimeAfter(LocalDateTime currentTime);

    List<Auction> findByApStartTimeBeforeAndApClosingTimeAfter(LocalDateTime currentTime, LocalDateTime currentTime1);

    List<Auction> findByApClosingTimeBefore(LocalDateTime currentTime);

    @Query("SELECT a, ai FROM Auction a LEFT JOIN a.imageList ai WHERE " +
            "(:apBuyer is null OR a.apBuyer = :apBuyer)")
    Page<Object[]> findByApBuyer(Pageable pageablem ,@Param("apBuyer") String apBuyer);

}
