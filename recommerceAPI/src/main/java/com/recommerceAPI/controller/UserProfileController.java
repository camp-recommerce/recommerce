package com.recommerceAPI.controller;

import com.recommerceAPI.dto.UserProfileDTO;
import com.recommerceAPI.service.UserProfileService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@Log4j2
public class UserProfileController {

    private final UserProfileService userProfileService;

    @Autowired
    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping("/profile/statistics/{email}")
    public ResponseEntity<UserProfileDTO> getUserProfileStatisticsByEmail(@PathVariable String email) {
        UserProfileDTO profileStatistics = userProfileService.getUserProfileStatisticsByEmail(email);
        if (profileStatistics != null) {
            return ResponseEntity.ok(profileStatistics);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}