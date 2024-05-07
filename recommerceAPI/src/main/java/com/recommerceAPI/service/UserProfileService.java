package com.recommerceAPI.service;

import com.recommerceAPI.dto.UserProfileDTO;

public interface UserProfileService {
    UserProfileDTO getUserProfileStatisticsByEmail(String email);
}
