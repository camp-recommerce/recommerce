package com.recommerceAPI.repository;

import com.recommerceAPI.domain.Product;
import com.recommerceAPI.domain.Sale;
import com.recommerceAPI.domain.SaleItem;
import com.recommerceAPI.domain.User;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@SpringBootTest
@Log4j2
public class SaleItemRepositoryTests {

    @Autowired
    SaleItemRepository saleItemRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    SaleRepository saleRepository;

    @Test
    public void testInsertSaleItems() {
        // Dummy user creation for the test
        User user = User.builder()
                .email("user1@aaa.com")
                .nickname("user1")
                .build();

        userRepository.save(user);

        String[] categories = {"신발", "옷", "시계", "기타"};
        String[] states = {"최상", "상", "중", "하"};
        int[] prices = {10000, 20000, 30000, 40000};
        String[] addresses = {"종로", "을지로", "명동", "홍대"};

        for (int i = 0; i < 50; i++) {
            Product product = Product.builder()
                    .pname("상품 " + i)
                    .pcategory(categories[i % categories.length])
                    .price(prices[i % prices.length])
                    .pstate(states[i % states.length])
                    .plocat("장소 " + i)
                    .addressLine(addresses[i % addresses.length])
                    .lat(37.0 + (0.001 * i))
                    .lng(127.0 + (0.001 * i))
                    .pdesc("상품 상세 " + i)
                    .delFlag(false)
//                    .user(user)
                    .build();

            productRepository.save(product);

            // Sale 객체 생성
            Sale sale = Sale.builder()
                    .seller(user) // 여기서 user는 판매자 정보를 담은 User 객체입니다.
                    .build();
            saleRepository.save(sale);

            SaleItem saleItem = SaleItem.builder()
                    .product(product)
                    .addressLine(product.getAddressLine())  // 예를 들어 product의 addressLine을 SaleItem에 복사
                    .pcategory(product.getPcategory())      // 예를 들어 product의 pcategory를 SaleItem에 복사
                    .price(product.getPrice())              // 예를 들어 product의 price를 SaleItem에 복사
                    .build();

            saleItemRepository.save(saleItem);
        }
    }
}
