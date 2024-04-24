package com.recommerceAPI.service;

import com.recommerceAPI.domain.SaleItem;
import com.recommerceAPI.dto.SaleItemDTO;
import com.recommerceAPI.dto.SaleItemListDTO;
import com.recommerceAPI.repository.SaleItemRepository;
import com.recommerceAPI.repository.SaleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 판매 관련 서비스를 처리하는 서비스 계층 클래스입니다.
 * 이 클래스는 판매 아이템의 조회, 생성, 삭제 등의 기능을 제공합니다.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class SaleServiceImpl implements SaleService {

    private final SaleItemRepository saleItemRepository;
    private final SaleRepository saleRepository;
    private final ModelMapper modelMapper;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * 주어진 사용자의 이메일을 기반으로 판매 아이템 목록을 조회합니다.
     * @param email 조회할 사용자의 이메일 주소입니다.
     * @return SaleItemListDTO 객체 리스트로 판매 아이템 목록을 반환합니다.
     */
    @Override
    public List<SaleItemListDTO> getSaleItems(String email) {
        return saleItemRepository.getItemsOfSaleListDTOByEmail(email);
    }

    /**
     * 주어진 판매 아이템 ID로 아이템을 삭제하고, 관련된 사용자의 업데이트된 판매 아이템 목록을 반환합니다.
     * @param sino 삭제할 판매 아이템의 ID입니다.
     * @return 삭제 후 남은 판매 아이템 목록을 SaleItemListDTO 리스트로 반환합니다.
     */
    @Override
    public List<SaleItemListDTO> remove(Long sino) {
        saleItemRepository.deleteById(sino);
        String email = getEmailBySino(sino);
        return getSaleItems(email);
    }

    /**
     * 제공된 SaleItemDTO 정보를 바탕으로 새로운 판매 아이템을 생성하고, 생성된 아이템의 정보를 반환합니다.
     * @param saleItemDTO 생성할 판매 아이템의 DTO 정보입니다.
     * @return 생성된 판매 아이템 정보를 SaleItemDTO 객체로 반환합니다.
     */
    @Override
    public SaleItemDTO createSaleItem(SaleItemDTO saleItemDTO) {
        SaleItem saleItem = modelMapper.map(saleItemDTO, SaleItem.class);
        SaleItem savedSaleItem = saleItemRepository.save(saleItem);
        return modelMapper.map(savedSaleItem, SaleItemDTO.class);
    }

    /**
     * 주어진 판매 아이템 ID를 통해 판매자의 이메일 주소를 조회합니다.
     * @param sino 조회할 판매 아이템의 ID입니다.
     * @return 조회된 판매자의 이메일 주소를 반환합니다. 조회되지 않을 경우 null을 반환합니다.
     */
    private String getEmailBySino(Long sino) {
        SaleItem saleItem = saleItemRepository.findById(sino).orElse(null);
        return saleItem != null ? saleItem.getSale().getSeller().getEmail() : null;
    }
}
