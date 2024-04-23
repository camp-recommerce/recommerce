package com.recommerceAPI.service;

import com.recommerceAPI.domain.ChatAlarm;
import com.recommerceAPI.domain.User;
import com.recommerceAPI.domain.Wishlist;
import com.recommerceAPI.dto.ChatAlarmDTO;
import com.recommerceAPI.repository.ChatAlarmRepository;
import com.recommerceAPI.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class ChatAlarmServiceImpl implements ChatAlarmService{

    private final ChatAlarmRepository chatAlarmRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    @Override
    public ChatAlarm saveChatAlarm(ChatAlarmDTO chatAlarmDTO) {
        String email = chatAlarmDTO.getUserEmail();
        boolean isRead = chatAlarmDTO.isReadCheck(); // 알림을 읽었는지 여부

        Optional<User> result = userRepository.findByEmail(email);
        User user = result.orElseThrow();

        // 알림이 읽혔는지 여부 확인
        if (isRead) {
            // 해당 사용자에 대한 읽힌 알림이 있는지 확인
            Optional<ChatAlarm> existingChatAlarm = chatAlarmRepository.findByUserAndReadCheck(user, true);
            if (existingChatAlarm.isPresent()) {
                // 기존 알림 업데이트
                ChatAlarm chatAlarm = existingChatAlarm.get();
                chatAlarm.setMessage(chatAlarmDTO.getMessage()); // 필요한 경우 다른 필드도 업데이트
                return chatAlarmRepository.save(chatAlarm);
            } else {
                // 읽힌 알림이 없으면 새 알림 생성
                ChatAlarm chatAlarm = modelMapper.map(chatAlarmDTO, ChatAlarm.class);
                chatAlarm.setUser(user);
                return chatAlarmRepository.save(chatAlarm);
            }
        } else {
            // 읽히지 않은 알림이므로 새 알림 생성
            ChatAlarm chatAlarm = modelMapper.map(chatAlarmDTO, ChatAlarm.class);
            chatAlarm.setUser(user);
            return chatAlarmRepository.save(chatAlarm);
        }
    }


    @Override
    public List<ChatAlarmDTO> getAlarmList(String email){
        // 사용자 이메일에 해당하는 모든 채팅 알람을 조회합니다.
        List<ChatAlarm> chatAlarms = chatAlarmRepository.findAllUnreadByUserEmail(email);
        // 모델맵퍼로 스트림 돌려서 전부 DTO 로 변환해서 list 형식으로 반환
        return chatAlarms.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ChatAlarmDTO convertToDTO(ChatAlarm chatAlarm) {
        return modelMapper.map(chatAlarm, ChatAlarmDTO.class);
    }

}

