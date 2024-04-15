package com.recommerceAPI.security.handler;


import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;


import com.recommerceAPI.dto.LoginDTO;
import com.recommerceAPI.util.JWTUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.google.gson.Gson;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

// 로그인 성공 시 호출되는 핸들러 클래스를 정의합니다.
@Log4j2
public class APILoginSuccessHandler implements AuthenticationSuccessHandler{

    // 인증 성공 후 실행되는 메서드입니다.
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException{
        // 로그인 성공 정보를 로깅합니다.
        log.info("-------------------------------");
        log.info(authentication);
        log.info("-------------------------------");

        // 인증 정보에서 LoginDTO 객체를 가져옵니다.
        LoginDTO loginDTO = (LoginDTO)authentication.getPrincipal();

        // LoginDTO로부터 JWT 토큰을 생성하기 위한 클레임 정보를 가져옵니다.
        Map<String, Object> claims  = loginDTO.getClaims();

        // JWTUtil을 사용하여 액세스 토큰과 리프레시 토큰을 생성합니다.
        String accessToken = JWTUtil.generateToken(claims, 10); // 액세스 토큰 유효 시간: 10분
        String refreshToken = JWTUtil.generateToken(claims,60*24); // 리프레시 토큰 유효 시간: 1일

        // 클레임에 액세스 토큰과 리프레시 토큰을 추가합니다.
        claims.put("accessToken",accessToken);
        claims.put("refreshToken",refreshToken);

        // Gson 객체를 사용하여 클레임 맵을 JSON 문자열로 변환합니다.
        Gson gson = new Gson();
        String jsonStr = gson.toJson(claims);

        // 응답의 컨텐츠 타입을 JSON으로 설정합니다.
        response.setContentType("application/json; charset=UTF-8");

        // 응답에 JSON 문자열을 쓰고 출력 스트림을 닫습니다.
        PrintWriter printWriter = response.getWriter();
        printWriter.println(jsonStr);
        printWriter.close();
    }
}
