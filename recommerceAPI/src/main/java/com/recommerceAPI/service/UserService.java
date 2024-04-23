package com.recommerceAPI.service;
import com.recommerceAPI.dto.ChatAlarmDTO;
import com.recommerceAPI.domain.User;

import com.recommerceAPI.dto.UserDTO;
import org.springframework.transaction.annotation.Transactional;

// UserService 인터페이스는 사용자 관련 비즈니스 로직을 처리합니다.
// @Transactional 애너테이션을 사용하여 메서드 수행 중 발생하는 모든 변경사항이
// 성공적으로 완료되면 커밋하고, 오류가 발생하면 롤백합니다.
@Transactional
public interface UserService {

    // EmailExistException은 회원 등록 과정에서 동일한 이메일을 가진 사용자가
    // 이미 존재할 경우 발생하는 사용자 정의 예외입니다.
    static class EmailExistException extends Exception {
    }

    // join 메서드는 새로운 사용자를 시스템에 등록하는 기능을 수행합니다.
    // 이미 등록된 이메일이 있는 경우 EmailExistException을 발생시킵니다.
    // @param userDTO 사용자 등록에 필요한 정보를 담고 있는 UserDTO 객체입니다.
    // @throws EmailExistException 동일한 이메일을 가진 사용자가 이미 존재하는 경우 발생합니다.
    void join(UserDTO userDTO) throws EmailExistException;

    // modifyUser 메서드는 기존 사용자의 정보를 수정하는 기능을 수행합니다.
    // @param userDTO 수정할 사용자 정보를 담고 있는 UserDTO 객체입니다.
    void modifyUser(UserDTO userDTO);

    // 주소와 상세주소를 업데이트하는 메서드 선언
    // @param email 사용자의 이메일
    // @param newAddress 사용자의 새 주소
    // @param newPostcode 사용자의 새 우편번호
    // @param addressDetail 사용자의 새 상세주소
    // @return User 업데이트된 사용자 정보를 반환합니다.
    // @throws Exception 처리 중 발생할 수 있는 예외
    User updateAddress(String email, String newAddress, String newPostcode, String addressDetail) throws Exception;

    // 채팅 알림 설정을 업데이트하는 메서드 선언
    void updateChatAlarms(String email, ChatAlarmDTO chatAlarmDTO);

    //비밀번호찾기 전송
    String resetPassword(String email)throws EmailNotExistException;

    static class EmailNotExistException extends RuntimeException{

        public EmailNotExistException(String message){
            super(message);
        }

    }

}
