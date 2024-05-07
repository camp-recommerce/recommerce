
package com.recommerceAPI.controller;

import com.recommerceAPI.dto.AuctionBiddingDTO;
import com.recommerceAPI.service.AuctionBiddingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/auction/bid")
public class AuctionBidController {
    private final AuctionBiddingService auctionBiddingService;
    @GetMapping("/list")
    public List<AuctionBiddingDTO> getAuctionBiddingByEmailAndAuctionApno(
            @RequestParam(required = false) String email

    ) {
        log.info("Fetching auction bidding list for email: {} and auction apno: {}", email);
        return auctionBiddingService.findAuctionBiddingByEmail(email);
    }
}