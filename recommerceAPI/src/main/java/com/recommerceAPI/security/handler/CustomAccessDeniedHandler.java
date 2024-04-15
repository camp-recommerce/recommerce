package com.recommerceAPI.security.handler;


import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// 사용자가 접근 권한이 없는 리소스에 접근하려고 시도할 때 호출되는 핸들러입니다.
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    // 접근 거부 시 실행되는 메서드입니다.
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException, ServletException {

        // Gson 라이브러리를 사용하여 JSON 형태의 응답 메시지를 생성합니다.
        Gson gson = new Gson();
        String jsonStr = gson.toJson(Map.of("error", "ERROR_ACCESSDENIED"));

        // 응답의 Content-Type을 application/json으로 설정합니다.
        response.setContentType("application/json");

        // HTTP 상태 코드를 403(Forbidden)으로 설정합니다.
        response.setStatus(HttpStatus.FORBIDDEN.value());

        // 응답 본문에 JSON 문자열을 작성하고 PrintWriter를 닫아 리소스를 해제합니다.
        PrintWriter printWriter = response.getWriter();
        printWriter.println(jsonStr);
        printWriter.close();
    }
}

