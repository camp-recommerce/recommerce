package com.recommerceAPI.repository;

import com.recommerceAPI.domain.Auction;
import com.recommerceAPI.domain.AuctionBidding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AuctionBiddingRepository extends JpaRepository<AuctionBidding, Long> {

    @Query("SELECT ab FROM AuctionBidding ab WHERE ab.bidder.email = :email")
    List<AuctionBidding> findByBidderEmail(@Param("email") String email);


    List<AuctionBidding> findByAuction(Auction auction);
    List<AuctionBidding> findByAuction_Apno(Long apno);
}