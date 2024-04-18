package com.recommerceAPI.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


import com.recommerceAPI.domain.Product;
import com.recommerceAPI.domain.ProductImage;
import com.recommerceAPI.dto.PageRequestDTO;
import com.recommerceAPI.dto.PageResponseDTO;
import com.recommerceAPI.dto.PageResponsePpDTO;
import com.recommerceAPI.dto.ProductDTO;
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
       public PageResponsePpDTO<ProductDTO> getList(PageRequestDTO pageRequestDTO, String pname, String pcategory) {

           log.info("getList..............");

           Pageable pageable = PageRequest.of(
                   pageRequestDTO.getPage() - 1,
                   pageRequestDTO.getSize(),
                   Sort.by("pno").descending());

           Page<Object[]> result = productRepository.selectList(pname,pageable);

           List<ProductDTO> dtoList = result.getContent().stream().map(arr -> {

               Product product = (Product) arr[0];
               ProductImage productImage = (ProductImage) arr[1];

               ProductDTO productDTO = modelMapper.map(product, ProductDTO.class);

               if (productImage != null) {
                   productDTO.setUploadFileNames(Collections.singletonList(productImage.getFileName()));
               }

               return productDTO;
           }).collect(Collectors.toList());

           long totalCount = result.getTotalElements();

           return PageResponsePpDTO.<ProductDTO>withAll()
                   .dtoList(dtoList)
                   .totalCount(totalCount)
                   .pageRequestDTO(pageRequestDTO)
                   .build();
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
                .pstate(productDTO.getPstate())
                .pdesc(productDTO.getPdesc())
                .price(productDTO.getPrice())
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

        ProductDTO productDTO = entityToDTO(product);

        return productDTO;

    }

    private ProductDTO entityToDTO(Product product){

        ProductDTO productDTO = ProductDTO.builder()
                .pno(product.getPno())
                .pname(product.getPname())
                .pcategory(product.getPcategory())
                .price(product.getPrice())
                .pstate(product.getPstate())
                .plocat(product.getPlocat())
                .pdesc(product.getPdesc())
                .build();

        List<ProductImage> imageList = product.getImageList();

        if(imageList == null || imageList.size() == 0 ){
            return productDTO;
        }

        List<String> fileNameList = imageList.stream().map(productImage ->
                productImage.getFileName()).toList();

        productDTO.setUploadFileNames(fileNameList);

        return productDTO;
    }

    @Override
    public void modify(ProductDTO productDTO) {
        //step1 read
        Optional<Product> result = productRepository.findById(productDTO.getPno());

        Product product = result.orElseThrow();

        //2. change pname, price, pstate, plocat, pdesc
        product.changeName(productDTO.getPname());
        product.changePrice(productDTO.getPrice());
        product.changeState(productDTO.getPstate());
        product.changeLocat(productDTO.getPlocat());
        product.changeDesc(productDTO.getPdesc());

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
    public void remove(Long pno) {

        productRepository.updateToDelete(pno, true);

    }


}