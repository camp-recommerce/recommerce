package com.recommerceAPI.listener;

import com.recommerceAPI.events.SaleItemAddedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class SaleItemListener {

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @EventListener
    public void onSaleItemAdded(SaleItemAddedEvent event) {
        // 로직 구현
    }
}