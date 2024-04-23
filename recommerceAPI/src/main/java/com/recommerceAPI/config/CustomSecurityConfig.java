package com.recommerceAPI.config;


import com.recommerceAPI.security.filter.JWTCheckFilter;
import com.recommerceAPI.security.handler.APILoginFailHandler;
import com.recommerceAPI.security.handler.APILoginSuccessHandler;
import com.recommerceAPI.security.handler.CustomAccessDeniedHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

// 스프링 시큐리티의 설정을 자바 코드로 정의하는 클래스입니다.
@RequiredArgsConstructor
@Log4j2
@Configuration
@EnableMethodSecurity // 메소드 수준에서 보안 설정을 활성화합니다.
public class CustomSecurityConfig {

    // 비밀번호 암호화를 위한 PasswordEncoder 빈을 생성합니다. BCrypt 알고리즘을 사용합니다.
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    // HttpSecurity를 사용하여 스프링 시큐리티 필터 체인을 정의합니다.
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        log.info("----------start security configure-----------");

        // CORS 설정을 정의합니다.
        http.cors(httpSecurityCorsConfigurer -> {
            httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource());
        });

        // CSRF 보호를 비활성화합니다.
        http.csrf(httpSecurityCsrfConfigurer -> httpSecurityCsrfConfigurer.disable());

        // 세션을 사용하지 않고, STATELESS 정책을 적용하여 REST API에 적합하게 만듭니다.
        http.sessionManagement(sessionConfig ->  sessionConfig.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // 로그인 설정을 정의합니다. 로그인 성공 및 실패 핸들러를 지정합니다.
        http.formLogin(config ->{
            config.loginPage("/api/user/login");
            config.successHandler(new APILoginSuccessHandler());
            config.failureHandler(new APILoginFailHandler());
        });

        // JWTCheckFilter를 UsernamePasswordAuthenticationFilter 전에 추가합니다.
        http.addFilterBefore(new JWTCheckFilter(), UsernamePasswordAuthenticationFilter.class);

        // 권한이 없을 때 처리를 위한 핸들러를 설정합니다.
        http.exceptionHandling(config -> {config.accessDeniedHandler(new CustomAccessDeniedHandler());
        });




        return http.build();
    }

    // CORS 정책을 설정하는 빈을 정의합니다. 여기서는 모든 출처, 메소드, 헤더를 허용하고 있습니다.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("HEAD", "GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
