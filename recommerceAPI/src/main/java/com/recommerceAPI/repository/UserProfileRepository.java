package com.recommerceAPI.repository;

import com.recommerceAPI.domain.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    UserProfile findByProfileUserEmail(String email);
}
