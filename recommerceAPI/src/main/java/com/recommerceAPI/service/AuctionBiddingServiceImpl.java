package com.recommerceAPI.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recommerceAPI.domain.Auction;
import com.recommerceAPI.domain.AuctionBidding;
import com.recommerceAPI.domain.User;
import com.recommerceAPI.dto.AuctionBiddingDTO;
import com.recommerceAPI.dto.ChatMessageDTO;
import com.recommerceAPI.repository.AuctionBiddingRepository;
import com.recommerceAPI.repository.AuctionRepository;
import com.recommerceAPI.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import com.recommerceAPI.domain.AuctionImage;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class AuctionBiddingServiceImpl implements AuctionBiddingService{

    private final AuctionBiddingRepository auctionBiddingRepository;
    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ChatMessageDTO를 받아서 옥션 바이딩 객체를 저장하는 메소드
    @Override
    public AuctionBidding saveAuctionBidding(ChatMessageDTO chatMessageDTO){
        // ChatMessageDTO에서 필요한 정보 추출
        String email = chatMessageDTO.getAuthor(); // 이메일
        Long apno = Long.parseLong(chatMessageDTO.getRoom()); // 상품번호
        int bidAmount = Integer.parseInt(chatMessageDTO.getMessage()); // 입찰가격
        String bidTime = chatMessageDTO.getTime(); // 시간
        log.info("chat"+chatMessageDTO);
        // UserRepository를 사용하여 이메일에 해당하는 사용자 정보 가져오기
        Optional<User> result = userRepository.findByEmail(email);
        User bidder = result.orElseThrow();

        // AuctionRepository를 사용하여 상품번호에 해당하는 경매 정보 가져오기
        Auction auction = auctionRepository.findById(apno).orElse(null);
        // Auction의 현재 가격 업데이트
        assert auction != null;
        auction.updateCurrentPrice(bidAmount);
        auctionRepository.save(auction);
        // 필요한 정보가 없으면 null 반환
        // AuctionBidding 객체 생성
        AuctionBidding auctionBidding = AuctionBidding.builder()
                .auction(auction)
                .bidder(bidder)
                .bidAmount(bidAmount)
                .bidTime(bidTime)
                .build();
        // 옥션 바이딩 저장
        return auctionBiddingRepository.save(auctionBidding);
    }
    @Override
    public List<AuctionBiddingDTO> findAuctionBiddingByEmail(String email) {
        List<AuctionBidding> auctionBiddingList = auctionBiddingRepository.findHighestBidByAuctionApno(email);

        // 옥션 바이딩 정보를 AuctionBiddingDTO로 변환하여 리스트에 추가
        List<AuctionBiddingDTO> auctionBiddingDTOList = new ArrayList<>();
        for (AuctionBidding auctionBidding : auctionBiddingList) {
            AuctionBiddingDTO auctionBiddingDTO = new AuctionBiddingDTO();

            // 수동으로 매핑 설정
            auctionBiddingDTO.setApno(auctionBidding.getApno());
            auctionBiddingDTO.setBidAmount(auctionBidding.getBidAmount());
            auctionBiddingDTO.setBidTime(auctionBidding.getBidTime());

            // AuctionBidding 객체에서 Auction 객체 가져오기
            Auction auction = auctionBidding.getAuction();

            // Auction 객체가 null이 아닌 경우에만 추가 정보 설정
            if (auction != null) {
                // Auction 객체에서 필요한 정보들을 DTO에 설정
                auctionBiddingDTO.setApName(auction.getApName());
                auctionBiddingDTO.setAuctionApno(auction.getApno());
                auctionBiddingDTO.setApStatus(String.valueOf(auction.getApStatus()));
                auctionBiddingDTO.setBidderEmail(auction.getApBuyer());
                auctionBiddingDTO.setCurrentPrice(auction.getApCurrentPrice());
                auctionBiddingDTO.setBidIncrement(auction.getApBidIncrement());
                auctionBiddingDTO.setStartPrice(auction.getApStartPrice());

                // Auction 객체에서 이미지 파일 이름들을 가져와서 DTO에 설정
                List<String> uploadFileNames = new ArrayList<>();
                for (AuctionImage image : auction.getImageList()) {
                    uploadFileNames.add(image.getFileName());
                }
                auctionBiddingDTO.setUploadFileNames(uploadFileNames);
            }

            // 리스트에 추가
            auctionBiddingDTOList.add(auctionBiddingDTO);
        }

        return auctionBiddingDTOList;
    }



    @Override
    public void sendPreviousBidHistory(Long room, WebSocketSession session) {
        // 경매에서 사용한 옥션 바이딩 도메인을 챗 형식으로 변환하고 해당하는 room 에 전부 쏩니다.
        // 아마 1:1 채팅과 오류는 없을겁니다
        List<AuctionBidding> previousChatHistory = auctionBiddingRepository.findByAuction_Apno(room);

        // 경매 채팅 내용이 없는 경우 예외 처리
        if (previousChatHistory.isEmpty()) {
            log.info("No chat history found for the auction.");
            return;
        }

        List<ChatMessageDTO> chatMessageDTOList = previousChatHistory.stream()
                .map(auctionBidding -> {
                    ChatMessageDTO chatMessageDTO = new ChatMessageDTO();
                    chatMessageDTO.setRoom(String.valueOf(auctionBidding.getAuction().getApno()));
                    chatMessageDTO.setMessage(String.valueOf(auctionBidding.getBidAmount()));
                    chatMessageDTO.setMessageType(ChatMessageDTO.MessageType.BID);
                    chatMessageDTO.setAuthor(auctionBidding.getBidder().getEmail());
                    chatMessageDTO.setTime(auctionBidding.getBidTime());
                    return chatMessageDTO;
                })
                .collect(Collectors.toList());

        log.info(chatMessageDTOList);
        // 변환된 채팅 내역을 해당 세션에 전송합니다.
        for (ChatMessageDTO chatMessageDTO : chatMessageDTOList) {
            sendMessage(session, chatMessageDTO);
        }
    }

    private void sendMessage(WebSocketSession session, ChatMessageDTO messageDTO) {
        log.info("----------------------------"+messageDTO);
        try {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(messageDTO)));
        } catch (IOException e) {
            log.error("Error sending message to session {}: {}", session.getId(), e.getMessage(), e);
        }
    }

}
