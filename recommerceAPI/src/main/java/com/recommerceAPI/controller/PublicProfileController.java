package com.recommerceAPI.controller;

import com.recommerceAPI.domain.User;
import com.recommerceAPI.dto.PublicProfileDTO;
import com.recommerceAPI.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/user/public-profile")
@RequiredArgsConstructor
public class PublicProfileController {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    //공개프로필
    @GetMapping("/by-email")
    public ResponseEntity<?> getPublicProfileByEmail(@RequestParam String email) {
        // 이메일을 기준으로 사용자 정보를 조회합니다.
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            // 사용자 정보를 가져와서 공개 프로필 DTO로 변환합니다.
            User user = userOptional.get();
            PublicProfileDTO publicProfileDTO = modelMapper.map(user, PublicProfileDTO.class);
            return ResponseEntity.ok(publicProfileDTO);
        } else {
            // 사용자를 찾을 수 없는 경우 404 에러를 반환합니다.
            return ResponseEntity.notFound().build();
        }
    }
}
