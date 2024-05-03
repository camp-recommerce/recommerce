package com.recommerceAPI.service;


import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import com.recommerceAPI.domain.Product;
import com.recommerceAPI.domain.ProductImage;

import com.recommerceAPI.dto.*;
import com.recommerceAPI.repository.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    private final ModelMapper modelMapper;

    @Override
    public ProductPageResponseDTO<ProductDTO> getList(PageRequestDTO pageRequestDTO, String pname, String pcategory, String addressLine) {
        log.info("getList..............");

        // 판매 상태를 숫자에서 문자열로 변경
        Boolean soldOut = false;
        String saleStatus = soldOut ? "판매 완료" : "판매 중";

        // 페이지 요청을 처리하기 위한 Pageable 객체 생성, pno 기준 내림차순 정렬
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("pno").descending());

        // Repository에서 데이터를 가져옴
        Page<Object[]> result = productRepository.selectList(pname, pcategory, addressLine, pageable);

        // 결과를 ProductDTO 리스트로 변환
        List<ProductDTO> dtoList = result.getContent().stream().map(arr -> {
            Product product = (Product) arr[0];
            ProductImage productImage = (ProductImage) arr[1];

            ProductDTO productDTO = new ProductDTO(
                
                    product.getPno(),
                    product.getPname(),
                    product.getPcategory(),
                    product.getPrice(),
                    product.getPstate(),
                    product.getPlocat(),
                    product.getAddressLine(),
                    product.getLat(),
                    product.getLng(),
                    product.getPdesc(),
                    product.isDelFlag(),
                    product.isSoldOut(),
                    product.getUserEmail(),

                    null, // 파일 리스트는 조건에 따라 설정
                    null  // 업로드 파일 이름 리스트 초기화

            );

            if (productImage != null) {
                productDTO.setUploadFileNames(Collections.singletonList(productImage.getFileName()));
            }

            return productDTO;
        }).filter(Objects::nonNull).collect(Collectors.toList());

        // 전체 아이템 수 계산
        long totalCount = result.getTotalElements();

        // 전체 아이템 수와 페이지 정보를 포함하는 DTO 객체 생성
        return new ProductPageResponseDTO<ProductDTO>(
                dtoList,
                pageRequestDTO.getPage(),
                result.getTotalPages(),
                result.getTotalElements(),
                result.hasNext(),
                saleStatus // 판매 상태 문자열을 추가하여 반환
        );
    }



    @Override
    public Long register(ProductDTO productDTO) {

        Product product = dtoToEntity(productDTO);

        Product result = productRepository.save(product);

        return result.getPno();
    }

    private Product dtoToEntity(ProductDTO productDTO){

        Product product = Product.builder()
                .pno(productDTO.getPno())
                .pname(productDTO.getPname())
                .pcategory(productDTO.getPcategory())
                .plocat(productDTO.getPlocat())
                .addressLine(productDTO.getAddressLine())
                .lat(productDTO.getLat())
                .lng(productDTO.getLng())
                .pstate(productDTO.getPstate())
                .pdesc(productDTO.getPdesc())
                .price(productDTO.getPrice())
                .userEmail(productDTO.getUserEmail())
                .build();

        //업로드 처리가 끝난 파일들의 이름 리스트
        List<String> uploadFileNames = productDTO.getUploadFileNames();

        if(uploadFileNames == null){
            return product;
        }

        uploadFileNames.stream().forEach(uploadName -> {

            product.addImageString(uploadName);
        });

        return product;
    }

    @Override
    public ProductDTO get(Long pno) {

        java.util.Optional<Product> result = productRepository.selectOne(pno);

        Product product = result.orElseThrow();

        List<String> fileNameList = product.getImageList().stream()
                .map(ProductImage::getFileName)
                .collect(Collectors.toList());

        ProductDTO dto = modelMapper.map(product, ProductDTO.class);

        dto.setUploadFileNames(fileNameList);

        return dto;
    }


    @Override
    public void modify(ProductDTO productDTO) {
        //step1 read
        Optional<Product> result = productRepository.findById(productDTO.getPno());

        Product product = result.orElseThrow();

        //2. change pname, price, pcategory, pstate, plocat, pdesc
        product.changeName(productDTO.getPname());
        product.changePrice(productDTO.getPrice());
        product.changePcategory(productDTO.getPcategory());
        product.changeState(productDTO.getPstate());
        product.changeLocat(productDTO.getPlocat());
        product.changeAddressLine(productDTO.getAddressLine());
        product.changeLat(productDTO.getLat());
        product.changeLng(productDTO.getLng());
        product.changeDesc(productDTO.getPdesc());
        product.changeSold(productDTO.isSoldOut());

        //3. upload File -- clear first
        product.clearList();

        List<String> uploadFileNames = productDTO.getUploadFileNames();

        if(uploadFileNames != null && uploadFileNames.size() > 0 ){
            uploadFileNames.stream().forEach(uploadName -> {
                product.addImageString(uploadName);
            });
        }
        productRepository.save(product);
    }
    @Override
    public void soldOut(Long pno){

        Optional<Product> result = productRepository.findById(pno);

        Product product = result.orElseThrow();
        product.changeSold(true);

        productRepository.save(product);
    }

    @Override
    public void remove(Long pno) {
        productRepository.updateToDelete(pno, true);
    }


    @Override
    public PageResponseDTO<ProductDTO> getProductsByUserAndStatus(PageRequestDTO pageRequestDTO, String userEmail) {
        log.info("Fetching products for userEmail: {} with sale status: {}", userEmail);

        // 페이지 요청을 처리하기 위한 Pageable 객체 생성, pno 기준 내림차순 정렬
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("pno").descending());

        // Repository에서 사용자 이메일과 판매 상태에 따라 제품 데이터를 페이지 단위로 조회
        Page<Object[]> page = productRepository.findAllByUserEmailWithImages(userEmail, pageable);

        // 페이지에 있는 제품 데이터를 ProductDTO 리스트로 변환
        List<ProductDTO> products = page.getContent().stream()
                .map(arr -> {
                    Product product = (Product) arr[0];
                    ProductImage productImage = (ProductImage) arr[1];
                    ProductDTO productDTO = modelMapper.map(product, ProductDTO.class);
                    if(productImage!=null){
                        productDTO.setUploadFileNames(Collections.singletonList(productImage.getFileName()));
                    }
                    return productDTO;
                }).collect(Collectors.toList());

        Long totalCount = page.getTotalElements();

        PageResponseDTO<ProductDTO> responseDTO = PageResponseDTO.<ProductDTO>withAll()
                .dtoList(products)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();

        return responseDTO;

    }

}