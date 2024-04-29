package com.recommerceAPI.controller;

import com.recommerceAPI.domain.User;
import com.recommerceAPI.dto.ChatAlarmDTO;
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
import org.springframework.mail.javamail.JavaMailSender;
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

    private final JavaMailSender javaMailSender;

    @GetMapping("/kakao")
    public Map<String, Object> getUserFromKakao(String accessToken) {

        log.info("accessToken ");
        log.info(accessToken);

        LoginDTO loginDTO = socialUserService.getKakaoUser(accessToken);

        Map<String, Object> claims = loginDTO.getClaims();  //카카오로 처리된 회원의 정보

        String jwtAccessToken = JWTUtil.generateToken(claims, 10);  //JWT형태로 생성해서 넣어주는 것
        String jwtRefreshToken = JWTUtil.generateToken(claims, 60 * 1);

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
    public ResponseEntity<?> userGet(@PathVariable String email) {

        log.info("now user is : " + email);

        // 이메일을 사용하여 UserRepository로부터 사용자 정보 조회
        Optional<User> user = userRepository.findByEmail(email);
        return ResponseEntity.ok(user); // 조회된 사용자 정보 반환
    }

    //수정
    @PutMapping("/modify")
    public Map<String, String> modifyUser(@RequestBody UserDTO userDTO) {

        log.info("member modify: " + userDTO);

        userService.modifyUser(userDTO);

        return Map.of("result", "modified");
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


    @PutMapping("/address/{email}")
    public ResponseEntity<?> updateAddress(@PathVariable String email,
                                           @RequestParam String newAddress,
                                           @RequestParam String newPostcode,
                                           @RequestParam String addressDetail) {  // 상세 주소를 위한 매개변수 추가
        try {
            // 상세 주소 포함하여 주소 정보 업데이트 메서드 호출
            User updatedUser = userService.updateAddress(email, newAddress, newPostcode, addressDetail);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    //이메일로 비밀번호 전송
    @PostMapping("/reset-pw")
    public ResponseEntity<String> resetPassword(@RequestParam("email") String email) {
        try {
            String message = userService.resetPassword(email);
            return ResponseEntity.ok(message);
        } catch (UserService.EmailNotExistException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    // 비밀번호 변경을 위한 PUT 요청을 처리하는 메서드
// @param email 사용자의 이메일 주소, 경로 변수로 받음
// @param currentPassword 사용자가 입력한 현재 비밀번호, 요청 매개변수로 받음
// @param newPassword 사용자가 입력한 새로운 비밀번호, 요청 매개변수로 받음
// @param confirmPassword 사용자가 입력한 새로운 비밀번호 확인, 요청 매개변수로 받음
    @PutMapping("/password/{email}")
    public ResponseEntity<String> changePassword(
            @PathVariable String email,
            @RequestParam String currentPassword,
            @RequestParam String newPassword,
            @RequestParam String confirmPassword) {

        // 비밀번호 변경 로직을 UserService의 changePassword 메서드에 위임
        userService.changePassword(email, currentPassword, newPassword, confirmPassword);
        // 비밀번호 변경 성공 시, HTTP 상태 코드 200과 함께 성공 메시지를 응답
        return ResponseEntity.status(HttpStatus.OK).body("비밀번호가 성공적으로 변경되었습니다.");
    }
}
