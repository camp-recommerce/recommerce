package com.recommerceAPI.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "tbl_purchase_list_item", indexes = {
        @Index(name = "idx_purchase_list_item_user", columnList = "purchase_list_puno") // 인덱스 수정
})
public class PurchaseListItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long puino; // 구매 목록 아이템 ID

    @ManyToOne
    @JoinColumn(name = "purchase_list_puno") // 올바른 외래 키 이름으로 변경
    private PurchaseList purchaseList; // 이 아이템이 속한 구매 목록

    @ManyToOne
    @JoinColumn(name = "product_pno")
    private Product product; // 구매한 상품, 상품의 pno를 참조

    // 필요하다면 추가할 created_date 필드
    // @Column(name = "created_date")
    // private LocalDateTime createdDate;
}
