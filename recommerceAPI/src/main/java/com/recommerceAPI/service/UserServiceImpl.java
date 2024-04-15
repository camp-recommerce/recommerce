package com.recommerceAPI.service;


import com.recommerceAPI.domain.User;
import com.recommerceAPI.domain.UserRole;
import com.recommerceAPI.dto.UserDTO;
import com.recommerceAPI.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Log4j2 // Log4j2 로깅 프레임워크를 사용하는 애너테이션. 로그를 기록하는 데 사용됩니다.
@Service // 이 클래스를 스프링의 서비스 컴포넌트로 등록. 비즈니스 로직을 처리합니다.
@RequiredArgsConstructor // Lombok을 사용하여 final 필드에 대한 생성자를 자동으로 생성합니다.
public class UserServiceImpl implements UserService {

    // ModelMapper는 객체 간의 매핑을 단순화하는 라이브러리입니다. DTO와 도메인 객체 간 변환에 사용됩니다.
    private final ModelMapper modelMapper;
    // UserRepository는 JPA를 사용하여 데이터베이스와 상호작용하는 레포지토리입니다.
    private final UserRepository userRepository;
    // PasswordEncoder는 비밀번호를 안전하게 인코딩하는 데 사용됩니다.
    private final PasswordEncoder passwordEncoder;


    @Override
    public void join(UserDTO userDTO) throws EmailExistException {
        // 회원가입을 요청한 사용자의 이메일 주소를 가져옵니다.
        String email = userDTO.getEmail();
        // 이미 같은 이메일 주소를 가진 사용자가 있는지 확인합니다.
        boolean exist = userRepository.existsById(email);

        if (exist) {
            // 동일한 이메일 주소를 가진 사용자가 있으면 EmailExistException 예외를 던집니다.
            throw new EmailExistException();
        }

        // userDTO에서 User 엔티티로 객체를 변환합니다.
        User user = modelMapper.map(userDTO, User.class);
        // 사용자의 비밀번호를 인코딩합니다.
        user.changePassword(passwordEncoder.encode(userDTO.getPw()));
        // 기본적으로 USER 역할을 추가합니다.
        user.addRole(UserRole.USER);

        // 변환된 User 엔티티를 로깅합니다.
        log.info("============================");
        log.info(user);
        log.info(user.getUserRoleList());

        // User 엔티티를 데이터베이스에 저장합니다.
        userRepository.save(user);
    }

    @Override
    public void modifyUser(UserDTO userDTO) {
        // 수정하려는 사용자의 이메일로 사용자 정보를 조회합니다.
        Optional<User> result = userRepository.findById(userDTO.getEmail());

        // 조회된 User 객체를 가져오거나, 존재하지 않으면 예외를 발생시킵니다.
        User user = result.orElseThrow();

        // User 객체의 정보를 userDTO로부터 받은 값으로 변경합니다.
        user.changePassword(passwordEncoder.encode(userDTO.getPw()));
        user.changeNickname(userDTO.getNickname());
        user.changePhone(userDTO.getPhone());
        user.changeBirth(userDTO.getBirth());

        // 변경된 User 객체를 데이터베이스에 저장합니다.
        userRepository.save(user);
    }

    // 사용자의 개인정보 변경 시 비밀번호 확인 메서드
    @Override
    public boolean validateCurrentPassword(String email, String currentPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return passwordEncoder.matches(currentPassword, user.getPw());
    }

    @Override
    public boolean validatePasswordForDeletion(String email, String deletionPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return passwordEncoder.matches(deletionPassword, user.getPw());
    }

}
