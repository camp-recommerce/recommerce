package com.recommerceAPI.service;

import com.recommerceAPI.domain.UserProfile;
import com.recommerceAPI.dto.UserProfileDTO;
import com.recommerceAPI.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
@Log4j2
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;

    @Override
    @Transactional(readOnly = true)
    public UserProfileDTO getUserProfileByEmail(String email) {
        UserProfile userProfile = userProfileRepository.findByUserProfileUserEmail(email);
        if (userProfile != null) {
            return new UserProfileDTO(
                    userProfile.getUpno(), // UserProfile의 upno
                    userProfile.getProfileUser().getEmail(), // 연결된 User의 email
                    userProfile.getTopPurchaseCategory(),
                    userProfile.getTopSaleCategory(),
                    userProfile.getAveragePrice(),
                    userProfile.getTopSellingLocation()
            );
        }
        return null; // 또는 적절한 예외 처리
    }
}
