package com.recommerceAPI.domain;



import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "tbl_sale_list_item", indexes = {
        @Index(name = "idx_sale_list_item_sale_list", columnList = "sale_list_sno"), // 판매 목록 ID에 대한 인덱스
        @Index(name = "idx_sale_list_item_product", columnList = "product_pno") // 판매된 상품 ID에 대한 인덱스
})
public class SaleListItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sino; // 판매 아이템의 고유 ID

    @ManyToOne
    @JoinColumn(name = "sale_list_sno")
    private SaleList saleList; // 이 아이템이 속한 판매 목록

    @ManyToOne
    @JoinColumn(name = "product_pno")
    private Product product; // 판매된 상품 정보

    @Column(name = "sale_date")
    private LocalDateTime saleDate; // 판매 날짜
}
