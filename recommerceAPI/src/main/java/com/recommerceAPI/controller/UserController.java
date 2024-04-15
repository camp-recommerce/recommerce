package com.recommerceAPI.controller;

import com.recommerceAPI.domain.User;
import com.recommerceAPI.dto.LoginDTO;
import com.recommerceAPI.dto.UserDTO;
import com.recommerceAPI.repository.UserRepository;
import com.recommerceAPI.service.SocialUserService;
import com.recommerceAPI.service.UserService;
import com.recommerceAPI.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@Log4j2
@RequiredArgsConstructor
public class UserController {

    private final SocialUserService socialUserService;

    private final UserService userService;

    private final UserRepository userRepository;

    @GetMapping("/kakao")
    public Map<String, Object> getUserFromKakao(String accessToken) {

        log.info("accessToken ");
        log.info(accessToken);

        LoginDTO loginDTO = socialUserService.getKakaoUser(accessToken);

        Map<String, Object> claims = loginDTO.getClaims();  //카카오로 처리된 회원의 정보

        String jwtAccessToken = JWTUtil.generateToken(claims, 10);  //JWT형태로 생성해서 넣어주는 것
        String jwtRefreshToken = JWTUtil.generateToken(claims, 60*1);

        claims.put("accessToken", jwtAccessToken);  //정보 넣기
        claims.put("refreshToken", jwtRefreshToken);

        return claims;
    }



    // 사용자 등록을 처리하는 엔드포인트
    @PostMapping("/join")
    public ResponseEntity<Map<String, String>> joinPOST(@RequestBody UserDTO userDTO) {
        try {
            userService.join(userDTO);
            return ResponseEntity.ok().body(Map.of("status", "success"));
        } catch (UserService.EmailExistException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("status", "already_exists"));
        }
    }

    @GetMapping("/mypage/{email}")
    public ResponseEntity<?> userGet(@PathVariable  String email) {

        log.info("now user is : " + email);

        // 이메일을 사용하여 UserRepository로부터 사용자 정보 조회
        Optional<User> user = userRepository.findByEmail(email);
        return ResponseEntity.ok(user); // 조회된 사용자 정보 반환
    }

    //수정
    @PutMapping("/modify")
    public Map<String,String> modifyUser(@RequestBody UserDTO userDTO) {

        log.info("member modify: " + userDTO);

        userService.modifyUser(userDTO);

        return Map.of("result","modified");
    }

    @DeleteMapping("/remove/{email}")
    public ResponseEntity<?> removeUser(@PathVariable String email) {
        log.info("bye~ " + email);

        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            userRepository.delete(user.get()); // 사용자 삭제
            return ResponseEntity.ok().body("회원 탈퇴가 성공적으로 처리되었습니다.");
        } else {
            return ResponseEntity.notFound().build(); // 사용자를 찾을 수 없음
        }
    }
    // 현재 비밀번호 검증을 처리하는 엔드포인트
    @GetMapping("/validate-password")
    public ResponseEntity<?> validateCurrentPassword(@RequestParam String email, @RequestParam String currentPassword) {
        boolean isValid = userService.validateCurrentPassword(email, currentPassword);
        if (isValid) {
            return ResponseEntity.ok(Map.of("message", "Password is valid"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid password"));
        }
    }

    // 계정 삭제 전 비밀번호 검증을 처리하는 엔드포인트
    @GetMapping("/validate-deletion")
    public ResponseEntity<?> validatePasswordForDeletion(@RequestParam String email, @RequestParam String deletionPassword) {
        boolean isValid = userService.validatePasswordForDeletion(email, deletionPassword);
        if (isValid) {
            return ResponseEntity.ok(Map.of("message", "Password is valid for deletion"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid password for deletion"));
        }
    }


}
