package com.recommerceAPI.service;

import com.recommerceAPI.domain.AuctionBidding;
import com.recommerceAPI.domain.User;
import com.recommerceAPI.dto.ChatMessageDTO;
import com.recommerceAPI.repository.UserRepository;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Optional;

@SpringBootTest
@Log4j2
public class AuctionBiddingServiceTests {
    @Autowired
    private AuctionBiddingService auctionBiddingService;
    @Autowired
    private UserRepository userRepository;

    @Test
    public void createAuctionBiddingTestData() {
// 시간 설정
        LocalDateTime bidTime = LocalDateTime.of(2024, 4, 17, 11, 10);

        // 10개의 옥션 바이딩 객체 생성
        for (int i = 0; i < 10; i++) {
            // 이메일 설정
            String email = "user" + i + "@aaa.com";
            // 입찰가격 설정
            int bidAmount = 6000 + (i * 1000);
            // 상품번호 설정
            Long apno = 33L;
            // 옥션 바이딩 DTO 생성
            ChatMessageDTO chatMessageDTO = new ChatMessageDTO();
            chatMessageDTO.setAuthor(email);
            chatMessageDTO.setRoom(String.valueOf(apno));
            chatMessageDTO.setMessage(String.valueOf(bidAmount));
            chatMessageDTO.setTime(bidTime.toString());
            // 옥션 바이딩 서비스 호출
            auctionBiddingService.saveAuctionBidding(chatMessageDTO);
         }
        }
    }

