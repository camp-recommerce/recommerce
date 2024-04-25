package com.recommerceAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
    private String apName; // 상품 이름
    private String apStatus; // 경매 상태
    private int currentPrice; // 현재 입찰가
    private int startPrice;
    private int bidIncrement;

    @Builder.Default
    private List<String> uploadFileNames = new ArrayList<>();

}