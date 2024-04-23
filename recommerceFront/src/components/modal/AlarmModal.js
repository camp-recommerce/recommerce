import React, { useEffect, useState } from "react";
import useCustomChatAlarm from "../../hooks/useCustomChatAlarm";

const AlarmModal = ({ closeModal, email }) => {
  const { alarmList, sendAlarm, refreshAlarm } = useCustomChatAlarm();
  const [groupedAlarms, setGroupedAlarms] = useState([]);

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeModal(); // 모달 외부를 클릭하면 모달 닫기
    }
  };

  const handleAlarmClick = async () => {
    // 알람 목록을 순회하며 각각의 알람을 읽음 상태로 변경하고 전송
    for (const alarm of alarmList) {
      const readAlarm = {
        ...alarm,
        readCheck: true,
        // 읽음 처리
      };
      sendAlarm(readAlarm); // 알람을 배열로 감싸서 전송
    }
    refreshAlarm(); // 알람 목록을 업데이트
  };

  useEffect(() => {
    const groupAlarms = () => {
      const grouped = {};
      alarmList.forEach((alarm) => {
        if (!grouped[alarm.senderEmail]) {
          grouped[alarm.senderEmail] = 1; // 새로운 발신자의 경우 개수를 1로 초기화
        } else {
          grouped[alarm.senderEmail] += 1; // 기존 발신자의 경우 개수를 1 증가
        }
      });
      return grouped;
    };

    setGroupedAlarms(groupAlarms());
  }, [alarmList]);

  const renderGroupedAlarms = () => {
    return Object.keys(groupedAlarms).map((senderEmail, index) => (
      <div key={index}>
        <h3 className="text-lg font-semibold mt-6">발신자: {senderEmail}</h3>
        <p>알람 개수: {groupedAlarms[senderEmail]}</p>
        <button onClick={handleAlarmClick}>읽음으로 표시</button>{" "}
        {/* 클릭 시 모든 알림을 읽음으로 표시 */}
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
