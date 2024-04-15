package com.recommerceAPI.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Log4j2
@Getter
@Setter
@ToString
// LoginDTO 클래스는 스프링 시큐리티의 User 클래스를 확장하여 사용자의 인증 정보와 추가 정보를 관리합니다.
public class LoginDTO extends User {

    private String email;
    private String pw;
    private String nickname;
    private String phone;
    private String birth;
    // 사용자의 역할 목록을 관리합니다.
    private List<String> roleNames = new ArrayList<>();

    // LoginDTO의 생성자는 사용자 정보와 역할 목록을 받아 초기화합니다.
    // 역할 목록은 Spring Security의 권한 관리에 사용됩니다.
    public LoginDTO(String email, String pw, String nickname, String phone, String birth, List<String> roleNames) {
        super(email, pw, roleNames.stream()
                .map(str -> new SimpleGrantedAuthority("ROLE_" + str))
                .collect(Collectors.toList()));
        this.email = email;
        this.pw = pw;
        this.nickname = nickname;
        this.phone = phone;
        this.birth = birth;
        this.roleNames = roleNames;
    }

    // JWT 토큰 생성 시 사용할 사용자 정보를 Map 형태로 반환합니다.
    // 이 Map은 JWT의 클레임(claim)으로 사용됩니다.
    public Map<String, Object> getClaims() {
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("email", email);
        dataMap.put("pw", pw);
        dataMap.put("nickname", nickname);
        dataMap.put("phone", phone);
        dataMap.put("birth", birth);
        dataMap.put("roleNames", roleNames);

        return dataMap;
    }
}
