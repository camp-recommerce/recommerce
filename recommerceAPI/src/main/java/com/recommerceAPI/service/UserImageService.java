package com.recommerceAPI.service;

import com.recommerceAPI.dto.UserImageDTO;

/**
 * UserService 인터페이스는 사용자의 프로필 이미지와 관련된 작업을 정의하는데 사용됩니다.
 */
import org.springframework.web.multipart.MultipartFile;

public interface UserImageService {

    /**
     * 사용자의 프로필 이미지를 저장합니다.
     *
     * @param file 사용자로부터 받은 이미지 파일
     * @param userEmail 사용자 이메일 주소
     * @return 저장된 프로필 이미지 DTO
     */
    UserImageDTO saveUserImage(MultipartFile file, String userEmail);



    /**
     * 주어진 사용자 이메일 주소에 해당하는 프로필 이미지를 검색합니다.
     *
     * @param userEmail 사용자 이메일 주소
     * @return 사용자의 프로필 이미지 DTO, 존재하지 않으면 null 반환
     */
    UserImageDTO getUserImageByEmail(String userEmail);

    /**
     * 주어진 사용자 이메일 주소에 해당하는 프로필 이미지를 삭제합니다.
     *
     * @param userEmail 사용자 이메일 주소
     */
    void deleteUserImageByEmail(String userEmail);
}
