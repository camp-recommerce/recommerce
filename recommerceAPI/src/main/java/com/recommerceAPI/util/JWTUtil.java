package com.recommerceAPI.util;


import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.InvalidClaimException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.Authentication;

// JWTUtil 클래스는 JWT 토큰 생성 및 검증에 사용되는 유틸리티 클래스입니다.
@Log4j2
public class JWTUtil {

    // 비밀키를 정의합니다. 실제 애플리케이션에서는 보안을 위해 복잡하고 예측 불가능한 키를 사용해야 합니다.
    private static String key = "1234567890123456789012345678901234567890";

    // JWT 토큰을 생성하는 메소드입니다. 클레임과 만료 시간(분 단위)을 매개변수로 받습니다.
    public static String generateToken(Map<String, Object> valueMap, int min) {
        SecretKey key = null;

        try {
            // 주어진 문자열로부터 HMAC SHA 키를 생성합니다.
            key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }

        // JWT 토큰을 생성합니다.
        String jwtStr = Jwts.builder()
                .setHeader(Map.of("typ", "JWT")) // 헤더 설정
                .setClaims(valueMap) // 클레임 설정
                .setIssuedAt(Date.from(ZonedDateTime.now().toInstant())) // 발행 시간 설정
                .setExpiration(Date.from(ZonedDateTime.now().plusMinutes(min).toInstant())) // 만료 시간 설정
                .signWith(key) // 키로 서명
                .compact(); // 토큰 생성

        return jwtStr;
    }

    // JWT 토큰을 검증하고 클레임을 반환하는 메소드입니다.
    public static Map<String, Object> validateToken(String token) {
        Map<String, Object> claim = null;

        try {
            SecretKey key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));

            // 토큰을 파싱하여 클레임을 얻습니다. 서명 검증이 포함됩니다.
            claim = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (MalformedJwtException e) {
            throw new CustomJWTException("MalFormed");
        } catch (ExpiredJwtException e) {
            throw new CustomJWTException("Expired");
        } catch (InvalidClaimException e) {
            throw new CustomJWTException("Invalid");
        } catch (JwtException e) {
            throw new CustomJWTException("JWTError");
        } catch (Exception e) {
            throw new CustomJWTException("Error");
        }
        return claim;
    }

    // JWT 토큰이 만료되었는지 확인하는 메소드
    public static boolean isTokenExpired(Authentication authentication) {
        // authentication 객체에서 토큰을 가져옵니다.
        Object token = authentication.getCredentials();

        // 토큰을 문자열로 변환하여 토큰이 만료되었는지 확인합니다.
        try {
            Map<String, Object> claims = validateToken(token.toString());
            // 토큰이 유효하면 false 반환
            return false;
        } catch (ExpiredJwtException e) {
            // 토큰이 만료되었으면 true 반환
            return true;
        }
    }

    // 새로운 토큰을 생성하는 메소드
    public static String refreshToken(Authentication authentication) {
        try {
            // authentication 객체에서 토큰을 가져옵니다.
            Object token = authentication.getCredentials();
            // 만료된 토큰을 검증하고 클레임을 가져옵니다.
            Map<String, Object> claims = validateToken(token.toString());

            // 기존 토큰에서 이메일 정보를 가져옵니다.
            String email = (String) claims.get("email");

            // 새로운 토큰을 생성합니다.
            String newToken = generateToken(claims, 30); // 예: 15분 동안 유효한 토큰 생성

            return newToken;
        } catch (CustomJWTException e) {
            // 만료된 토큰 검증 실패 시 예외 처리
            throw new RuntimeException("Failed to refresh token: " + e.getMessage());
        }
    }
}
