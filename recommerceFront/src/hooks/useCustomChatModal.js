import { useState } from "react";

const useCustomChatModal = (room) => {
  const [socket, setSocket] = useState(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const openChatModal = () => {
    const newSocket = new WebSocket(`ws:/localhost:8080/api/chat?room=${room}`);
    newSocket.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(newSocket);
      setIsChatModalOpen(true);
      console.log(isChatModalOpen);
    };
  };

  const closeChatModal = () => {
    if (socket) {
      socket.close(1000); // 정상 종료 코드 사용
      setSocket(null);
      setIsChatModalOpen(false);
    }
  };

  return { openChatModal, closeChatModal, isChatModalOpen, socket };
};

export default useCustomChatModal;
