package com.recommerceAPI.service;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.recommerceAPI.domain.*;
import com.recommerceAPI.dto.UserProfileDTO;
import com.recommerceAPI.repository.UserProfileRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Transactional(readOnly = true)
    public UserProfileDTO getUserProfileByEmail(String email) {
        UserProfile userProfile = userProfileRepository.findById(email).orElse(null);
        if (userProfile != null) {
            return new UserProfileDTO(
                    userProfile.getEmail(),
                    userProfile.getTopPurchaseCategory(),
                    userProfile.getTopSaleCategory(),
                    userProfile.getAveragePrice(),
                    userProfile.getTopSellingLocation()
            );
        }
        return null; // 또는 적절한 예외 처리
    }

    @Transactional
    @EventListener
    public void handleSaleItemAddedEvent(SaleItem.SaleItemAddedEvent event) {
        SaleItem saleItem = event.getSaleItem();
        User user = saleItem.getUser();
        UserProfile userProfile = userProfileRepository.findByUser(user);

        if (userProfile != null) {
            // 업데이트 로직 추가
            userProfile.setTopSaleCategory(saleItem.getPcategory());
            userProfile.setAveragePrice((double) saleItem.getPrice());
            userProfile.setTopSellingLocation(saleItem.getAddressLine());

            userProfileRepository.save(userProfile);
        }
    }

    @Transactional
    @EventListener
    public void handlePurchaseItemAddedEvent(PurchaseItem.PurchaseItemAddedEvent event) {
        PurchaseItem purchaseItem = event.getPurchaseItem();
        User user = purchaseItem.getUser();
        UserProfile userProfile = userProfileRepository.findByUser(user);

        if (userProfile != null) {
            // 구매 정보 업데이트 로직
            userProfile.setTopPurchaseCategory(purchaseItem.getProduct().getPcategory());

            userProfileRepository.save(userProfile);
        }
    }
}