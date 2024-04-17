package com.recommerceAPI.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "tbl_purchase_list")
public class PurchaseList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long puno; // 구매 목록 ID

    @ManyToOne
    @JoinColumn(name = "user_email")
    private User user; // 구매 목록의 소유자

    @OneToMany(mappedBy = "purchaseList", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PurchaseListItem> items; // 구매한 상품 목록




}
