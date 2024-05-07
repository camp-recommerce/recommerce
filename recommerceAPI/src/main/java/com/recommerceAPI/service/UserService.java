package com.recommerceAPI.service;
import com.recommerceAPI.dto.ChatAlarmDTO;
import com.recommerceAPI.domain.User;
import com.recommerceAPI.dto.UserDTO;
import org.springframework.transaction.annotation.Transactional;

// UserService 인터페이스는 사용자 관련 비즈니스 로직을 처리합니다.
@Transactional
public interface UserService {

    // EmailExistException은 회원 등록 과정에서 동일한 이메일을 가진 사용자가
    // 이미 존재할 경우 발생하는 사용자 정의 예외입니다.
    static class EmailExistException extends Exception {
    }

    // join 메서드는 새로운 사용자를 시스템에 등록하는 기능을 수행합니다.
    // 이미 등록된 이메일이 있는 경우 EmailExistException을 발생시킵니다.
    void join(UserDTO userDTO) throws EmailExistException;

    // modifyUser 메서드는 기존 사용자의 정보를 수정하는 기능을 수행합니다.
    void modifyUser(UserDTO userDTO);

    // 주소와 상세주소를 업데이트하는 메서드
    User updateAddress(String email, String newAddress, String newPostcode, String addressDetail) throws Exception;

    // 비밀번호 변경 메서드
    void changePassword(String email,  String currentPassword, String newPassword, String confirmPassword);

    // 비밀번호찾기 전송
    String resetPassword(String email) throws EmailNotExistException;

    static class EmailNotExistException extends RuntimeException {
        public EmailNotExistException(String message) {
            super(message);
        }
    }
}
