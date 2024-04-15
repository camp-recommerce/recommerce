package com.recommerceAPI.service;

import com.recommerceAPI.domain.UserReview;
import com.recommerceAPI.dto.UserReviewDTO;
import com.recommerceAPI.repository.UserReviewRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * UserReviewService의 구현체.
 * 사용자 후기에 대한 비즈니스 로직을 처리합니다.
 */
@Service
@RequiredArgsConstructor
public class UserReviewServiceImpl implements UserReviewService {

    @Autowired
    private UserReviewRepository userReviewRepository;

    @Autowired
    private ModelMapper modelMapper;

    // 사용자 후기 생성
    @Transactional
    public UserReviewDTO createUserReview(UserReviewDTO userReviewDTO) {
        UserReview userReview = modelMapper.map(userReviewDTO, UserReview.class);
        userReview = userReviewRepository.save(userReview);
        return modelMapper.map(userReview, UserReviewDTO.class);
    }

    // ID로 사용자 후기 조회
    @Transactional(readOnly = true)
    public UserReviewDTO getUserReviewById(Long reviewId) {
        UserReview userReview = userReviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with id: " + reviewId));
        return modelMapper.map(userReview, UserReviewDTO.class);
    }

    // 사용자 후기 업데이트
    @Transactional
    public UserReviewDTO updateUserReview(Long reviewId, UserReviewDTO userReviewDTO) {
        UserReview userReview = userReviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with id: " + reviewId));
        modelMapper.map(userReviewDTO, userReview);
        userReview = userReviewRepository.save(userReview);
        return modelMapper.map(userReview, UserReviewDTO.class);
    }

    // 사용자 후기 삭제
    @Transactional
    public void deleteUserReview(Long reviewId) {
        userReviewRepository.deleteById(reviewId);
    }
}
