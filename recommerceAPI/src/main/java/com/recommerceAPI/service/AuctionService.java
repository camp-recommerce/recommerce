package com.recommerceAPI.service;

import com.recommerceAPI.dto.AuctionDTO;


public interface AuctionService {

    Long register(AuctionDTO auctionDTO);

    AuctionDTO get(Long apno);

    void modify(AuctionDTO auctionDTO);

    void remove(Long apno);

}
