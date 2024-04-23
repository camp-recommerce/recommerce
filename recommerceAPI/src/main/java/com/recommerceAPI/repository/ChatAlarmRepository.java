package com.recommerceAPI.repository;

import com.recommerceAPI.domain.ChatAlarm;
import com.recommerceAPI.domain.User;
import com.recommerceAPI.domain.Wishlist;
import com.recommerceAPI.dto.ChatAlarmDTO;
import com.recommerceAPI.dto.ChatAlarmListDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatAlarmRepository extends JpaRepository<ChatAlarm, Long> {


    @Query("SELECT ca FROM ChatAlarm ca WHERE ca.user.email = :userEmail AND ca.readCheck = false")
    public List<ChatAlarm> getUnreadChatAlarmsByUserEmail(@Param("userEmail") String userEmail);


    // 쿼리 해석@Query(value = "...", nativeQuery = true): 이 어노테이션은 Spring Data JPA에서 네이티브 쿼리를 사용하도록 지시합니다. value 속성에는 실행할 네이티브 SQL 쿼리를 지정합니다.



    Optional<ChatAlarm> findByUserAndReadCheck(User user, boolean b);
}
