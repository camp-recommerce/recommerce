package com.recommerceAPI.service;

import com.recommerceAPI.domain.Product;
import com.recommerceAPI.domain.UserProfile;
import com.recommerceAPI.dto.UserProfileDTO;
import com.recommerceAPI.repository.ProductRepository;
import com.recommerceAPI.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserProfileServiceImpl implements UserProfileService {

    private final ProductRepository productRepository;

    @Override
    public UserProfileDTO getUserProfileStatisticsByEmail(String email) {
        List<Product> soldProducts = productRepository.findAllByUserEmailAndSoldOutTrue(email);

        String topSaleCategory = soldProducts.stream()
                .collect(Collectors.groupingBy(Product::getPcategory, Collectors.counting()))
                .entrySet().stream().max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey).orElse("None");

        double averagePrice = soldProducts.stream()
                .mapToInt(Product::getPrice).average().orElse(0.0);

        String topSellingLocation = soldProducts.stream()
                .collect(Collectors.groupingBy(Product::getAddressLine, Collectors.counting()))
                .entrySet().stream().max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey).orElse("None");

        return new UserProfileDTO(null, email, null, topSaleCategory, averagePrice, topSellingLocation);
    }
}


