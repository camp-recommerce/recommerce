import React, { useState, useEffect } from "react";

function MainPage() {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % 3); // 이미지 개수에 맞게 수정
    }, 5000); // 이미지를 2초마다 자동으로 변경

    return () => clearInterval(interval);
  }, []);

  const plusSlides = (n) => {
    setSlideIndex((prevIndex) => {
      // 계산된 새 인덱스
      const newIndex = (prevIndex + n) % 3;
      // newIndex가 음수일 경우 (즉, 현재가 0이고 prev를 누를 경우)
      return newIndex < 0 ? 2 : newIndex; // 3개의 슬라이드가 있으므로 마지막 인덱스는 2
    });
  };

  return (
    <div className="slideshow-container flex items-center justify-center w-full h-50vh ">
      <div className="slides flex items-center justify-center w-full">
        <button
          className="prev text-xl font-bold"
          onClick={() => plusSlides(-1)}
        >
          &#10094;
        </button>
        <img
          src="/images/mainimage1.jpg"
          className={
            slideIndex === 0 ? " slide block w-120 h-96" : "slide hidden"
          }
          alt="Slide 1"
        />
        <img
          src="/images/mainimage2.jpg"
          className={
            slideIndex === 1 ? "slide block  w-120 h-96" : "slide hidden"
          }
          alt="Slide 2"
        />
        <img
          src="/images/mainimage3.jpg"
          className={
            slideIndex === 2 ? "slide block w-120 h-96" : "slide hidden"
          }
          alt="Slide 3"
        />
        <button
          className="next text-xl font-bold"
          onClick={() => plusSlides(1)}
        >
          &#10095;
        </button>
      </div>
    </div>
  );
}

export default MainPage;
