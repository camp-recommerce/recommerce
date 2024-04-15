package com.recommerceAPI.service;


import java.util.stream.Collectors;


import com.recommerceAPI.domain.User;
import com.recommerceAPI.dto.LoginDTO;
import org.springframework.transaction.annotation.Transactional;


@Transactional
public interface SocialUserService {

    LoginDTO getKakaoUser(String accessToken);



    default LoginDTO entityToDTO(User user){

        LoginDTO dto = new LoginDTO(
                user.getEmail(),
                user.getPw(),
                user.getNickname(),
                user.getPhone(),
                user.getBirth(),
                user.getUserRoleList().stream().map(userRole -> userRole.name()).collect(Collectors.toList()));
        return dto;
    }
}
