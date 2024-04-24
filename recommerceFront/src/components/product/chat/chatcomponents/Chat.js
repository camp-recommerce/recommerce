import React, { useEffect, useRef, useState } from "react";
import { A_Message } from "../../../auction/chat/A_Message";
import { v4 as uuidv4 } from "uuid";
import useCustomChatAlarm from "../../../../hooks/useCustomChatAlarm";

function Chat({ socket, username, closeModal, room }) {
  const inputRef = useRef();
  const [messageList, setMessageList] = useState([]);
  const { sendAlarm } = useCustomChatAlarm();

  const [email1, email2] = room.split("-");

  const messageBottomRef = useRef(null);
  // 현재 로그인한 사용자의 이메일이 수신자일 때는 다른 이메일을 수신자로 설정
  const receiverEmail = email1 === username ? email2 : email1;

  const sendMessage = async () => {
    const currentMsg = inputRef.current.value;
    if (currentMsg !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMsg,
        time:
          new Date(Date.now()).getMonth() +
          1 +
          "." +
          new Date(Date.now()).getDate() +
          ", " +
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
        messageType: "MESSAGE",
      };

      const alarm = {
        // 수신인, 방번호가 구매자-판매자 형식이라 loginState 에서 이메일 뽑아오고
        // loginState.email 이랑 맞지 않는 쪽을 수신자로 설정
        userEmail: receiverEmail,
        // 발신인, loginState.email, 로그인한 나
        senderEmail: username,
        roomId: room,
        createdAt: messageData.time,
        message: currentMsg,
      };
      socket.send(JSON.stringify(messageData));
      sendAlarm(alarm);
      setMessageList((list) => [...list, messageData]);
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessageList((list) => [...list, data]);
    };
  }, [socket]);

  useEffect(() => {
    messageBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  const handleModalClick = (e) => {
    e.stopPropagation(); // 모달 내부 클릭 시 닫히지 않도록 이벤트 전파 중단
  };

  const handleOutsideClick = () => {
    closeModal(); // 모달 외부 클릭 시 모달 닫기
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center mt-5"
      style={{ zIndex: 800 }}
      onClick={handleOutsideClick}
    >
      {/* <div
        className="bg-black bg-opacity-50 absolute top-0 left-0 w-full h-full"
        onClick={handleOutsideClick}
      ></div> */}
      <div
        className="bg-white rounded-lg p-8 relative"
        style={{ width: "700px", height: "700px" }}
        onClick={handleModalClick}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-black">{username} 채팅방</h2>
          <button onClick={closeModal}>
            <svg
              className="w-6 h-6 text-gray-600 hover:text-gray-800 transition duration-300"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div
          className="border border-gray-300 rounded-lg overflow-y-auto mb-4"
          style={{ height: "550px" }}
        >
          {messageList.map((messageContent) => {
            return (
              <A_Message
                messageContent={messageContent}
                author={username}
                key={uuidv4()}
              />
            );
          })}
          <div ref={messageBottomRef}></div>
        </div>
        <div className="flex items-center">
          <input
            ref={inputRef}
            className="border border-gray-300 rounded-md px-4 py-2 mr-2 w-full text-black"
            type="text"
            placeholder="메세지를 입력해주세요"
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-blue-600 flex-shrink-0"
            onClick={sendMessage}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
