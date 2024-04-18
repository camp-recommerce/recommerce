package com.recommerceAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuctionBiddingDTO {
    private Long apno; // 입찰한 상품의 번호
    private Long auctionApno; // 상품 번호
    private String bidderEmail; // 입찰자 이메일
    private int bidAmount; // 입찰 금액
    private String bidTime; // 입찰 시간
}