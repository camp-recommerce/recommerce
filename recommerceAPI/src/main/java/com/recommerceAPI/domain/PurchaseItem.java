package com.recommerceAPI.domain;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationEventPublisher;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
@ToString(exclude = "purchase")
@Table(name = "tbl_purchase_item", indexes = {
        @Index(columnList = "purchase_puno", name = "idx_purchaseitem_purchase"),
        @Index(columnList = "product_pno, purchase_puno", name = "idx_purchaseitem_pno_purchase")
})
public class PurchaseItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long puino; // 구매 아이템 번호.

    @ManyToOne
    @JoinColumn(name = "product_pno") // 수정
    private Product product; // 연결된 상품.

    @ManyToOne
    @JoinColumn(name = "purchase_puno") // 수정
    private Purchase purchase; // 연결된 구매.

    private String pcategory; // 상품 카테고리

    private String fileName; // 수정: 상품 이미지 파일 경로 또는 URL

    @ManyToOne
    @JoinColumn(name = "user_email")
    private User user;

    // Listener 내부 클래스
    public static class PurchaseItemListener {

        @Autowired
        private ApplicationEventPublisher eventPublisher;

        @PostPersist
        public void afterPurchase(PurchaseItem purchaseItem) {
            eventPublisher.publishEvent(new PurchaseItem.PurchaseItemAddedEvent(purchaseItem));
        }
    }

    // Event 내부 클래스
    public static class PurchaseItemAddedEvent extends ApplicationEvent {
        public PurchaseItemAddedEvent(PurchaseItem source) {
            super(source);
        }

        public PurchaseItem getPurchaseItem() {
            return (PurchaseItem) getSource();
        }
    }
}


