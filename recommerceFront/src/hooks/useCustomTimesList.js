import { useEffect, useState } from "react";
const useCustomTimesList = (serverData) => {
  // remainingTimes 상태와 그 상태를 업데이트하는 함수인 setRemainingTimes를 선언하고 초기값을 빈 배열로 설정
  const [remainingTimes, setRemainingTimes] = useState([]);
  // useEffect 훅을 사용하여 컴포넌트 렌더링 후 실행할 작업 설정
  useEffect(() => {
    // 만약 서버 데이터의 dtoList 배열의 길이가 0이면 함수 실행 중지
    if (serverData.dtoList.length === 0) return;
    const timer = setInterval(() => {
      // 1초마다 실행되는 타이머 설정
      const now = new Date().getTime();
      // 서버에서 받은 데이터의 dtoList 배열을 순회하면서 경매 상태를 계산
      const remaining = serverData.dtoList.map((auctionProduct) => {
        const startTime = new Date(auctionProduct.apStartTime).getTime();
        const endTime = new Date(auctionProduct.apClosingTime).getTime();
        // 현재 시간이 경매 시작 시간보다 작으면 "경매 시작" 반환
        if (now < startTime) {
          // 경매 시작 시간을 한국 표준 시간대로 형식화하여 문자열로 변환
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
        }
        // 현재 시간이 경매 종료 시간보다 크면 "경매 종료" 반환
        else if (now > endTime) {
          return "경매 종료";
        }
        // 그 외의 경우 "경매 진행 중" 반환
        else {
          return "경매 진행 중";
        }
      });

      // remainingTimes 상태 업데이트
      setRemainingTimes(remaining);
    }, 1000);
    // 컴포넌트가 언마운트되거나 재렌더링될 때 타이머 해제
    return () => clearInterval(timer);
  }, [serverData]); // useEffect가 실행되는 조건으로서 serverData의 변경을 감지
  // remainingTimes 반환
  return remainingTimes;
};

export default useCustomTimesList;
