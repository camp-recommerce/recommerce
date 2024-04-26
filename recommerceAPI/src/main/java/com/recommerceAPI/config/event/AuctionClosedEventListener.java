package com.recommerceAPI.config.event;

import com.recommerceAPI.repository.AuctionBiddingRepository;
import com.recommerceAPI.service.ChatAlarmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.recommerceAPI.domain.Auction;
import com.recommerceAPI.domain.AuctionBidding;
import com.recommerceAPI.dto.ChatAlarmDTO;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Log4j2

public class AuctionClosedEventListener {

    private final AuctionBiddingRepository auctionBiddingRepository;
    private final ChatAlarmService chatAlarmService;
    @EventListener
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMPLETION)
    public synchronized void handleAuctionClosedEvent(AuctionClosedEvent event) {


        // 종료된 경매에 해당하는 옥션 객체 획득 가능
         Auction auction = event.getAuction();
         Long auctinApno = auction.getApno();
         String auctionName = auction.getApName();
         String auctionClosedTime = String.valueOf(auction.getApClosingTime());

         log.info("===========================================================closedEvent"+auction);

        List<AuctionBidding> auctionBiddings = auctionBiddingRepository.findHighestBidByAuctionApno(auctinApno);
        log.info("===================auctionBiddings"+auctionBiddings);

        List<ChatAlarmDTO> auctionClosedAlaramDTOList = new ArrayList<>();
        // 옥션 바이딩을 기준으로 반복문 돌려서 알람들 생성
        for(AuctionBidding auctionBidding : auctionBiddings){
            ChatAlarmDTO chatAlarmDTO = new ChatAlarmDTO();
            // chatAlarmDTO들 필요한 정보로 생성
            chatAlarmDTO.setSenderEmail("notification!");
            chatAlarmDTO.setReadCheck(false);
            chatAlarmDTO.setMessage(auctionName+"상품의 경매가 종료 됬습니다!");
            chatAlarmDTO.setCreatedAt(auctionClosedTime);
            chatAlarmDTO.setUserEmail(auctionBidding.getBidder().getEmail());
            chatAlarmDTO.setRoomId(String.valueOf(auctinApno));

            log.info("====================alarm"+chatAlarmDTO);

            chatAlarmService.sendAuctionAlarm(chatAlarmDTO);

        }

    }
}