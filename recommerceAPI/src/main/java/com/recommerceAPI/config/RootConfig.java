package com.recommerceAPI.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// RootConfig 클래스는 스프링 어플리케이션의 중앙 설정을 정의하는 클래스입니다.
// @Configuration 애너테이션을 사용해 이 클래스가 스프링의 설정 정보를 제공한다는 것을 나타냅니다.
@Configuration
public class RootConfig {

    // @Bean 애너테이션을 사용해 스프링 컨테이너에 ModelMapper 빈을 등록합니다.
    // 이 메서드는 ModelMapper 인스턴스를 생성, 설정, 반환하며 스프링이 관리하는 빈으로 사용됩니다.
    @Bean
    public ModelMapper getMapper() {
        // ModelMapper 인스턴스를 생성합니다.
        ModelMapper modelMapper = new ModelMapper();

        // ModelMapper의 구성 설정을 진행합니다.
        modelMapper.getConfiguration()
                // 필드 간 매칭을 활성화하여 모델 간의 매핑 시 필드명이 같을 경우 자동으로 매핑하도록 합니다.
                .setFieldMatchingEnabled(true)
                // 접근 수준을 PRIVATE로 설정하여 비공개 필드도 매핑 대상에 포함시킵니다.
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE)
                // 매칭 전략을 LOOSE로 설정하여, 타입이 정확히 일치하지 않아도 되는 더 유연한 매핑을 가능하게 합니다.
                .setMatchingStrategy(MatchingStrategies.LOOSE);

        // 구성된 ModelMapper 인스턴스를 반환합니다.
        return modelMapper;
    }
}