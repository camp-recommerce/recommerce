package com.recommerceAPI.service;

import com.recommerceAPI.dto.UserReviewDTO;

/**
 * 사용자 후기 서비스를 위한 인터페이스.
 * 사용자 후기 관련 작업을 정의합니다.
 */
public interface UserReviewService {

    // 사용자 후기 생성
    UserReviewDTO createUserReview(UserReviewDTO userReviewDTO);

    // ID로 사용자 후기 조회
    UserReviewDTO getUserReviewById(Long reviewId);

    // 사용자 후기 업데이트
    UserReviewDTO updateUserReview(Long reviewId, UserReviewDTO userReviewDTO);

    // 사용자 후기 삭제
    void deleteUserReview(Long reviewId);
}
