import { useEffect, useState } from "react";

const useCustomTimes = (apStartTime) => {
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    const updateRemainingTime = () => {
      const endTime = new Date(apStartTime);
      const now = new Date();
      const distance = endTime - now;

      if (distance < 0) {
        setRemainingTime("경매 대기중");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setRemainingTime(`${days}일 ${hours}시간 `);
    };

    const timer = setInterval(updateRemainingTime, 1000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      clearInterval(timer);
    };
  }, [apStartTime]); // startTime 의존성 추가

  return remainingTime; // 남은 시간 상태 반환
};

export default useCustomTimes;
