package com.recommerceAPI.repository;

import com.recommerceAPI.domain.Auction;
import com.recommerceAPI.domain.AuctionStatus;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;


@SpringBootTest
@Log4j2
public class AuctionRepositoryTests {

    @Autowired
    private AuctionRepository auctionRepository;

    @Test
    public void testInsert(){

        LocalDate date = LocalDate.of(2024,12,31);

        for (int i = 1; i <= 10; i++) {
            LocalTime startTime = LocalTime.of(11 + i,0);
            LocalTime closingTime = LocalTime.of(12 + i,59);

            Auction auction = Auction.builder()
                    .apName("Auction Product Name " + i)
                    .apDesc("Auction Product Description " + i)
                    .apCategory("Auction Product Category" + i)
                    .apStartPrice(5000 * i)
                    .apBidIncrement(500 * i)
                    .apStartTime(LocalDateTime.of(date, startTime))
                    .apClosingTime(LocalDateTime.of(date, closingTime))
                    .apStatus(AuctionStatus.PENDING)
                    .build();

            auction.addImageString("Image01.jpg");

            auctionRepository.save(auction);
            log.info("-----------------------------------");
        }
    }

    @Test
    @Transactional
    @Commit
    public void testModify() {

        LocalDate date = LocalDate.of(2024,12,24);

        Long apno = 3L;

        java.util.Optional<Auction> result = auctionRepository.findById(apno);

        LocalTime startTime = LocalTime.of((int) (12 + apno), 0);
        LocalTime closingTime = LocalTime.of((int) (13 + apno),59);

        Auction auction = result.orElseThrow();
        auction.changeName("Auction Product New Name " + apno);
        auction.changeDesc("Auction Product New Description " + apno);
        auction.changeCat("Auction Product New Category " + apno);
        auction.changePrice((int) (10000 * apno));
        auction.changeIncrement((int) (1000 * apno));
        auction.changeStartTime(LocalDateTime.of(date, startTime));
        auction.changeClosingTime(LocalDateTime.of(date, closingTime));
        auction.changeStatus(AuctionStatus.CLOSED);

        auction.clearList();

        auction.addImageString(UUID.randomUUID().toString()+"_"+"NewImage01.jpg");

        auctionRepository.save(auction);
        log.info("-----------------------------------");
    }
}
