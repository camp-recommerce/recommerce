package com.recommerceAPI.repository;

import com.recommerceAPI.domain.UserReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * UserReview 데이터에 접근하기 위한 Repository 인터페이스.
 * Spring Data JPA의 JpaRepository를 확장하여 사용자 후기 데이터에 대한 CRUD 연산을 자동으로 지원합니다.
 */
@Repository
public interface UserReviewRepository extends JpaRepository<UserReview, Long> {
    // 기본적인 CRUD 메서드와 페이징 처리를 위한 메서드가 JpaRepository에 의해 자동으로 제공됩니다.

    // 필요한 경우, 추가적인 커스텀 메서드를 여기에 정의할 수 있습니다.
    // 예: 사용자 이메일로 모든 후기를 찾는 메서드
    // List<UserReview> findByUserEmail(String userEmail);
}
