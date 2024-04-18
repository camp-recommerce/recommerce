package com.recommerceAPI.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
@ToString(exclude = "sale")
@Table(
        name = "tbl_sale_item",
        indexes = {
                @Index(columnList = "sale_sno", name = "idx_saleitem_sale"),
                @Index(columnList = "product_pno, sale_sno", name = "idx_saleitem_pno_sale")
        }
)
public class SaleItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sino; // 판매 아이템 번호.

    @ManyToOne
    @JoinColumn(name = "product_pno")
    private Product product; // 연결된 상품.

    @ManyToOne
    @JoinColumn(name = "sale_sno")
    private Sale sale; // 연결된 판매.

    private String fileName; // 상품 이미지 파일 경로 또는 URL
}
