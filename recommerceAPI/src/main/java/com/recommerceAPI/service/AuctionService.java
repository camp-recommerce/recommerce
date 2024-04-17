package com.recommerceAPI.service;

import com.recommerceAPI.dto.AuctionDTO;
import com.recommerceAPI.dto.PageRequestDTO;
import com.recommerceAPI.dto.PageResponseDTO;

public interface AuctionService {

    Long register(AuctionDTO auctionDTO);

    AuctionDTO get(Long apno);

    void modify(AuctionDTO auctionDTO);

    void remove(Long apno);
    PageResponseDTO<AuctionDTO> list(PageRequestDTO pageRequestDTO,String apName, String apCategory);
}
