package com.recommerceAPI.controller;


import java.util.Map;

import com.recommerceAPI.util.CustomJWTException;
import com.recommerceAPI.util.JWTUtil;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

// 이 컨트롤러는 클라이언트가 제공한 리프레시 토큰을 사용하여 새 액세스 토큰을 생성하고 반환합니다.
@RestController
@RequiredArgsConstructor
@Log4j2
public class RefreshTokenController {

    // '/api/user/refresh' 경로로 요청이 오면 이 메서드가 처리합니다.
    @RequestMapping("/api/user/refresh")
    public Map<String, Object> refresh(@RequestHeader("Authorization") String authHeader, String refreshToken) {

        // 리프레시 토큰이 null인 경우, 사용자 정의 예외를 발생시킵니다.
        if (refreshToken == null) {
            throw new CustomJWTException("NULL_REFRASH");
        }

        // Authorization 헤더가 유효하지 않은 경우, 사용자 정의 예외를 발생시킵니다.
        if (authHeader == null || authHeader.length() < 7) {
            throw new CustomJWTException("INVALID_STRING");
        }

        // 액세스 토큰을 추출합니다.
        String accessToken = authHeader.substring(7);

        // 액세스 토큰이 아직 만료되지 않았다면, 기존 토큰들을 그대로 반환합니다.
        if (!checkExpiredToken(accessToken)) {
            return Map.of("accessToken", accessToken, "refreshToken", refreshToken);
        }

        // 리프레시 토큰을 검증하고 클레임을 추출합니다.
        Map<String, Object> claims = JWTUtil.validateToken(refreshToken);
        log.info("refresh ... claims: " + claims);

        // 새 액세스 토큰을 생성합니다.
        String newAccessToken = JWTUtil.generateToken(claims, 10);

        // 리프레시 토큰의 만료 시간이 1시간 미만으로 남았다면 새 리프레시 토큰을 생성합니다.
        String newRefreshToken = checkTime((Integer)claims.get("exp")) ? JWTUtil.generateToken(claims, 60 * 24) : refreshToken;

        // 새 토큰들을 반환합니다.
        return Map.of("accessToken", newAccessToken, "refreshToken", newRefreshToken);
    }

    // 토큰의 만료 시간이 1시간 미만으로 남았는지 확인합니다.
    private boolean checkTime(Integer exp) {
        java.util.Date expDate = new java.util.Date((long)exp * 1000);
        long gap = expDate.getTime() - System.currentTimeMillis();
        long leftMin = gap / (1000 * 60);
        return leftMin < 60;
    }

    // 액세스 토큰이 만료되었는지 확인합니다.
    private boolean checkExpiredToken(String token) {
        try {
            JWTUtil.validateToken(token);
        } catch (CustomJWTException ex) {
            return ex.getMessage().equals("Expired");
        }
        return false;
    }
}
