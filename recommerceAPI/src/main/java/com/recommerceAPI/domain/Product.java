package com.recommerceAPI.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@ToString(exclude = "imageList")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pno;

    private String pname;

    private String pcategory;

    private int price;

    private String pstate; // 제품상태

    private String plocat; // 제품판매장소

    private String addressLine; // 제품판매장소 동 정보
    
    private double lat; // 제품판매장소 위도
    
    private double lng; // 제품판매장소 경도

    private String pdesc; // 제품설명

    private boolean delFlag; // 삭제 여부
    
    private boolean soldOut; //판매완료 여부

    private String userEmail; // Product와 User의 관계
    public void changeDel(boolean delFlag) {
        this.delFlag = delFlag;
    }


    @ElementCollection
    @Builder.Default
    private List<com.recommerceAPI.domain.ProductImage> imageList = new ArrayList<>();

    public void changePrice(int price) {
        this.price = price;
    }

    public void changePcategory(String category) {
            this.pcategory = category;
        }

    public void changeDesc(String desc){
        this.pdesc = desc;
    }

    public void changeName(String name){
        this.pname = name;
    }

    public void changeLocat(String locat){
        this.plocat = locat;
    }

    public void changeAddressLine(String addressLine) {this.addressLine = addressLine;}

    public void changeLat(double lat) {this.lat = lat;}

    public void changeLng(double lng) {this.lng = lng;}

    public void changeState(String state){this.pstate = state;}
    public void changeUserEmail(String userEmail){
        this.userEmail = userEmail;
    };


    public void addImage(ProductImage image) {

        image.setOrd(this.imageList.size());
        imageList.add(image);
    }

    public void addImageString(String fileName){

        ProductImage productImage = ProductImage.builder()
                .fileName(fileName)
                .build();
        addImage(productImage);

    }

    public void clearList() {
        this.imageList.clear();
    }

    public void changeSold(boolean soldOut) {
        this.soldOut=soldOut;
    }
}