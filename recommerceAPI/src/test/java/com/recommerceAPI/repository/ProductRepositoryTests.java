package com.recommerceAPI.repository;


import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;

import com.recommerceAPI.domain.Product;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class ProductRepositoryTests {

    @Autowired
    ProductRepository productRepository;

    @Test
    public void testInsert() {

        for (int i = 0; i < 50; i++) {

            Product product = Product.builder()
                    .pname("상품" + i)
                    .price(100 * i)
                    .pdesc("상품설명 " + i)
                    .build();

            //2개의 이미지 파일 추가
            product.addImageString("https://img.freepik.com/free-photo/bag-hanging-from-furniture-item-indoors_23-2151073503.jpg?t=st=1713242933~exp=1713246533~hmac=23d3e7ec7fc0bc3241934ddf1d3313a2e3b9e8dc1e44da30746e672bd2291743&w=740");
            product.addImageString("https://kr.freepik.com/free-photo/bag-hanging-from-furniture-item-indoors_94515258.htm#fromView=search&page=3&position=44&uuid=2610c634-d209-442e-b32b-ac57bc0e2d4c");

            productRepository.save(product);

            log.info("-------------------");
        }
    }

    @Transactional
    @Test
    public void testRead() {

        Long pno = 1L;

        Optional<Product> result = productRepository.findById(pno);

        Product product = result.orElseThrow();

        log.info("1-----------" + product);
        log.info("2------------" + product.getImageList());

    }

    @Test
    public void testRead2() {

        Long pno = 1L;

        Optional<Product> result = productRepository.selectOne(pno);

        Product product = result.orElseThrow();

        log.info("1-----------" + product);
        log.info("2------------" + product.getImageList());

    }

    @Commit
    @Transactional
    @Test
    public void testDelte() {

        Long pno = 2L;

        productRepository.updateToDelete(pno, true);

    }

    @Test
    public void testUpdate() {// 상품의 설명이나 가격변동, 이미지 3개도 변경

        Long pno = 10L;

        Product product = productRepository.selectOne(pno).get();

        product.changeName("10번 상품");
        product.changeDesc("10번 상품 설명입니다.");
        product.changePrice(5000);

        //첨부파일 수정
        product.clearList();

        product.addImageString(UUID.randomUUID().toString() + "_" + "NEWIMAGE1.jpg");
        product.addImageString(UUID.randomUUID().toString() + "_" + "NEWIMAGE2.jpg");
        product.addImageString(UUID.randomUUID().toString() + "_" + "NEWIMAGE3.jpg");

        productRepository.save(product);

    }
}