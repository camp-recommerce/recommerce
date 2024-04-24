import { useState } from "react";

const useCustomChatModal = () => {
  const [socket, setSocket] = useState(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [roomId, setRoomId] = useState(null); // roomId 상태 추가

  const openChatModal = (roomId) => {
    // roomId 매개변수 추가
    const newSocket = new WebSocket(
      `ws:/localhost:8080/api/chat?room=${roomId}`
    );
    newSocket.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(newSocket);
      setIsChatModalOpen(true);
      setRoomId(roomId); // roomId 설정
      console.log(isChatModalOpen);
    };
  };

  const closeChatModal = () => {
    if (socket) {
      socket.close(1000); // 정상 종료 코드 사용
      setSocket(null);
      setIsChatModalOpen(false);
      setRoomId(null); // roomId 초기화
    }
  };

  return { openChatModal, closeChatModal, isChatModalOpen, socket, roomId }; // roomId 반환
};

export default useCustomChatModal;
