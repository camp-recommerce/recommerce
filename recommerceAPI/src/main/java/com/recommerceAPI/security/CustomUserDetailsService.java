package com.recommerceAPI.security;



import java.util.stream.Collectors;


import com.recommerceAPI.domain.User;
import com.recommerceAPI.dto.LoginDTO;
import com.recommerceAPI.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

// 스프링 시큐리티에서 사용자의 인증 정보를 로드하는 데 사용되는 서비스를 정의합니다.
@Service
@Log4j2 // 로깅을 위한 Log4j2 애너테이션
@RequiredArgsConstructor // 필수 생성자(필드에 final이 붙은 멤버 변수에 대한 생성자를 자동 생성)를 위한 Lombok 애너테이션
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository; // 사용자 정보를 조회하기 위한 UserRepository

    // 스프링 시큐리티에서 제공하는 UserDetailsService 인터페이스의 메서드를 구현합니다.
    // username을 매개변수로 받아 해당하는 UserDetails 객체를 반환합니다.
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("-------------- 사용자 이름으로 사용자 정보를 로드하는 중 --------------");

        // UserRepository를 사용해 사용자 정보와 해당 사용자의 권한 정보를 가져옵니다.
        User user = userRepository.getWithRoles(username);

        // 사용자 정보가 없으면 UsernameNotFoundException을 발생시킵니다.
        if(user == null){
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username);
        }

        // User 도메인 객체를 LoginDTO로 변환합니다. LoginDTO는 UserDetails를 구현합니다.
        LoginDTO loginDTO = new LoginDTO(
                user.getEmail(), // 이메일
                user.getPw(), // 비밀번호
                user.getNickname(), // 닉네임
                user.getPhone(), // 전화번호
                user.getBirth(), // 생년월일
                user.getUserRoleList().stream() // 사용자의 권한 목록
                        .map(userRole -> userRole.name()) // 권한 이름을 문자열로 변환
                        .collect(Collectors.toList())); // 리스트로 수집

        log.info("로드된 사용자 정보: " + loginDTO);

        return loginDTO; // UserDetails 객체로 변환된 사용자 정보를 반환
    }
}

