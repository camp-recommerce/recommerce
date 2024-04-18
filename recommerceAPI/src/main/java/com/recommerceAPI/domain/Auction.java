package com.recommerceAPI.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    public void changeStatus(AuctionStatus status) {this.apStatus = status;}

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

    // 현재 경매 정보가 하위에 생겨서 삭제가 안됩니다. delFlag를 이용해서
    // soft 삭제 방식으로 변경합니다
    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
}