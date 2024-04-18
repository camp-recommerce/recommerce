package com.recommerceAPI.service;

import com.recommerceAPI.dto.PageRequestDTO;
import com.recommerceAPI.dto.PageResponseDTO;
import com.recommerceAPI.dto.PageResponsePpDTO;
import com.recommerceAPI.dto.ProductDTO;
import org.springframework.transaction.annotation.Transactional;


@Transactional
public interface ProductService {


    //목록 불러오기
    PageResponsePpDTO<ProductDTO> getList(PageRequestDTO pageRequestDTO, String pname, String pcategory);
    //create
    Long register(ProductDTO productDTO);
    ProductDTO get(Long pno);
    void modify(ProductDTO productDTO);
    void remove(Long pno);

}
