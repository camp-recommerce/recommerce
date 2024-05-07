package com.recommerceAPI.repository;

import com.recommerceAPI.domain.ChatAlarm;
import com.recommerceAPI.domain.User;
import com.recommerceAPI.domain.Wishlist;
import com.recommerceAPI.dto.ChatAlarmDTO;
import com.recommerceAPI.dto.ChatAlarmListDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
public interface ChatAlarmRepository extends JpaRepository<ChatAlarm, Long> {


    @Query("SELECT chatalarm FROM ChatAlarm chatalarm WHERE chatalarm.user.email = :email AND chatalarm.readCheck = false")
    public List<ChatAlarm> findAllByUserEmail(@Param("email") String email);
    // senderEmail당 하나씩만 가져오는거 마이페이지에서 쓸겁니다.
    @Query("SELECT chatalarm FROM ChatAlarm chatalarm WHERE chatalarm.user.email = :email AND chatalarm.senderEmail LIKE '%@%' GROUP BY chatalarm.senderEmail")
    public List<ChatAlarm> findAllByUserEmailChat(@Param("email") String email);

    Optional<ChatAlarm> findByUserAndReadCheck(User user, boolean b);

    @Query("SELECT chatalarm FROM ChatAlarm chatalarm WHERE chatalarm.roomId = :roomId")
    public List<ChatAlarm> findAllByRoomId(@Param("roomId") String roomId);
}
