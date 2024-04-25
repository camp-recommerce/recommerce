package com.recommerceAPI.config.listener;

import com.recommerceAPI.config.event.AuctionClosedEvent;
import com.recommerceAPI.domain.Auction;
import com.recommerceAPI.domain.AuctionStatus;
import jakarta.persistence.PostUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;


@Component
public class AuctionEntityListener {

    private final ApplicationEventPublisher eventPublisher;
    @Autowired
    public AuctionEntityListener(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    @PostUpdate
    public void onAuctionStatusChanged(Auction auction) {
        // 경매 상태가 종료로 변경되었을 때 이벤트를 발행
        if (auction.getApStatus() == AuctionStatus.CLOSED) {
            AuctionClosedEvent event = new AuctionClosedEvent(this, auction.getApno());
            eventPublisher.publishEvent(event);
        }
    }
}