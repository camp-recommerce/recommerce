package com.recommerceAPI.service;


import com.recommerceAPI.domain.ChatAlarm;
import com.recommerceAPI.domain.User;
import com.recommerceAPI.domain.UserRole;
import com.recommerceAPI.dto.ChatAlarmDTO;
import com.recommerceAPI.dto.UserDTO;
import com.recommerceAPI.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
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

    private final EmailService emailService;

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

        user.changeNickname(userDTO.getNickname());
        user.changePhone(userDTO.getPhone());
        user.changeBirth(userDTO.getBirth());

        // 변경된 User 객체를 데이터베이스에 저장합니다.
        userRepository.save(user);
    }


    @Override
    public User updateAddress(String email, String newAddress, String newPostcode, String addressDetail) throws Exception {
        // 이메일을 사용하여 사용자 정보를 조회합니다.
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("User not found with email: " + email));

        // 새로운 주소, 우편번호, 그리고 상세 주소를 사용자 정보에 설정합니다.
        user.setAddress(newAddress);
        user.setPostcode(newPostcode);
        user.setAddressDetail(addressDetail); // 상세 주소 설정 추가

        // 사용자 정보를 저장하고 업데이트된 정보를 반환합니다.
        return userRepository.save(user);
    }


    @Override
    public String resetPassword(String email){
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            throw new EmailNotExistException("등록된 이메일이 없습니다. 다시 확인하세요.");
        }

        User user = userOptional.get();
        // 임시 비밀번호 생성 로직
        String tempPassword = generateTempPassword();
        // 비밀번호 인코딩
        String encodedPassword = passwordEncoder.encode(tempPassword);
        // 임시 비밀번호를 사용자 계정에 저장
        user.changePassword(encodedPassword);
        userRepository.save(user);
        // 사용자 이메일로 임시 비밀번호를 포함한 이메일 발송
        emailService.sendEmail(user.getEmail(),
                "임시비밀번호 발송드립니다.",
                "회원님의 임시비밀번호: " + tempPassword +"\n보안을 위해 로그인 후 비밀번호 재설정 부탁드립니다.");

        return "비밀번호 재설정 이메일이 발송되었습니다. 등록된 이메일을 확인해 주세요.";
    }


    private String generateTempPassword() {
        // 임시 비밀번호 생성 로직 구현
        String lowerAlphabets = "abcdefghijklmnopqrstuvwxyz";
        String numbers = "0123456789";
        String combinedChars = lowerAlphabets + numbers;
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(8);

        for (int i = 0; i < 8; i++) {
            sb.append(combinedChars.charAt(random.nextInt(combinedChars.length())));
        }

        return sb.toString();
    }

    @Override
    public void changePassword(String email, String currentPassword, String newPassword, String confirmPassword) {
        // 사용자가 유효한 JWT 토큰을 포함하고 있는지 확인
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("User is not authenticated.");
        }
        // 사용자 이메일로 사용자 정보 조회, 없으면 예외 발생
        User user = userRepository.findById(email).orElseThrow(() -> new IllegalArgumentException("No user found with email " + email));

        // 현재 비밀번호가 올바른지 검증, 여기서 passwordEncoder.matches() 메서드를 사용하여 비밀번호를 검증합니다.
        if (!passwordEncoder.matches(currentPassword, user.getPw())) {
            throw new IllegalArgumentException("Incorrect current password.");
        }

        // 새 비밀번호와 확인 비밀번호가 일치하는지 확인
        if (!user.confirmNewPassword(newPassword, confirmPassword)) {
            // 비밀번호 불일치시, 예외 발생
            throw new IllegalArgumentException("New password and confirmation password do not match.");
        }

        // 비밀번호 일치시, 비밀번호를 암호화하여 변경 후 저장
        user.changePassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }



}


