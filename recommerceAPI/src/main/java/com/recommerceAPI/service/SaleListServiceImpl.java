package com.recommerceAPI.service;

import com.recommerceAPI.domain.SaleList;
import com.recommerceAPI.domain.SaleListItem;
import com.recommerceAPI.dto.SaleListDTO;
import com.recommerceAPI.dto.SaleListItemDTO;
import com.recommerceAPI.repository.SaleListRepository;
import com.recommerceAPI.repository.SaleListItemRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * SaleListService 인터페이스의 구현체입니다.
 * 판매 목록과 판매 아이템에 대한 데이터 처리를 담당합니다.
 */
@RequiredArgsConstructor
@Service
public class SaleListServiceImpl implements SaleListService {

    @Autowired
    private SaleListRepository saleListRepository;

    @Autowired
    private SaleListItemRepository saleListItemRepository;

    @Autowired
    private ModelMapper modelMapper;

    // 주어진 ID를 가진 판매 목록을 조회합니다.
    @Override
    @Transactional(readOnly = true)
    public SaleListDTO getSaleList(Long sno) {
        SaleList saleList = saleListRepository.findById(sno)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 판매 목록을 찾을 수 없습니다: " + sno));
        return modelMapper.map(saleList, SaleListDTO.class);
    }

    // 주어진 ID를 가진 판매 아이템을 조회합니다.
    @Override
    @Transactional(readOnly = true)
    public SaleListItemDTO getSaleListItem(Long sino) {
        SaleListItem saleItem = saleListItemRepository.findById(sino)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 판매 아이템을 찾을 수 없습니다: " + sino));
        return modelMapper.map(saleItem, SaleListItemDTO.class);
    }

    // 특정 판매 목록에 속하는 모든 판매 아이템을 조회합니다.
    @Override
    @Transactional(readOnly = true)
    public List<SaleListItemDTO> listSaleItemsInSale(Long sno) {
        List<SaleListItem> items = saleListItemRepository.findBySaleListSno(sno);
        return items.stream()
                .map(item -> modelMapper.map(item, SaleListItemDTO.class))
                .collect(Collectors.toList());
    }

    // 새로운 판매 목록을 생성합니다.
    @Override
    @Transactional
    public SaleListDTO createSaleList(SaleListDTO saleListDTO) {
        SaleList saleList = modelMapper.map(saleListDTO, SaleList.class);
        saleList = saleListRepository.save(saleList);
        return modelMapper.map(saleList, SaleListDTO.class);
    }

    // 특정 판매 목록에 새로운 판매 아이템을 추가합니다.
    @Override
    @Transactional
    public SaleListItemDTO addSaleItemToSaleList(Long sno, SaleListItemDTO saleListItemDTO) {
        SaleList saleList = saleListRepository.findById(sno)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 판매 목록을 찾을 수 없습니다: " + sno));
        SaleListItem saleItem = modelMapper.map(saleListItemDTO, SaleListItem.class);
        saleItem.setSaleList(saleList);
        saleItem = saleListItemRepository.save(saleItem);
        return modelMapper.map(saleItem, SaleListItemDTO.class);
    }

    // 판매 목록 정보를 업데이트합니다.
    @Override
    @Transactional
    public SaleListDTO updateSaleList(SaleListDTO saleListDTO) {
        SaleList existingSaleList = saleListRepository.findById(saleListDTO.getSno())
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 판매 목록을 찾을 수 없습니다: " + saleListDTO.getSno()));
        modelMapper.map(saleListDTO, existingSaleList);
        existingSaleList = saleListRepository.save(existingSaleList);
        return modelMapper.map(existingSaleList, SaleListDTO.class);
    }

    // 주어진 ID의 판매 목록을 삭제합니다.
    @Override
    @Transactional
    public void deleteSaleList(Long sno) {
        if (!saleListRepository.existsById(sno)) {
            throw new IllegalArgumentException("해당 ID의 판매 목록을 찾을 수 없습니다: " + sno);
        }
        saleListRepository.deleteById(sno);
    }

    // 주어진 ID의 판매 아이템을 판매 목록에서 제거합니다.
    @Override
    @Transactional
    public void removeSaleItemFromSaleList(Long sino) {
        if (!saleListItemRepository.existsById(sino)) {
            throw new IllegalArgumentException("해당 ID의 판매 아이템을 찾을 수 없습니다: " + sino);
        }
        saleListItemRepository.deleteById(sino);
    }
}
