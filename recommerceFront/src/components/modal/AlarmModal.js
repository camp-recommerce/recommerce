import React, { useEffect, useState } from "react";
import useCustomChatModal from "../../hooks/useCustomChatModal";
import Chat from "../product/chat/chatcomponents/Chat";
import useCustomLogin from "../../hooks/useCustomLoginPage";
import useCustomChatAlarm from "../../hooks/useCustomChatAlarm";
import { readAlarms } from "../../api/chatAlarmApi";

const AlarmModal = ({ closeModal, email }) => {
  const { openChatModal, isChatModalOpen, socket } = useCustomChatModal(); // closeChatModal 함수 불러오기
  const { loginState } = useCustomLogin();
  const { alarmList: originalAlarmList } = useCustomChatAlarm(); // 기존의 alarmList

  const [groupedAlarms, setGroupedAlarms] = useState({}); // 그룹화된 알람
  const [newAlarmList, setNewAlarmList] = useState(originalAlarmList);

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  };

  const handleReadAlarms = async (senderEmail) => {
    // roomId에 해당하는 알림들을 가져옵니다.
    const alarmsInRoom = groupedAlarms[senderEmail];
    console.log(groupedAlarms);

    // 만약 roomId에 해당하는 알림이 없다면 처리 중단
    if (!alarmsInRoom) {
      console.log("No alarms found for the provided roomId.");
      return;
    }
    // 해당 roomId에 해당하는 알림들의 id 배열을 추출합니다.
    const alarmIds = alarmsInRoom.map((alarm) => alarm.id);

    // 추출된 알람들의 id 배열을 전달하여 알람 상태를 업데이트합니다.
    await readAlarms(alarmIds);
    console.log("Alarms marked as read.");
  };

  useEffect(() => {
    // 새로운 alarmList 설정
    setNewAlarmList(originalAlarmList);
    const groupAlarms = () => {
      const grouped = {};
      newAlarmList.forEach((alarm) => {
        if (!grouped[alarm.senderEmail]) {
          grouped[alarm.senderEmail] = [alarm];
        } else {
          grouped[alarm.senderEmail].push(alarm);
        }
      });
      return grouped;
    };
    setGroupedAlarms(groupAlarms());
  }, [isChatModalOpen, originalAlarmList]);

  const renderGroupedAlarms = () => {
    return Object.keys(groupedAlarms).map((senderEmail, index) => (
      <div key={index}>
        <h3 className="text-lg font-semibold mt-6">
          발신자: {senderEmail}{" "}
          <button
            className="text-blue-500 hover:underline"
            onClick={() => {
              const roomId = groupedAlarms[senderEmail][0].roomId;
              openChatModal(roomId);
              handleReadAlarms(senderEmail);
            }}
          >
            채팅하기
          </button>
        </h3>
        <div>
          {groupedAlarms[senderEmail]
            .filter((alarm) => !alarm.readCheck) // 읽지 않은 알람만 필터링
            .map((alarm, subIndex) => (
              <div key={subIndex} className="border-b border-gray-200 py-2">
                <p>시간: {alarm.createdAt}</p>
                <p>메시지: {alarm.message}</p>
                <div>
                  {isChatModalOpen && (
                    <Chat
                      room={alarm.roomId} // 해당 발신자의 roomId 사용
                      username={loginState.email} // 발신자의 이메일 전달
                      socket={socket}
                      closeModal={() => {
                        closeModal();
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    ));
  };

  return (
    <div
      className="fixed top-0 right-0 bottom-0 left-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 modal-overlay"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-white overflow-y-auto rounded-lg shadow-md p-6 absolute right-10 mt-10"
        style={{ width: 500, height: 700 }}
      >
        <h2 className="text-lg font-semibold">{email}님의 채팅 알림</h2>
        <div className="mt-4">{renderGroupedAlarms()}</div>
      </div>
    </div>
  );
};

export default AlarmModal;
