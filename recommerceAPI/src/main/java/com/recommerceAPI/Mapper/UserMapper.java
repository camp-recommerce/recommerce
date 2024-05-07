package com.recommerceAPI.Mapper;

import com.recommerceAPI.domain.User;
import com.recommerceAPI.dto.UserDTO;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User convertToEntity(UserDTO userDTO) {
        // UserDTO에서 User 엔티티로 수동으로 매핑합니다.
        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setPw(userDTO.getPw());
        user.setNickname(userDTO.getNickname());
        user.setPhone(userDTO.getPhone());
        user.setBirth(userDTO.getBirth());
        user.setAverageRating(userDTO.getAverageRating());
        user.setPostcode(userDTO.getPostcode());
        user.setAddress(userDTO.getAddress());
        user.setAddressDetail(userDTO.getAddressDetail());
        return user;
    }

    public UserDTO convertToDTO(User user) {
        // User 엔티티에서 UserDTO로 수동으로 매핑합니다.
        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(user.getEmail());
        userDTO.setPw(user.getPw());
        userDTO.setNickname(user.getNickname());
        userDTO.setPhone(user.getPhone());
        userDTO.setBirth(user.getBirth());
        userDTO.setAverageRating(user.getAverageRating());
        userDTO.setPostcode(user.getPostcode());
        userDTO.setAddress(user.getAddress());
        userDTO.setAddressDetail(user.getAddressDetail());
        return userDTO;
    }
}

