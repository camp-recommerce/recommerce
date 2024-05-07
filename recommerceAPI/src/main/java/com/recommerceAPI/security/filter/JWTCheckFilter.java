package com.recommerceAPI.security.filter;



import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.recommerceAPI.dto.LoginDTO;
import com.recommerceAPI.util.JWTUtil;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

// 로그와 함께 JWT 검증을 위한 필터 정의. 모든 요청에 대해서 실행됩니다.
@Log4j2
public class JWTCheckFilter extends OncePerRequestFilter {

    // 특정 요청에 대해 필터를 건너뛸지 결정하는 메소드입니다.
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // OPTIONS 메소드 요청(일반적으로 CORS 사전 요청)은 필터링하지 않습니다.
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        }

        String path = request.getRequestURI();
        log.info("check uri: " + path);

        // 루트 경로 "/"만 필터링하지 않고, 이 경로의 하위 경로는 필터링합니다.
         if ("/".equals(path)) {
             return true;
         }

        // 특정 경로에 대한 요청은 필터링하지 않도록 설정합니다.

        List<String> skipPaths = List.of("/api/user/", "review/view", "/confirm",
                "/api/wishlist","/api/chat","/auction","/product/read" ,"/product/view", "/user/by-user",
                "/user/password"
        );


        return skipPaths.stream().anyMatch(path::startsWith);
    }

    // 실제 필터링 로직. JWT 토큰을 검증하고 인증 정보를 SecurityContext에 설정합니다.
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException {

        log.info("------ JWTCheckFilter ------");

        String authHeaderStr = request.getHeader("Authorization");

        try {
            if (authHeaderStr != null && authHeaderStr.startsWith("Bearer ")) {
                // Authorization 헤더에서 "Bearer " 부분을 제거하여 토큰을 추출합니다.
                String accessToken = authHeaderStr.substring(7);
                // 토큰 검증을 수행하고 클레임을 추출합니다.
                Map<String, Object> claims = JWTUtil.validateToken(accessToken);

                log.info("JWT claims: " + claims);

                // 추출한 클레임으로부터 사용자 정보를 구성합니다.
                LoginDTO loginDTO = new LoginDTO(
                        (String) claims.get("email"),
                        (String) claims.get("pw"),
                        (String) claims.get("nickname"),
                        (String) claims.get("phone"),
                        (String) claims.get("birth"),
                        (List<String>) claims.get("roleNames")
                );

                log.info("User Details: " + loginDTO);

                // Spring Security 인증 토큰을 생성하고, SecurityContext에 설정합니다.
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginDTO, null, loginDTO.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);

                // 다음 필터로 요청을 전달합니다.
                filterChain.doFilter(request, response);
            } else {
                // Authorization 헤더가 없거나 "Bearer "로 시작하지 않는 경우에 대한 처리
                throw new ServletException("Missing or invalid Authorization header");
            }
        } catch (Exception e) {
            // 토큰 검증 중 오류가 발생하면 에러 메시지를 반환합니다.
            log.error("JWT Check Error: ", e);
            Gson gson = new Gson();
            String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));
            response.setContentType("application/json");
            PrintWriter printWriter = response.getWriter();
            printWriter.println(msg);
            printWriter.close();
        }
    }

}
