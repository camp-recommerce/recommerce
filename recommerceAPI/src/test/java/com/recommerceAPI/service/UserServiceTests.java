package com.recommerceAPI.service;

import com.recommerceAPI.domain.User;
import com.recommerceAPI.domain.UserRole;
import com.recommerceAPI.dto.UserDTO;
import com.recommerceAPI.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private UserDTO userDTO;
    private User user;

    @BeforeEach
    void setUp() {
        userDTO = new UserDTO();
        userDTO.setEmail("test@example.com");
        userDTO.setPw("password");
        userDTO.setNickname("nickname");
        userDTO.setPhone("1234567890");
        userDTO.setBirth("01-01-1990");

        user = new User();
        user.setEmail(userDTO.getEmail());
        user.setPw(passwordEncoder.encode(userDTO.getPw()));
        user.setNickname(userDTO.getNickname());
        user.setPhone(userDTO.getPhone());
        user.setBirth(userDTO.getBirth());
        user.addRole(UserRole.USER);
    }

    @Test
    void testJoinSuccess() throws UserService.EmailExistException {
        when(userRepository.existsById(anyString())).thenReturn(false);
        when(modelMapper.map(any(UserDTO.class), eq(User.class))).thenReturn(user);

        userService.join(userDTO);

        verify(userRepository).save(any(User.class));
    }

    @Test
    void testModifyUserSuccess() {
        when(userRepository.findById(anyString())).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(anyString())).thenReturn("newEncodedPassword");

        userService.modifyUser(userDTO);

        verify(userRepository).save(any(User.class));
        assertEquals("newEncodedPassword", user.getPw());
    }


}
