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

    // SaleItem 테스트를 위해 연관관계인 product 객체도 test시 함께 생성하기 위한 임시 코드
//    @ManyToOne(cascade = CascadeType.PERSIST)
    @ManyToOne
    @JoinColumn(name = "product_pno")
    private Product product; // 연결된 상품.

    @ManyToOne
    @JoinColumn(name = "sale_sno")
    private Sale sale; // 연결된 판매.

    private String pcategory; // 상품 카테고리
    private int price; // 상품 가격
    private String addressLine; // 제품판매장소 동 정보

    private String fileName; // 상품 이미지 파일 경로 또는 URL
}