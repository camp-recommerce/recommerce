package com.recommerceAPI.service;

import com.recommerceAPI.dto.AuctionBiddingDTO;
import com.recommerceAPI.dto.ChatMessageDTO;
import com.recommerceAPI.domain.AuctionBidding;
import org.springframework.web.socket.WebSocketSession;

import java.util.List;

public interface AuctionBiddingService {

    // ChatMessageDTO를 받아서 옥션 바이딩 객체를 저장하는 메소드
    AuctionBidding saveAuctionBidding(ChatMessageDTO chatMessageDTO);

    // 이메일과 상품번호를 조합하여 옥션 바이딩 조회하는 메소드
    List<AuctionBiddingDTO> findAuctionBiddingByEmail(String email);

    void sendPreviousBidHistory(Long room, WebSocketSession session);


}