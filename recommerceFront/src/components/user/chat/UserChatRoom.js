import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getRoomList, deleteAlarm } from "../../../api/chatAlarmApi";
import { API_SERVER_HOST } from "../../../api/userApi";
import useCustomChatModal from "../../../hooks/useCustomChatModal";
import styles from "../../../scss/user/MyPageComponent.module.scss";
import Chat from "../../product/chat/chatcomponents/Chat";

const host = API_SERVER_HOST;

const UserChatRoom = () => {
  const user = useSelector((state) => state.loginSlice);
  const [room, setRoom] = useState([]);
  const { openChatModal, closeChatModal, isChatModalOpen, socket, roomId } =
    useCustomChatModal(); // useNavigate 훅 사용
  const email = user.email;

  useEffect(() => {
    if (user && user.email) {
      const fetchData = async () => {
        const roomList = await getRoomList(email);
        setRoom(roomList);
      };
      fetchData();
    }
  }, [user]);

  const handleDeleteClick = async (roomId) => {
    try {
      await deleteAlarm(roomId);
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: 600,
        marginTop: 10,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className={styles.chatRooms}>
        <h2 className={styles.heading}>대화 알람</h2>
        <hr className={styles.hr} />
        <ul>
          {room.map((chat) => (
            <li key={chat.id}>
              <div className={styles.chatInfo}>
                <span className={styles.chatInfoText}>
                  대화 상대: {chat.senderEmail}
                </span>
                <button
                  className={styles.chatButton}
                  onClick={() => {
                    openChatModal(chat.roomId);
                  }}
                >
                  대화 시작
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => {
                    handleDeleteClick(chat.roomId);
                  }}
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div>
          {isChatModalOpen && (
            <Chat
              room={roomId}
              username={email}
              socket={socket}
              closeModal={closeChatModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserChatRoom;
