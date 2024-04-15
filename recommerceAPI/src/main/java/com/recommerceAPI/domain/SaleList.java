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
@Table(name = "tbl_sale_list")
public class SaleList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sno; // 판매 목록의 고유 ID

    @ManyToOne
    @JoinColumn(name = "seller_sno")
    private User seller; // 판매자 정보


}
