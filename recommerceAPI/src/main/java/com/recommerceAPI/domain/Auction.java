package com.recommerceAPI.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;


@Entity
//@Table(name = "auction")
@Getter
@ToString(exclude = "imageList")
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class Auction {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long apno;

    private String apName;

    private String apDesc;

    private String apCategory;

    private int apStartPrice;

    private int apCurrentPrice;

    private int apBidIncrement;

    private LocalDateTime apStartTime; // 경매 시작 시간

    private LocalDateTime apClosingTime; // 입찰 마감 시간

    private LocalDateTime apEndTime; // 경매 종료 시간(낙찰)

    private String apBuyer;

    @Enumerated(EnumType.STRING)
    private AuctionStatus apStatus;

    @Builder.Default
    private boolean deleted = false; // 삭제 여부를 나타내는 필드

    @ElementCollection
    @Builder.Default
    private List<AuctionImage> imageList = new ArrayList<>();

    public void changeName(String name){
        this.apName = name;
    }

    public void changeDesc(String desc) {this.apDesc = desc;}

    public void changeCat(String cat) {this.apCategory = cat;}

    public void changePrice(int price) {
        this.apStartPrice = price;
    }

    public void changeIncrement(int increment) {this.apBidIncrement = increment;}

    public void changeStartTime(LocalDateTime startTime) {this.apStartTime = startTime;}

    public void changeClosingTime(LocalDateTime closingTime) {this.apClosingTime = closingTime;}

    public void changeStatus(AuctionStatus status) {
            this.apStatus = status;
    }

    public void addImage(AuctionImage image) {

        image.setOrd(this.imageList.size());
        imageList.add(image);
    }

    public void addImageString(String fileName){

        AuctionImage auctionImage = AuctionImage.builder()
                .fileName(fileName)
                .build();
        addImage(auctionImage);

    }

    public void clearList() {
        this.imageList.clear();
    }
    // 입찰가 갱신 메서드
    public void updateCurrentPrice(int bidAmount) {
        if (bidAmount > this.apCurrentPrice) {
            this.apCurrentPrice = bidAmount;
        }
    }

    // 현재 경매 정보가 하위에 생겨서 삭제가 안됩니다. delFlag를 이용해서
    // soft 삭제 방식으로 변경합니다
    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
    // 경매 종료시 가장큰 bidAmount를 가진 이메일을 찾는중
    public void setBuyerFromBids(List<AuctionBidding> bids) {
        // 경매가 종료된 경우에만 실행하도록 해야함
        if (apStatus == AuctionStatus.CLOSED) {
            // 가장 큰 bidAmount를 가진 입찰자를 찾음
            Optional<AuctionBidding> highestBid = bids.stream()
                    .max(Comparator.comparingInt(AuctionBidding::getBidAmount));

            // 입찰자가 존재하면 해당 입찰자를 apBuyer로 설정
            highestBid.ifPresent(bid -> this.apBuyer = bid.getBidder().getEmail());
        }
    }
}