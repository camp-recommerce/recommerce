package com.recommerceAPI.service;

import com.recommerceAPI.domain.SaleItem;
import com.recommerceAPI.dto.SaleItemListDTO;
import com.recommerceAPI.repository.SaleItemRepository;
import com.recommerceAPI.repository.SaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SaleServiceImpl implements SaleService {

    private final SaleItemRepository saleItemRepository;
    private final SaleRepository saleRepository;

    @Override
    public List<SaleItemListDTO> getSaleItems(String email) {
        // 사용자의 이메일을 기반으로 판매 아이템 목록을 조회하여 반환합니다.
        return saleItemRepository.getItemsOfSaleListDTOByEmail(email);
    }

    @Override
    public List<SaleItemListDTO> remove(Long sino) {
        // 주어진 sino에 해당하는 판매 아이템을 삭제합니다.
        saleItemRepository.deleteById(sino);

        // 삭제 후 해당 판매 아이템이 연결된 사용자의 이메일을 조회하여 판매 아이템 목록을 반환합니다.
        String email = getEmailBySino(sino);
        return getSaleItems(email);
    }

    private String getEmailBySino(Long sino) {
        SaleItem saleItem = saleItemRepository.findById(sino).orElse(null);
        if (saleItem != null) {
            return saleItem.getSale().getSeller().getEmail();
        } else {
            return null;
        }
    }
}
