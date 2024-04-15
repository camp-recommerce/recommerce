import React, { useEffect, useRef, useState } from "react";
import { Message } from "./Message";
import { v4 as uuidv4 } from "uuid";

function Chat({ socket, username, room, closeModal }) {
  const inputRef = useRef();
  const [messageList, setMessageList] = useState([]);

  const messageBottomRef = useRef(null);

  const sendMessage = async () => {
    const currentMsg = inputRef.current.value;
    if (currentMsg !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
        messageType: "MESSAGE",
      };
      socket.send(JSON.stringify(messageData));
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
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-black bg-opacity-50 absolute top-0 left-0 w-full h-full"
        onClick={handleOutsideClick}
      ></div>
      <div
        className="bg-white rounded-lg p-8 relative"
        style={{ width: "700px", height: "700px" }}
        onClick={handleModalClick}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-black">{room}번 채팅방</h2>
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
              <Message
                messageContent={messageContent}
                username={username}
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
