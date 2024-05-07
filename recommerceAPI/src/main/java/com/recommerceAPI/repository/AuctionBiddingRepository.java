package com.recommerceAPI.repository;

import com.recommerceAPI.domain.Auction;
import com.recommerceAPI.domain.AuctionBidding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Transactional
public interface AuctionBiddingRepository extends JpaRepository<AuctionBidding, Long> {

    // 입찰 내역중에서 auction.apno 별로 가장큰 입찰금액을 가진것만 반환하도록 하는 쿼리문
    // 마이 페이지에서 내 입찰내역을 볼때 사용 합니다.
    @Query("SELECT ab FROM AuctionBidding ab " +
            "WHERE ab.bidder.email = :email " +
            "AND ab.auction.apStatus = 'ACTIVE' " + // 추가된 부분
            "AND (ab.auction.apno, ab.bidAmount) IN (" +
            "    SELECT ab2.auction.apno, MAX(ab2.bidAmount) " +
            "    FROM AuctionBidding ab2 " +
            "    WHERE ab2.bidder.email = :email " +
            "    GROUP BY ab2.auction.apno" +
            ")")
    List<AuctionBidding> findHighestBidByAuctionApno(@Param("email") String email);

    List<AuctionBidding> findByAuction(Auction auction);
    List<AuctionBidding> findByAuction_Apno(Long apno);
    // 상품 번호로 경매 내역을 가져와서 그 중 각 이메일별로 가장큰 입찰 금액을 가진 내역들을 가져옴
    @Query("SELECT ab FROM AuctionBidding ab " +
            "WHERE ab.auction.apno = :apno " +
            "AND (ab.bidder.email, ab.bidAmount) IN (" +
            "    SELECT ab2.bidder.email, MAX(ab2.bidAmount) " +
            "    FROM AuctionBidding ab2 " +
            "    WHERE ab2.auction.apno = :apno " +
            "    GROUP BY ab2.bidder.email" +
            ")")
    List<AuctionBidding> findHighestBidByAuctionApno(@Param("apno") Long apno);
}