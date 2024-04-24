package com.recommerceAPI.events;

import com.recommerceAPI.domain.SaleItem;
import org.springframework.context.ApplicationEvent;

public class SaleItemAddedEvent extends ApplicationEvent {
    public SaleItemAddedEvent(SaleItem source) {
        super(source);
    }

    public SaleItem getSaleItem() {
        return (SaleItem) getSource();
    }
}
