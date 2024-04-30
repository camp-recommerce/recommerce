package com.recommerceAPI.service;

import com.recommerceAPI.domain.AuctionStatus;
import com.recommerceAPI.dto.AuctionDTO;
import com.recommerceAPI.dto.PageRequestDTO;
import com.recommerceAPI.dto.PageResponseDTO;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@SpringBootTest
@Log4j2
public class AuctionServiceTests {

    @Autowired
    private AuctionService auctionService;

    @Test
    public void testRegister() {
        LocalDate date = LocalDate.of(2024,12,31);
        LocalTime startTime = LocalTime.of(12,0);
        LocalTime closingTime = LocalTime.of(13,59);

        AuctionDTO auctionDTO = AuctionDTO.builder()
                .apName("Auction Service Test Name")
                .apDesc("Auction Service Test Desc")
                .apCategory("Auction Service Test Category")
                .apStartPrice(5000)
                .apBidIncrement(500)
                .apStartTime(LocalDateTime.of(date, startTime))
                .apClosingTime(LocalDateTime.of(date, closingTime))
                .apStatus(AuctionStatus.PENDING)
                .build();

                Long apno = auctionService.register(auctionDTO);

                log.info("APNO: " + apno);
    }

    @Test
    public void testGet() {
        Long apno = 4L;

        AuctionDTO auctionDTO = auctionService.get(apno);

        log.info(auctionDTO);
    }

//    @Test
//    public void testList() {
//        PageRequestDTO pageRequestDTO = PageRequestDTO.builder()
//                .page(1)
//                .size(10)
//                .build();
//        PageResponseDTO<AuctionDTO> response = auctionService.getList(pageRequestDTO, null, null);
//        log.info(response);
//    }
}
