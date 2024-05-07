package com.recommerceAPI.config;

import com.recommerceAPI.domain.Auction;
import com.recommerceAPI.domain.AuctionBidding;
import com.recommerceAPI.domain.AuctionStatus;
import com.recommerceAPI.repository.AuctionBiddingRepository;
import com.recommerceAPI.repository.AuctionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import com.recommerceAPI.dto.ChatAlarmDTO;
import com.recommerceAPI.service.ChatAlarmService;

import java.time.LocalDateTime;
import java.util.*;

@EnableScheduling // 스케쥴러 입니다 설정시간이 1분이라서 1분마다 모든 경매상품들의 시작, 종료 시간과
@Configuration // 현재 시간을 체크해서 경매물품의 상태를 자동으로 업데이트 합니다
@RequiredArgsConstructor
@Log4j2
public class AuctionScheduler {

    private final AuctionRepository auctionRepository;
    private final AuctionBiddingRepository auctionBiddingRepository;
    private final ChatAlarmService chatAlarmService;
    // 3분마다 실행되는 스케줄링 작업
    @Scheduled(fixedRate = 1000 * 60)
    public void updateAuctionStatus() {
        LocalDateTime currentTime = LocalDateTime.now();
        // 경매 대기 중 (PENDING): 현재 시간이 경매 시작 시간 이전인 경우
        List<Auction> pendingAuctions = auctionRepository.findByApStartTimeAfter(currentTime);
        if (!pendingAuctions.isEmpty()) {
            pendingAuctions.forEach(auction -> auction.changeStatus(AuctionStatus.PENDING));
            auctionRepository.saveAll(pendingAuctions);
        } // 경매 진행 중 (ACTIVE)
        List<Auction> activeAuctions = auctionRepository.findByApStartTimeBeforeAndApClosingTimeAfter(currentTime, currentTime);
        if (!activeAuctions.isEmpty()) {
            activeAuctions.forEach(auction -> auction.changeStatus(AuctionStatus.ACTIVE));
            auctionRepository.saveAll(activeAuctions);
        }
        List<Auction> closedAuctions = auctionRepository.findActiveAuctionsBeforeClosingTime(currentTime); // 종료된 경매를 찾음
        if (!closedAuctions.isEmpty()) { // 각 종료된 경매에 대해 처리
            Set<String> userEmails = new HashSet<>();// 중복된 값을 허용하지 않기 때문에 해당하는 이메일이 한번씩만 저장됨
            closedAuctions.forEach(auction -> {
                Long apno = auction.getApno();
                String auctionName = auction.getApName();
                String auctionClosedTime = String.valueOf(auction.getApClosingTime());
                auction.changeStatus(AuctionStatus.CLOSED); // 경매 상태를 종료로 변경
                List<AuctionBidding> bids = auctionBiddingRepository.findByAuction(auction); // 해당 경매의 입찰 정보를 가져옴
                auction.setBuyerFromBids(bids); // 해당 경매의 입찰 정보를 이용하여 가장 큰 입찰 금액을 가진 사용자의 이메일을 설정
                List<AuctionBidding> auctionBiddings = auctionBiddingRepository.findByAuction_Apno(apno);
                auctionBiddings.forEach(auctionBidding -> {
                    String userEmail = auctionBidding.getBidder().getEmail();
                    if (!userEmails.contains(userEmail)) {// 이메일 주소가 사용자 목록에 없으면 알림을 보냄
                        ChatAlarmDTO chatAlarmDTO = new ChatAlarmDTO();
                        chatAlarmDTO.setSenderEmail(apno+"번 상품 경매 종료 알림!"); // chatAlarmDTO들 필요한 정보로 생성
                        chatAlarmDTO.setReadCheck(false);
                        chatAlarmDTO.setMessage(auctionName+"상품의 경매가 종료 됬습니다!");
                        chatAlarmDTO.setCreatedAt(auctionClosedTime);
                        chatAlarmDTO.setUserEmail(userEmail);
                        chatAlarmDTO.setRoomId(String.valueOf(apno));
                        log.info("====================alarm"+chatAlarmDTO);
                        chatAlarmService.sendAuctionAlarm(chatAlarmDTO);
                        userEmails.add(userEmail); // 사용자 이메일 주소를 사용자 목록에 추가
                    }
                });
                auctionRepository.save(auction); // 각 경매를 저장합니다.
            });
        }
    }
}
