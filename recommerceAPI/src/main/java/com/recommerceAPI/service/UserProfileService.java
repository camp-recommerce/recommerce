package com.recommerceAPI.service;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.recommerceAPI.domain.QSaleItem;
import com.recommerceAPI.domain.QPurchaseItem;
import com.recommerceAPI.dto.UserProfileDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    @PersistenceContext
    private EntityManager entityManager;

    public UserProfileDTO getUserProfile(String email) {
        JPAQueryFactory queryFactory = new JPAQueryFactory(entityManager);
        QSaleItem saleItem = QSaleItem.saleItem;
        QPurchaseItem purchaseItem = QPurchaseItem.purchaseItem;

        // 판매된 상품 카테고리 중 가장 많은 것을 찾음
        String topSellingCategory = queryFactory
                .select(saleItem.product.pcategory)
                .from(saleItem)
                .where(saleItem.sale.seller.email.eq(email))
                .groupBy(saleItem.product.pcategory)
                .orderBy(saleItem.product.pcategory.count().desc())
                .fetchFirst();

        // 구매한 상품 카테고리 중 가장 많은 것을 찾음
        String topPurchaseCategory = queryFactory
                .select(purchaseItem.product.pcategory)
                .from(purchaseItem)
                .where(purchaseItem.purchase.buyer.email.eq(email))
                .groupBy(purchaseItem.product.pcategory)
                .orderBy(purchaseItem.product.pcategory.count().desc())
                .fetchFirst();

        // 평균 판매 가격 계산
        Double averagePrice = queryFactory
                .select(saleItem.price.avg())
                .from(saleItem)
                .where(saleItem.sale.seller.email.eq(email))
                .fetchOne();

        // 가장 많이 판매된 장소
        String topSellingLocation = queryFactory
                .select(saleItem.addressLine)
                .from(saleItem)
                .where(saleItem.sale.seller.email.eq(email))
                .groupBy(saleItem.addressLine)
                .orderBy(saleItem.addressLine.count().desc())
                .fetchFirst();

        return new UserProfileDTO(email, topPurchaseCategory, topSellingCategory, averagePrice, topSellingLocation);
    }
}