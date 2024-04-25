package com.recommerceAPI.config.event;

import org.springframework.context.ApplicationEvent;
import com.recommerceAPI.domain.Auction;


public class AuctionClosedEvent extends ApplicationEvent {

    private Auction auction;


    public AuctionClosedEvent(Object source, Long apno) {
        super(source);
        this.auction = auction;
    }
    public Auction getAuction() {
        return auction;
    }
}