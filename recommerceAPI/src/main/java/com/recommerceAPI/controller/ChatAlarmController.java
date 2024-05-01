package com.recommerceAPI.controller;

import com.recommerceAPI.dto.ChatAlarmDTO;
import com.recommerceAPI.dto.ChatAlarmListDTO;
import com.recommerceAPI.service.ChatAlarmService;
import com.recommerceAPI.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/alarm")
@Log4j2
@RequiredArgsConstructor
public class ChatAlarmController {
    private final ChatAlarmService chatAlarmService;
    @PostMapping("/send") // 알람 전송
    public List<ChatAlarmDTO> chatAlarm(@RequestBody ChatAlarmDTO chatAlarmDTO){
       return chatAlarmService.saveModChatAlarm(chatAlarmDTO);
    }
    @GetMapping("/list") // 알람 리스트 확인
    public List<ChatAlarmDTO> getAlarms(Principal principal){
        String email = principal.getName();
        log.info("---------email: "+email);
        return chatAlarmService.getAlarmList(email);
    }
    @GetMapping("/room") // 사용자에게 온 알람을 이용해 채팅방 정보들을 가져옴
    public List<ChatAlarmDTO> getRooms(Principal principal){
        String email = principal.getName();
        log.info("---------email: "+email);
        return chatAlarmService.getRoomList(email);
    }
    @PutMapping("/read/{alarmId}") // 알람 들의 읽음 처리
    public List<ChatAlarmDTO> updateAlarmsToRead(@PathVariable(name = "alarmId") Long alarmId) {
        return chatAlarmService.updateMultipleChatAlarmsToRead(alarmId);
    }@DeleteMapping("/delete/{roomId}") // 해당방의 모든 알림을 삭제
    public void deleteAllAlarm(@PathVariable String roomId){
        chatAlarmService.deleteAllChatAlarmsByRoomId(roomId);
    }
}
