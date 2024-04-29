package com.recommerceAPI.controller;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.dialogflow.v2.*;
import com.recommerceAPI.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Log4j2
@RestController
@RequestMapping
@RequiredArgsConstructor
public class ChatBotController {

    private final String projectId = "recommerce-heky"; // 본인의 Dialogflow 프로젝트 ID로 대체해야 합니다.
    private final String languageCode = "ko"; // 대화의 언어 코드에 따라 변경해야 합니다.
    private final String serviceAccountKeyFilePath = "recommerce-heky-dc50bacddfd";// 서비스 계정 키 파일의 경로로 대체해야 합니다.

    @PostMapping("/chat/send")
    public ResponseEntity<String> detectIntent(@RequestBody String userInput) {
        log.info("uerr"+userInput);
        try {
            // 서비스 계정 키 파일을 사용하여 GoogleCredentials 생성
            GoogleCredentials credentials = GoogleCredentials.fromStream(new FileInputStream(serviceAccountKeyFilePath))
                    .createScoped(List.of("https://www.googleapis.com/auth/cloud-platform"));

            // 세션 ID 생성
            String sessionId = UUID.randomUUID().toString();
            SessionName session = SessionName.of(projectId, sessionId);

            // Dialogflow 에 전달할 텍스트 입력 생성
            TextInput.Builder textInput = TextInput.newBuilder().setText(userInput).setLanguageCode(languageCode);
            QueryInput queryInput = QueryInput.newBuilder().setText(textInput).build();

            // Dialogflow 에이전트에 대한 감지된 의도 받아오기
            try (SessionsClient sessionsClient = SessionsClient.create(SessionsSettings.newBuilder().setCredentialsProvider(() -> credentials).build())) {
                DetectIntentResponse response = sessionsClient.detectIntent(session, queryInput);

                // Dialogflow 응답에서 감지된 의도 및 플리너먼트 텍스트 가져오기
                QueryResult queryResult = response.getQueryResult();
                String fulfillmentText = queryResult.getFulfillmentText();
                log.info("ff"+fulfillmentText);
                // 응답의 액션을 가져옴
                String action = queryResult.getAction();

                // 사용자에게 반환할 응답 구성
                String responseMessage = fulfillmentText;
                return new ResponseEntity<>(responseMessage, HttpStatus.OK);
            }
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
