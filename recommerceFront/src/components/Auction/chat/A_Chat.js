import React, { useEffect, useRef, useState } from "react";
import { A_Message } from "./A_Message";
import { v4 as uuidv4 } from "uuid";
import { API_SERVER_HOST } from "../../../api/userApi";

function A_Chat({
  socket,
  username,
  room,
  closeModal,
  startPrice,
  bidIncrement,
  imageSrc,
}) {
  const inputRef = useRef();
  const [messageList, setMessageList] = useState([]);
  const messageBottomRef = useRef(null);
  const host = API_SERVER_HOST;

  const sendMessage = async () => {
    const currentMsg = inputRef.current.value;
    const parsedMsg = parseInt(currentMsg);

    // 입력된 메시지가 숫자가 아니거나, startPrice보다 작은 경우 알림창으로 알림
    if (isNaN(parsedMsg) || parsedMsg <= startPrice) {
      window.alert("입찰가가 시작가 보다 낮습니다.");
      return;
    }

    // bidIncrement로 나누어 떨어지지 않는 경우 알림창으로 알림
    if (parsedMsg % bidIncrement !== 0) {
      window.alert("입찰 단위가 맞지 않습니다.");
      return;
    }
    const currentMonth = new Date().getMonth() + 1;
    // 조건에 맞는 경우에만 메시지 전송
    const messageData = {
      room: room,
      author: username,
      message: currentMsg,
      time:
        currentMonth +
        "." +
        new Date(Date.now()).getDate() +
        "," +
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
      messageType: "BID",
    };
    socket.send(JSON.stringify(messageData));
    setMessageList((list) => [...list, messageData]);
    inputRef.current.value = "";
  };

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessageList((list) => [...list, data]);
      };
    }
  }, [socket]);

  useEffect(() => {
    messageBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  const handleModalClick = (e) => {
    e.stopPropagation(); // 모달 내부 클릭 시 닫히지 않도록 이벤트 전파 중단
  };

  const handleOutsideClick = (e) => {
    closeModal(); // 모달 외부 클릭 시 모달 닫기
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center "
      style={{ zIndex: 999 }}
      onClick={handleOutsideClick} // 모달 외부 클릭 시 모달 닫기
    >
      <div className="bg-black bg-opacity-50 absolute top-0 left-0 w-full h-full"></div>
      <div
        className="bg-white rounded-lg p-8 relative"
        style={{ width: "700px", height: "900px" }}
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
        {/* 상품 정보 표시 */}
        <div className="flex items-center mb-5">
          <img
            src={`${host}/auction/view/${imageSrc}`}
            className="w-24 h-24 mr-8"
          />
          <div>
            <div>시작 가격: {startPrice}원</div>
            <div>입찰 단위: {bidIncrement}원</div>
          </div>
        </div>
        <div
          className="border border-gray-300 rounded-lg overflow-y-auto mb-4"
          style={{ height: "630px" }}
        >
          {messageList.map((messageContent) => {
            return (
              <A_Message
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
            placeholder="입찰 가격을 입력해주세요"
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-blue-600 flex-shrink-0"
            onClick={sendMessage}
          >
            입찰
          </button>
        </div>
      </div>
    </div>
  );
}

export default A_Chat;
