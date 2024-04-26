package com.recommerceAPI.config.event;

import org.springframework.context.ApplicationEvent;
import com.recommerceAPI.domain.Auction;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;


// 경매 종료 이벤트가 발생한 Auction 객체를 가져오기 위해 설정

public class AuctionClosedEvent extends ApplicationEvent {

    private Auction auction;



    public AuctionClosedEvent(Object source, Auction auction) {
        super(source);
        this.auction = auction;
    }

    public Auction getAuction() {
        return auction;
    }
}