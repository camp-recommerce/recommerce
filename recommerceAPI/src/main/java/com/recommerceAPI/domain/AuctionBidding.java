package com.recommerceAPI.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
//@Table(name = "ap_bidding")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionBidding {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long apno; // 입찰한 상품, 이 아니라 정확히는 생성되는 고유값

    @ManyToOne
    @JoinColumn(name = "auction_apno") // 이게 입찰한 상품 번호
    private Auction auction;

    @ManyToOne
    @JoinColumn(name = "bidder_email")
    private User bidder; // 입찰자 -> User 도메인 참고해서 가져올 것, 최종 입찰자가 낙찰자 되도록

    private int bidAmount; // 입찰 금액 -> 최종 입찰 금액이 낙찰 금액 되도록

    private String bidTime; // 입찰 시간
}
