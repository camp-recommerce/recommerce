package com.recommerceAPI.service;

import com.recommerceAPI.dto.UserProfileDTO;

public interface UserProfileService {
    UserProfileDTO getUserProfileByEmail(String email);
}
