package com.recommerceAPI.controller;

import com.recommerceAPI.dto.UserImageDTO;
import com.recommerceAPI.service.UserImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/user/images")
public class UserImageController {

    private final UserImageService userImageService;

    @Autowired
    public UserImageController(UserImageService userImageService) {
        this.userImageService = userImageService;
    }

    /**
     * 사용자 프로필 이미지를 저장합니다.
     *
     * @param file 사용자로부터 받은 이미지 파일
     * @param userEmail 사용자 이메일 주소
     * @return 저장된 사용자 프로필 이미지 정보
     */
    @PostMapping("/upload")
    public ResponseEntity<UserImageDTO> uploadUserImage(@RequestParam("image") MultipartFile file,
                                                        @RequestParam("userEmail") String userEmail) {
        if (file.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        UserImageDTO savedUserImage = userImageService.saveUserImage(file, userEmail);
        return new ResponseEntity<>(savedUserImage, HttpStatus.CREATED);
    }

    /**
     * 주어진 이메일 주소에 해당하는 사용자의 프로필 이미지를 반환합니다.
     *
     * @param userEmail 사용자 이메일 주소
     * @return 사용자의 프로필 이미지 정보
     */
    @GetMapping("/{userEmail}")
    public ResponseEntity<UserImageDTO> getUserImageByEmail(@PathVariable String userEmail) {
        UserImageDTO userImageDTO = userImageService.getUserImageByEmail(userEmail);
        if (userImageDTO != null) {
            return new ResponseEntity<>(userImageDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * 주어진 이메일 주소에 해당하는 사용자의 프로필 이미지를 삭제합니다.
     *
     * @param userEmail 사용자 이메일 주소
     * @return 삭제된 경우 HttpStatus.NO_CONTENT를 반환합니다.
     */
    @DeleteMapping("/{userEmail}")
    public ResponseEntity<Void> deleteUserImageByEmail(@PathVariable String userEmail) {
        userImageService.deleteUserImageByEmail(userEmail);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
