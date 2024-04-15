package com.recommerceAPI.service;

import com.recommerceAPI.dto.PageRequestDTO;
import com.recommerceAPI.dto.PageResponseDTO;
import com.recommerceAPI.dto.ProductDTO;
import org.springframework.transaction.annotation.Transactional;


@Transactional
public interface ProductService {
    PageResponseDTO<ProductDTO> getList(PageRequestDTO pageRequestDTO, String pname);

    Long register(ProductDTO productDTO);
    ProductDTO get(Long pnum);
    void modify(ProductDTO productDTO);
    void remove(Long pnum);

}
