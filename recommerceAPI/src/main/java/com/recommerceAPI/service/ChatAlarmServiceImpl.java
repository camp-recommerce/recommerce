package com.recommerceAPI.service;

import com.recommerceAPI.domain.ChatAlarm;
import com.recommerceAPI.domain.User;
import com.recommerceAPI.dto.ChatAlarmDTO;
import com.recommerceAPI.repository.ChatAlarmRepository;
import com.recommerceAPI.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class ChatAlarmServiceImpl implements ChatAlarmService{

    private final ChatAlarmRepository chatAlarmRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    @Override
    public List<ChatAlarmDTO> saveModChatAlarm(ChatAlarmDTO chatAlarmDTO) {
        String email = chatAlarmDTO.getUserEmail();
        String senderEmail = chatAlarmDTO.getSenderEmail();
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
                chatAlarmRepository.save(chatAlarm);
                return getAlarmList(senderEmail);
            } else {
                // 읽힌 알림이 없으면 새 알림 생성
                ChatAlarm chatAlarm = modelMapper.map(chatAlarmDTO, ChatAlarm.class);
                chatAlarm.setUser(user);
                chatAlarmRepository.save(chatAlarm);
                return getAlarmList(senderEmail);
            }
        } else {
            // 읽히지 않은 알림이므로 새 알림 생성
            ChatAlarm chatAlarm = modelMapper.map(chatAlarmDTO, ChatAlarm.class);
            chatAlarm.setUser(user);
            chatAlarmRepository.save(chatAlarm);
            return getAlarmList(senderEmail);
        }
    }
    @Override
    public List<ChatAlarmDTO> getAlarmList(String email){
        // 사용자 이메일에 해당하는 모든 채팅 알람을 조회합니다.
        List<ChatAlarm> chatAlarms = chatAlarmRepository.findAllByUserEmail(email);
        // ChatAlarm을 ChatAlarmDTO로 변환하여 리스트로 반환합니다.
        return chatAlarms.stream()
                .map(chatAlarm -> modelMapper.map(chatAlarm, ChatAlarmDTO.class))
                .collect(Collectors.toList());
    }
    @Override
    public List<ChatAlarmDTO> getRoomList(String email){
        // 사용자 이메일에 해당하는 모든 채팅 알람을 조회합니다.
        List<ChatAlarm> chatAlarms = chatAlarmRepository.findAllByUserEmailChat(email);
        // ChatAlarm을 ChatAlarmDTO로 변환하여 리스트로 반환합니다.
        return chatAlarms.stream()
                .map(chatAlarm -> modelMapper.map(chatAlarm, ChatAlarmDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ChatAlarmDTO> updateMultipleChatAlarmsToRead(Long alarmId) {
        // 알람 ID 목록으로 알람들을 조회합니다.
      Optional<ChatAlarm> alarms = chatAlarmRepository.findById(alarmId);
        // 조회된 알람들의 readCheck 필드를 모두 true로 업데이트합니다.
        ChatAlarm alarm = alarms.orElseThrow();
        String email = alarm.getUser().getEmail();
        alarm.setReadCheck(true);
        // 업데이트된 알람들을 저장합니다.
        chatAlarmRepository.save(alarm);
        return getAlarmList(email);
        // 업데이트된 알람 목록을 조회하여 반환합니다.
    }
    @Override
    public void sendAuctionAlarm(ChatAlarmDTO chatAlarmDTO) {
        String email = chatAlarmDTO.getUserEmail();
        Optional<User> result = userRepository.findByEmail(email);
        User user = result.orElseThrow();
        log.info("============sendAuctionAlarm"+chatAlarmDTO);
        ChatAlarm chatAlarm = modelMapper.map(chatAlarmDTO, ChatAlarm.class);
        chatAlarm.setUser(user);
        log.info("============sendAuctionAlarm"+chatAlarm);
        chatAlarmRepository.save(chatAlarm);
    }
    @Override
    public void deleteAllChatAlarmsByRoomId(String roomId) {
        // roomId에 해당하는 모든 알람들을 조회합니다.
        List<ChatAlarm> chatAlarms = chatAlarmRepository.findAllByRoomId(roomId);
        // 조회된 알람들을 삭제합니다.
        chatAlarmRepository.deleteAll(chatAlarms);
    }
}

