package com.recommerceAPI.controller;

import com.recommerceAPI.dto.ChatAlarmDTO;
import com.recommerceAPI.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/chat")
@Log4j2
@RequiredArgsConstructor
public class ChatAlarmController {
    private final UserService userService;
    @PostMapping("/alarm")
    public Map<String ,String> chatAlarm(@RequestBody ChatAlarmDTO chatAlarmDTO, String email){

        userService.updateChatAlarms(email,chatAlarmDTO);

        return Map.of("alaram","send");
    }
}
