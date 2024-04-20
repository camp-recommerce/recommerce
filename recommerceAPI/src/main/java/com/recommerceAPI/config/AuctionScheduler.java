package com.recommerceAPI.config;

import com.recommerceAPI.domain.Auction;
import com.recommerceAPI.domain.AuctionBidding;
import com.recommerceAPI.domain.AuctionStatus;
import com.recommerceAPI.repository.AuctionBiddingRepository;
import com.recommerceAPI.repository.AuctionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@EnableScheduling // 스케쥴러 입니다 설정시간이 1분이라서 1분마다 모든 경매상품들의 시작, 종료 시간과
@Configuration // 현재 시간을 체크해서 경매물품의 상태를 자동으로 업데이트 합니다
@RequiredArgsConstructor
public class AuctionScheduler {

    private final AuctionRepository auctionRepository;
    private final AuctionBiddingRepository auctionBiddingRepository;

    // 3분마다 실행되는 스케줄링 작업
    @Scheduled(fixedRate = 1000 * 60)
    public void updateAuctionStatus() {
        LocalDateTime currentTime = LocalDateTime.now();

        // 경매 대기 중 (PENDING): 현재 시간이 경매 시작 시간 이전인 경우
        List<Auction> pendingAuctions = auctionRepository.findByApStartTimeAfter(currentTime);
        pendingAuctions.forEach(auction -> auction.changeStatus(AuctionStatus.PENDING));

        // 경매 진행 중 (ACTIVE): 현재 시간이 경매 시작 시간과 종료 시간 사이인 경우
        List<Auction> activeAuctions = auctionRepository.findByApStartTimeBeforeAndApClosingTimeAfter(currentTime, currentTime);
        activeAuctions.forEach(auction -> auction.changeStatus(AuctionStatus.ACTIVE));

        // 종료된 경매를 찾음
        List<Auction> closedAuctions = auctionRepository.findByApClosingTimeBefore(currentTime);

        // 각 종료된 경매에 대해 처리
        closedAuctions.forEach(auction -> {
            auction.changeStatus(AuctionStatus.CLOSED); // 경매 상태를 종료로 변경
            List<AuctionBidding> bids = auctionBiddingRepository.findByAuction(auction); // 해당 경매의 입찰 정보를 가져옴
            auction.setBuyerFromBids(bids); // 해당 경매의 입찰 정보를 이용하여 가장 큰 입찰 금액을 가진 사용자의 이메일을 설정
        });

        // 변경된 상태를 데이터베이스에 저장
        auctionRepository.saveAll(closedAuctions);
        auctionRepository.saveAll(pendingAuctions);
        auctionRepository.saveAll(activeAuctions);


    }
}