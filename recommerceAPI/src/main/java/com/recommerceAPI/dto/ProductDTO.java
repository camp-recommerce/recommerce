package com.recommerceAPI.dto;
import lombok.*;
import java.util.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {

    private Long pno; // 상품 번호

    private String pname; // 상품 이름
    
    private String pcategory; // 상품 카테고리

    private int price; // 상품 가격

    private String pstate; // 제품상태

    private String plocat; // 제품판매장소
    
    private String addressLine; // 제품판매장소 동 정보

    private double lat; // 제품판매장소 위도

    private double lng; // 제품판매장소 경도

    private String pdesc; // 상품 설명

    private boolean delFlag; // 삭제 플래그

    private boolean soldOut; // 판매완료

    private String userEmail;

    @Builder.Default
    private List<MultipartFile> files = new ArrayList<>(); // 업로드된 파일 리스트

    @Builder.Default
    private List<String> uploadFileNames = new ArrayList<>(); // 업로드된 파일 이름 리스트

}
