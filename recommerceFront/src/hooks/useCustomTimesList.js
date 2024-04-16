import { useEffect, useState } from "react";

const useCustomTimesList = (serverData) => {
  const [remainingTimes, setRemainingTimes] = useState([]);

  useEffect(() => {
    if (serverData.dtoList.length === 0) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const remaining = serverData.dtoList.map((auctionProduct) => {
        const endTime = new Date(auctionProduct.apStartTime).getTime();
        const distance = endTime - now;

        if (distance <= 0) {
          return "경매 종료";
        } else {
          const endDateTime = new Date(
            auctionProduct.apStartTime
          ).toLocaleString("ko-KR", {
            hour12: false,
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          });
          return endDateTime;
        }
      });
      setRemainingTimes(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [serverData]);

  return remainingTimes;
};

export default useCustomTimesList;
