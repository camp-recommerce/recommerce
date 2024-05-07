package com.recommerceAPI.service;

import com.recommerceAPI.domain.Auction;
import com.recommerceAPI.domain.AuctionImage;
import com.recommerceAPI.dto.AuctionDTO;
import com.recommerceAPI.dto.PageRequestDTO;
import com.recommerceAPI.dto.PageResponseDTO;
import com.recommerceAPI.repository.AuctionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.recommerceAPI.domain.AuctionStatus;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class AuctionServiceImpl implements AuctionService{

    private final ModelMapper modelMapper;

    private final AuctionRepository auctionRepository;

    @Override
    public Long register(AuctionDTO auctionDTO) {
        log.info("------------------------");
        Auction auction = modelMapper.map(auctionDTO, Auction.class);

        List<String> uploadFileNames = auctionDTO.getUploadFileNames();

        // 업로드된 파일 이름 리스트가 null이 아닌 경우에만 처리합니다.
        if (uploadFileNames != null) {
            uploadFileNames.stream().forEach(uploadName -> {
                auction.addImageString(uploadName);
            });
        }


        Auction savedAuction = auctionRepository.save(auction);

        return savedAuction.getApno();
    }

    @Override
    public AuctionDTO get(Long apno) {
        java.util.Optional<Auction> result = auctionRepository.findById(apno);

        Auction auction = result.orElseThrow();

        List<String> fileNameList = auction.getImageList().stream()
                .map(AuctionImage::getFileName)
                .collect(Collectors.toList());

        AuctionDTO dto = modelMapper.map(auction, AuctionDTO.class);

        dto.setUploadFileNames(fileNameList);

        return dto;
    }
    @Override
    public void  buy (Long apno) {
        java.util.Optional<Auction> result = auctionRepository.findById(apno);

        Auction auction = result.orElseThrow();

        auction.setDeleted(true);

        auctionRepository.save(auction);

    }

    @Override
    public void modify(AuctionDTO auctionDTO) {
        Optional<Auction> result = auctionRepository.findById(auctionDTO.getApno());

        Auction auction = result.orElseThrow();
        auction.changeName(auctionDTO.getApName());
        auction.changeDesc(auctionDTO.getApDesc());
        auction.changeCat(auctionDTO.getApCategory());
        auction.changePrice(auctionDTO.getApStartPrice());
        auction.changeIncrement(auctionDTO.getApBidIncrement());
        auction.changeStartTime(auctionDTO.getApStartTime());
        auction.changeClosingTime(auctionDTO.getApClosingTime());
        auction.changeStatus(auctionDTO.getApStatus());

        auction.clearList();

        if (auctionDTO.getUploadFileNames() != null) {
            for (String fileName : auctionDTO.getUploadFileNames()) {
                auction.addImageString(fileName);
            }
        }

        auctionRepository.save(auction);
    }

    @Override
    public PageResponseDTO<AuctionDTO>findByApBuyer(PageRequestDTO pageRequestDTO,String apBuyer){

        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage()-1,
                pageRequestDTO.getSize(),
                Sort.by("apno").descending());

        Page<Object[]> result = auctionRepository.findByApBuyer(pageable,apBuyer);

        List<AuctionDTO> dtoList = result.getContent().stream()
                .map(arr -> {
                    Auction auction = (Auction) arr[0];
                    AuctionImage auctionImage = (AuctionImage) arr[1];
                    AuctionDTO auctionDTO = modelMapper.map(auction, AuctionDTO.class);
                    if (auctionImage != null) {
                        auctionDTO.setUploadFileNames(Collections.singletonList(auctionImage.getFileName()));
                    }
                    return auctionDTO;
                }).collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        PageResponseDTO<AuctionDTO> responseDTO = PageResponseDTO.<AuctionDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();

        return responseDTO;


    }
    @Override
    public void remove(Long apno) {
        Auction auction = auctionRepository.findById(apno)
                .orElseThrow(() -> new EntityNotFoundException("Auction not found with apno: " + apno));
        auction.setDeleted(true); // delFlag를 1로 설정
        auctionRepository.save(auction);


    }

    @Override
    public PageResponseDTO<AuctionDTO> getList(PageRequestDTO pageRequestDTO, String apName, String apCategory, AuctionStatus apStatus) {
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("apStartTime").descending());



        Page<Object[]> result = auctionRepository.selectList(apName, apCategory, apStatus, pageable);

        List<AuctionDTO> dtoList = result.getContent().stream()
                .map(arr -> {
                    Auction auction = (Auction) arr[0];
                    AuctionImage auctionImage = (AuctionImage) arr[1];
                    AuctionDTO auctionDTO = modelMapper.map(auction, AuctionDTO.class);
                    if (auctionImage != null) {
                        auctionDTO.setUploadFileNames(Collections.singletonList(auctionImage.getFileName()));
                    }
                    return auctionDTO;
                }).collect(Collectors.toList());

        long totalCount = result.getTotalElements();

        PageResponseDTO<AuctionDTO> responseDTO = PageResponseDTO.<AuctionDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();

        return responseDTO;
    }

}
