package com.recommerceAPI.service;

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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Log4j2
@RequiredArgsConstructor
public class AuctionBiddingServiceImpl implements AuctionBiddingService{

    private final AuctionBiddingRepository auctionBiddingRepository;
    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    // ChatMessageDTO를 받아서 옥션 바이딩 객체를 저장하는 메소드
    @Override
    public AuctionBidding saveAuctionBidding(ChatMessageDTO chatMessageDTO){
        // ChatMessageDTO에서 필요한 정보 추출
        String email = chatMessageDTO.getAuthor(); // 이메일
        Long apno = Long.parseLong(chatMessageDTO.getRoom()); // 상품번호
        int bidAmount = Integer.parseInt(chatMessageDTO.getMessage()); // 입찰가격
        String bidTime = chatMessageDTO.getTime(); // 시간

        // UserRepository를 사용하여 이메일에 해당하는 사용자 정보 가져오기
        Optional<User> result = userRepository.findByEmail(email);
        User bidder = result.orElseThrow();

        // AuctionRepository를 사용하여 상품번호에 해당하는 경매 정보 가져오기
        Auction auction = auctionRepository.findById(apno).orElse(null);
        // Auction의 현재 가격 업데이트
        auction.updateCurrentPrice(bidAmount);
        auctionRepository.save(auction);

        // 필요한 정보가 없으면 null 반환
        if ( auction == null) {
            return null;
        }
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
    public List<AuctionBiddingDTO> findAuctionBiddingByEmailAndAuctionApno(String email, Long apno) {
        List<AuctionBidding>  auctionBiddingList =  auctionBiddingRepository.findByBidderEmailAndAuctionApno(email, apno);


        // 옥션 바이딩 정보를 AuctionBiddingDTO로 변환하여 리스트에 추가
        List<AuctionBiddingDTO> auctionBiddingDTOList = new ArrayList<>();
        for (AuctionBidding auctionBidding : auctionBiddingList) {
            AuctionBiddingDTO auctionBiddingDTO = modelMapper.map(auctionBidding, AuctionBiddingDTO.class);
            auctionBiddingDTOList.add(auctionBiddingDTO);
        }


        return auctionBiddingDTOList;
    }
}
