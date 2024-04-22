package com.recommerceAPI.repository;


import com.recommerceAPI.domain.Product;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Log4j2
public class ProductRepositoryTests {

@Autowired
  ProductRepository productRepository;

  @Test
  public void testInsert() {

      for (int i = 0; i < 100; i++) {

          Product product = Product.builder()
                  .pname("상품"+i)
                  .pstate("최상")
                  .plocat("을지로")
                  .pcategory("기타")
                  .price(100*i)
                  .pdesc("상품설명 " + i)
                  .build();

//          //2개의 이미지 파일 추가
//          product.addImageString("IMAGE1.jpg");
//          product.addImageString("IMAGE2.jpg");

          productRepository.save(product);


      }
  }
  }