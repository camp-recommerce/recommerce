package com.recommerceAPI.repository;

import com.recommerceAPI.domain.ChatAlarm;
import com.recommerceAPI.domain.User;
import com.recommerceAPI.domain.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatAlarmRepository extends JpaRepository<ChatAlarm, Long> {

    @Query("SELECT chatalarm FROM ChatAlarm chatalarm WHERE chatalarm.user.email = :email AND chatalarm.readCheck = false")
    public List<ChatAlarm> findAllUnreadByUserEmail(@Param("email") String email);

    Optional<ChatAlarm> findByUserAndReadCheck(User user, boolean readCheck);

}
