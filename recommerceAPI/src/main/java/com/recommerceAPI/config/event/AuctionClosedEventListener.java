package com.recommerceAPI.config.event;

import com.recommerceAPI.repository.AuctionBiddingRepository;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.recommerceAPI.domain.Auction;
@Component
@RequiredArgsConstructor
public class AuctionClosedEventListener {

    private final AuctionBiddingRepository auctionBiddingRepository;
    @EventListener
    public void handleAuctionClosedEvent(AuctionClosedEvent event) {
        // 종료된 경매에 해당하는 옥션 객체 획득 가능
         Auction auction = event.getAuction();
         Long auctinApno = auction.getApno();



    }
}