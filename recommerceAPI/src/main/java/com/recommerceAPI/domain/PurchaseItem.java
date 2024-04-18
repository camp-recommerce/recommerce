package com.recommerceAPI.domain;


import jakarta.persistence.*;
import lombok.*;

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

    private String fileName; // 수정: 상품 이미지 파일 경로 또는 URL
}


