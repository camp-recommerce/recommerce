package com.recommerceAPI.config;


import com.recommerceAPI.domain.*;
import com.recommerceAPI.repository.AuctionRepository;
import com.recommerceAPI.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.recommerceAPI.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@RequiredArgsConstructor
@Configuration
@Log4j2
public class InputData {

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    private final AuctionRepository auctionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    LocalDate date = LocalDate.of(2024, 12, 31);

    @Bean
       CommandLineRunner initData() {
           return args -> {
               log.info("Creating initial data");

               // User 객체 생성 예시
               User user1 = User.builder()
                       .email("user1@example.com")
                       .pw(passwordEncoder.encode("1111"))
                       .nickname("nickname1")
                       .phone("010-1234-5678")
                       .birth("1990-01-01")
                       .averageRating(4.5)
                       .postcode("12345")
                       .address("Some street 123")
                       .addressDetail("Apartment 101")
                       .build();
               user1.addRole(UserRole.ADMIN);

               User user2 = User.builder()
                       .email("user2@example.com")
                       .pw(passwordEncoder.encode("2222"))
                       .nickname("nickname2")
                       .phone("010-8765-4321")
                       .birth("1992-02-02")
                       .averageRating(4.8)
                       .postcode("54321")
                       .address("Another street 321")
                       .addressDetail("Apartment 202")
                       .build();

               // 더 많은 유저를 생성하고 싶다면 여기에 추가

               // UserRepository를 사용하여 데이터베이스에 저장
               userRepository.save(user1);
               userRepository.save(user2);
               // 저장 로그 출력
               log.info("Saved user1 and user2");


// Product 객체 생성 및 저장을 반복문을 사용하여 처리
            for (int i = 0; i < 30; i++) {
                Product product = Product.builder()
                        .pname("product" + i)
                        .pcategory("Electronics")
                        .price(100 + i) // 예: 가격을 조금씩 다르게 설정
                        .pstate("New")
                        .plocat("Seoul")
                        .addressLine("Gangnam")
                        .lat(37.4979)
                        .lng(127.0276)
                        .pdesc("Description for product" + i)
                        .delFlag(false)
                        .soldOut(false)
                        .userEmail(user1.getEmail()) // 연관된 사용자 이메일
                        .build();

                product.addImageString("bag.jpg");
                productRepository.save(product);
            }

            log.info("Saved user1 and 30 products");


            // Auction 객체 생성 및 저장을 반복문을 사용하여 처리
            for (int i = 1; i <= 10; i++) {
                LocalTime startTime = LocalTime.of(11 + i, 0);
                LocalTime closingTime = LocalTime.of(12 + i, 59);

                Auction auction = Auction.builder()
                        .apName("Auction Product Name " + i)
                        .apDesc("Auction Product Description " + i)
                        .apCategory("Auction Product Category" + i)
                        .apStartPrice(5000 * i)
                        .apBidIncrement(500 * i)
                        .apStartTime(LocalDateTime.of(date, startTime))
                        .apClosingTime(LocalDateTime.of(date, closingTime))
                        .apStatus(AuctionStatus.PENDING)
                        .build();

                // 이미지 추가
                auction.addImageString("auctionbag.jpg");

                auctionRepository.save(auction);
                log.info("Saved Auction Product Name {}", i);
            }

            log.info("Saved 10 auctions");
        };

       }
   }