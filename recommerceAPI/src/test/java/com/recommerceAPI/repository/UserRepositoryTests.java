package com.recommerceAPI.repository;

import com.recommerceAPI.domain.User;
import com.recommerceAPI.domain.UserRole;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;




@SpringBootTest
@Log4j2
public class UserRepositoryTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void testInsertUser(){

        for (int i = 0; i < 10 ; i++) {

            User user = User.builder()
                    .email("user"+i+"@aaa.com")
                    .pw(passwordEncoder.encode("1111"))
                    .build();
            user.addRole(UserRole.USER);
            if(i <= 1){
                user.addRole(UserRole.ADMIN);
            }
            userRepository.save(user);
        }
    }

    @Test
    public void testRead() {

        String email = "user3@aaa.com";

        User user = userRepository.getWithRoles(email);

        log.info("-----------------");
        log.info(user);
    }
}

