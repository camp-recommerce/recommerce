package com.recommerceAPI.service;

import com.recommerceAPI.domain.PurchaseItem;
import com.recommerceAPI.dto.PurchaseItemListDTO;
import com.recommerceAPI.repository.PurchaseItemRepository;
import com.recommerceAPI.repository.PurchaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseServiceImpl implements PurchaseService {

    private final PurchaseItemRepository purchaseItemRepository;
    private final PurchaseRepository purchaseRepository;


    @Override
    public List<PurchaseItemListDTO> getPurchaseItems(String email) {
        // 사용자의 이메일을 기반으로 구매 아이템 목록을 조회하여 반환합니다.
        return purchaseItemRepository.getItemsOfPurchaseListDTOByEmail(email);
    }

    @Override
    public List<PurchaseItemListDTO> remove(Long puino) {
        // 주어진 puino에 해당하는 구매 아이템을 삭제합니다.
        purchaseItemRepository.deleteById(puino);

        // 삭제 후 해당 구매 아이템이 연결된 사용자의 이메일을 조회하여 구매 아이템 목록을 반환합니다.
        String email = getEmailByPuino(puino);
        return getPurchaseItems(email);
    }

    private String getEmailByPuino(Long puino) {
        PurchaseItem purchaseItem = purchaseItemRepository.findById(puino).orElse(null);
        if (purchaseItem != null) {
            return purchaseItem.getPurchase().getBuyer().getEmail();
        } else {
            return null;
        }
    }

}