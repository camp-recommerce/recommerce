package com.recommerceAPI.repository;

import com.recommerceAPI.domain.User;
import com.recommerceAPI.domain.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, String> {
    UserProfile findByUser(User user);
}
