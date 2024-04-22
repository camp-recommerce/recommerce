package com.recommerceAPI.service;


import com.recommerceAPI.dto.PageRequestDTO;
import com.recommerceAPI.dto.ProductDTO;
import com.recommerceAPI.dto.ProductPageResponseDTO;
import org.springframework.transaction.annotation.Transactional;


@Transactional
public interface ProductService {


    //list
    ProductPageResponseDTO<ProductDTO> getList(PageRequestDTO pageRequestDTO, String pname, String pcategory);
    //create
    Long register(ProductDTO productDTO);
    ProductDTO get(Long pno);
    void modify(ProductDTO productDTO);
    void remove(Long pno);

}
