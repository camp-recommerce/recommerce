package com.recommerceAPI.repository;

import com.recommerceAPI.domain.Auction;
import com.recommerceAPI.domain.AuctionBidding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AuctionBiddingRepository extends JpaRepository<AuctionBidding, Long> {

    @Query("SELECT ab FROM AuctionBidding ab WHERE (:email is null OR ab.bidder.email = :email) AND (:apno is null OR ab.auction.apno = :apno)")
    List<AuctionBidding> findByBidderEmailAndAuctionApno(@Param("email") String email, @Param("apno") Long apno);

    List<AuctionBidding> findByAuction(Auction auction);
}