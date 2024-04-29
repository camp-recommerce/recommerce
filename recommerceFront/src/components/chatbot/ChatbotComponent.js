import React, { useState } from "react";
import axios from "axios"; // HTTP 통신을 위한 라이브러리

const ChatbotComponent = () => {
  // 사용자 입력과 대화 내용을 관리하는 상태 변수들
  const [userInput, setUserInput] = useState(""); // 사용자 입력
  const [conversation, setConversation] = useState([
    // 초기 대화 내용 설정
    {
      speaker: "bot",
      message: "안녕하세요 도어봇입니다! 무엇을 도와드릴까요?",
    },
  ]);

  // 사용자 입력 처리 함수
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  // Dialogflow와의 통신 함수
  const sendMessageToDialogflow = async () => {
    try {
      // 사용자 입력을 포함하여 Dialogflow에 POST 요청 보내기
      const response = await axios.post(
        "http://localhost:8080/chat/send", // 백엔드 엔드포인트 URL
        { message: userInput },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Dialogflow로부터 받은 응답 처리
      let botMessage = response.data;

      // 대화 기록 업데이트: 사용자 입력과 봇의 응답 메시지를 추가
      setConversation([
        ...conversation, // 기존 대화 내용을 유지한 채로 새로운 대화 추가
        { speaker: "user", message: userInput }, // 사용자 입력 추가
        { speaker: "bot", message: botMessage }, // 봇의 응답 메시지 추가
      ]);
    } catch (error) {
      // 오류 처리: Dialogflow와의 통신 중 에러가 발생한 경우
      console.error("Error sending message to Dialogflow:", error);
    }
  };

  // 폼 제출 핸들러 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼의 기본 동작(페이지 새로고침) 방지
    // 사용자 입력을 Dialogflow에 전송
    await sendMessageToDialogflow();
    // 사용자 입력 초기화
    setUserInput("");
  };

  return (
    <div className="chat-container">
      <div className="chatbot-name">Chatbot</div>
      <div className="chat">
        {/* 대화 내용 출력: conversation 배열을 사용하여 반복 렌더링 */}
        {conversation.map((item, index) => (
          <div key={index} className={`message ${item.speaker}`}>
            {item.speaker === "bot" && (
              <div className="bot-header-name">Chatbot</div>
            )}
            {item.message} {/* 대화 내용 출력 */}
          </div>
        ))}
      </div>
      <div className="user-input">
        {/* 사용자 입력 폼 */}
        <form onSubmit={handleSubmit} className="user-input-form">
          {/* 사용자 입력을 받는 입력 필드 */}
          <input type="text" value={userInput} onChange={handleUserInput} />
          {/* 사용자 입력을 전송하는 버튼 */}
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotComponent;
