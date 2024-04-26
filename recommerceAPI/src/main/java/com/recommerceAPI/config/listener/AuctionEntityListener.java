package com.recommerceAPI.config.listener;

import com.recommerceAPI.config.event.AuctionClosedEvent;
import com.recommerceAPI.domain.Auction;
import com.recommerceAPI.domain.AuctionStatus;
import jakarta.persistence.PostUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

// 경매 종료 이벤트 발생시 이벤트를 발행해주는곳,
// 엔티티(Auction)의 상태 변화를 감지하고 만약 경매 상태가 경매종료일 때 이벤트 발행
@Component

public class AuctionEntityListener {

    private final ApplicationEventPublisher eventPublisher;
    @Autowired
    public AuctionEntityListener(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    @PostUpdate
    public void onAuctionStatusChanged(Auction auction) {
        // 경매 상태가 종료로 변경되었을 때 이벤트를 발행, 그 와 동시에 이벤트가 발생한 객체를 보내준다
        if (auction.getApStatus() == AuctionStatus.CLOSED) {
            AuctionClosedEvent event = new AuctionClosedEvent(this, auction);
            eventPublisher.publishEvent(event);
        }
    }
}