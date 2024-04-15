package com.recommerceAPI.security.handler;


import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import com.google.gson.Gson;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

// 로그인 실패 시 처리를 담당하는 핸들러 클래스입니다.
@Log4j2
public class APILoginFailHandler implements AuthenticationFailureHandler{

    // 인증 실패 시 호출되는 메서드입니다.
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception)
            throws IOException{
        // 로그인 실패 정보를 로깅합니다.
        log.info("Login fail...." + exception);
        log.info("Login is not good~~~~~~~~~~~~~~~~~~~~~");

        // Gson 객체를 생성하여 JSON 변환을 처리합니다.
        Gson gson = new Gson();

        // 에러 메시지를 JSON 형태로 변환합니다.
        String jsonStr = gson.toJson(Map.of("error", "ERROR_LOGIN"));

        // 응답의 Content-Type을 application/json으로 설정합니다.
        response.setContentType("application/json");

        // 응답으로 클라이언트에 JSON 문자열을 전송합니다.
        PrintWriter printWriter = response.getWriter();
        printWriter.println(jsonStr);
        printWriter.close(); // PrintWriter를 닫아 리소스를 해제합니다.
    }
}
