import { useEffect, useState } from "react";

const useCustomTimesList = (serverData) => {
  const [remainingTimes, setRemainingTimes] = useState([]);

  useEffect(() => {
    if (serverData.dtoList.length === 0) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const remaining = serverData.dtoList.map((auctionProduct) => {
        const startTime = new Date(auctionProduct.apStartTime).getTime();
        const endTime = new Date(auctionProduct.apClosingTime).getTime();

        if (now < startTime) {
          const startDateTime = new Date(
            auctionProduct.apStartTime
          ).toLocaleString("ko-KR", {
            hour12: false,
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          });
          return `경매 시작: ${startDateTime}`;
        } else if (now > endTime) {
          return "경매 종료";
        } else {
          return "경매 진행 중";
        }
      });
      setRemainingTimes(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [serverData]);

  return remainingTimes;
};

export default useCustomTimesList;
