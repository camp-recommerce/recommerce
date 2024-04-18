package com.recommerceAPI.config;

import com.recommerceAPI.domain.Auction;
import com.recommerceAPI.domain.AuctionStatus;
import com.recommerceAPI.repository.AuctionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;
import java.util.List;

@EnableScheduling // 스케쥴러 입니다 설정시간이 1분이라서 1분마다 모든 경매상품들의 시작, 종료 시간과
@Configuration // 현재 시간을 체크해서 경매물품의 상태를 자동으로 업데이트 합니다
@RequiredArgsConstructor
public class AuctionScheduler {

    private final AuctionRepository auctionRepository;

    // 1분마다 실행되는 스케줄링 작업
    @Scheduled(fixedRate = 1000 * 60)
    public void updateAuctionStatus() {
        LocalDateTime currentTime = LocalDateTime.now();

        // 경매 대기 중 (PENDING): 현재 시간이 경매 시작 시간 이전인 경우
        List<Auction> pendingAuctions = auctionRepository.findByApStartTimeAfter(currentTime);
        pendingAuctions.forEach(auction -> auction.changeStatus(AuctionStatus.PENDING));

        // 경매 진행 중 (ACTIVE): 현재 시간이 경매 시작 시간과 종료 시간 사이인 경우
        List<Auction> activeAuctions = auctionRepository.findByApStartTimeBeforeAndApClosingTimeAfter(currentTime, currentTime);
        activeAuctions.forEach(auction -> auction.changeStatus(AuctionStatus.ACTIVE));

        // 경매 종료 (CLOSED): 현재 시간이 경매 종료 시간 이후인 경우
        List<Auction> closedAuctions = auctionRepository.findByApClosingTimeBefore(currentTime);
        closedAuctions.forEach(auction -> auction.changeStatus(AuctionStatus.CLOSED));

        // 변경된 상태를 데이터베이스에 저장
        auctionRepository.saveAll(pendingAuctions);
        auctionRepository.saveAll(activeAuctions);
        auctionRepository.saveAll(closedAuctions);
    }
}