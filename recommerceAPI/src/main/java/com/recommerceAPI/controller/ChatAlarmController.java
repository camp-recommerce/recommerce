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
    @PostMapping("/send")
    public List<ChatAlarmDTO> chatAlarm(@RequestBody ChatAlarmDTO chatAlarmDTO){

       return chatAlarmService.saveModChatAlarm(chatAlarmDTO);

    }

    @GetMapping("/list")
    public List<ChatAlarmDTO> getAlarms(Principal principal){
        String email = principal.getName();
        log.info("---------email: "+email);
        return chatAlarmService.getAlarmList(email);
    }
}
