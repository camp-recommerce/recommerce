package com.recommerceAPI.service;

import com.recommerceAPI.dto.UserImageDTO;
import com.recommerceAPI.service.UserImageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class UserImageServiceImpl implements UserImageService {

    private static final String IMAGE_STORAGE_PATH = "/path/to/image/storage"; // 이미지 저장 경로

    @Override
    public UserImageDTO saveUserImage(MultipartFile file, String userEmail) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty and cannot be saved.");
        }

        try {
            // 파일 시스템에 이미지 저장
            String originalFilename = file.getOriginalFilename();
            Path destinationFile = Paths.get(IMAGE_STORAGE_PATH).resolve(
                    Paths.get(originalFilename)).normalize().toAbsolutePath();
            file.transferTo(destinationFile);

            // 데이터베이스 저장 로직 (가상 코드)
            UserImageDTO userImageDTO = new UserImageDTO();
            userImageDTO.setUserEmail(userEmail);
            userImageDTO.setImagePath(destinationFile.toString());
            userImageDTO.setImageName(originalFilename);
            userImageDTO.setImageExtension(getFileExtension(originalFilename));
            userImageDTO.setImageSize(file.getSize());

            return userImageDTO;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + file.getOriginalFilename(), e);
        }
    }

    private String getFileExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

    @Override
    public UserImageDTO getUserImageByEmail(String userEmail) {
        // 데이터베이스에서 이미지 정보 검색 로직 (가상 코드)
        return new UserImageDTO(); // 실제 구현에서는 데이터베이스에서 정보를 조회하여 반환
    }

    @Override
    public void deleteUserImageByEmail(String userEmail) {
        // 데이터베이스와 파일 시스템에서 이미지 정보 삭제 로직 (가상 코드)
    }
}
