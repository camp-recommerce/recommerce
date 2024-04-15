package com.recommerceAPI.controller;

import com.recommerceAPI.dto.UserReviewDTO;
import com.recommerceAPI.service.UserReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * UserReviewController 클래스는 사용자 후기 관련 HTTP 요청을 처리합니다.
 * @RestController 어노테이션을 사용하여, 이 클래스의 모든 메소드가 JSON 형태로 객체 데이터를 반환하도록 설정합니다.
 */
@RestController
@RequestMapping("/api/reviews") // 모든 요청의 기본 URL을 설정합니다.
public class UserReviewController {

    @Autowired
    private UserReviewService userReviewService; // 사용자 후기 서비스 의존성 주입

    /**
     * 사용자 후기를 생성하는 HTTP POST 요청을 처리합니다.
     * @param userReviewDTO 생성할 사용자 후기 정보가 담긴 DTO
     * @return 생성된 사용자 후기의 DTO와 HTTP 상태 코드
     */
    @PostMapping
    public ResponseEntity<UserReviewDTO> createUserReview(@RequestBody UserReviewDTO userReviewDTO) {
        UserReviewDTO createdReview = userReviewService.createUserReview(userReviewDTO);
        return new ResponseEntity<>(createdReview, HttpStatus.CREATED);
    }

    /**
     * 사용자 후기 ID로 하나의 후기를 조회하는 HTTP GET 요청을 처리합니다.
     * @param reviewId 조회할 사용자 후기의 ID
     * @return 조회된 사용자 후기의 DTO와 HTTP 상태 코드
     */
    @GetMapping("/{reviewId}")
    public ResponseEntity<UserReviewDTO> getUserReviewById(@PathVariable Long reviewId) {
        UserReviewDTO review = userReviewService.getUserReviewById(reviewId);
        return ResponseEntity.ok(review);
    }

    /**
     * 사용자 후기 정보를 업데이트하는 HTTP PUT 요청을 처리합니다.
     * @param reviewId 업데이트할 사용자 후기의 ID
     * @param userReviewDTO 업데이트할 사용자 후기 정보가 담긴 DTO
     * @return 업데이트된 사용자 후기의 DTO와 HTTP 상태 코드
     */
    @PutMapping("/{reviewId}")
    public ResponseEntity<UserReviewDTO> updateUserReview(@PathVariable Long reviewId, @RequestBody UserReviewDTO userReviewDTO) {
        UserReviewDTO updatedReview = userReviewService.updateUserReview(reviewId, userReviewDTO);
        return ResponseEntity.ok(updatedReview);
    }

    /**
     * 사용자 후기를 삭제하는 HTTP DELETE 요청을 처리합니다.
     * @param reviewId 삭제할 사용자 후기의 ID
     * @return HTTP 상태 코드
     */
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteUserReview(@PathVariable Long reviewId) {
        userReviewService.deleteUserReview(reviewId);
        return ResponseEntity.ok().build();
    }
}
