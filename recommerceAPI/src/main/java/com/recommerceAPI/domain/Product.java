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
    private Long pno; // 제품번호

    private String pname; // 제품제목

    private int price; // 제품가격

    private String pstate; // 제품상태

    private String plocat; // 제품판매장소

    private String pdesc; // 제품설명

    private String paddress;

    private boolean delFlag;

    @ManyToOne
    @JoinColumn(name = "user_email")  // 외래 키 이름 설정
    private User user; // Product와 User의 관계

    public void changeDel(boolean delFlag) {
        this.delFlag = delFlag;
    }

    @ElementCollection
    @Builder.Default
    private List<com.recommerceAPI.domain.ProductImage> imageList = new ArrayList<>();

    public void changePrice(int price) {
        this.price = price;
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

    public void changeState(String state){this.pstate = state;}


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
}