package com.recommerceAPI.service;

import com.recommerceAPI.dto.AuctionDTO;
import com.recommerceAPI.dto.PageRequestDTO;
import com.recommerceAPI.dto.PageResponseDTO;
import com.recommerceAPI.domain.AuctionStatus;

public interface AuctionService {

    Long register(AuctionDTO auctionDTO);

    AuctionDTO get(Long apno);

    void modify(AuctionDTO auctionDTO);

    void remove(Long apno);
    PageResponseDTO<AuctionDTO> getList(PageRequestDTO pageRequestDTO, String apName, String apCategory, AuctionStatus apStatus);

    PageResponseDTO<AuctionDTO>findByApBuyer(PageRequestDTO pageRequestDTO,String apBuyer);

    void  buy (Long apno);
}
