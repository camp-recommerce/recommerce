import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainPageCenter from "./MainPageCenter";

function MainPage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false); // 화면 크기를 감지하기 위한 상태
  const navigate = useNavigate();

  useEffect(() => {
    // 화면 크기를 확인하여 isMobile 상태 업데이트
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1230);
    };

    // 초기화 시점에 한 번 호출하여 현재 화면 크기를 설정
    handleResize();

    // 리사이즈 이벤트에 대한 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const plusSlides = (n) => {
    setSlideIndex((prevIndex) => {
      const newIndex = (prevIndex + n) % 3;
      return newIndex < 0 ? 2 : newIndex;
    });
  };

  const handleImageClick = () => {
    navigate("/auction/list?page=1&size=4");
  };

  return (
    <div className="main-container flex flex-col items-center justify-center">
      <div className="big-image flex items-center justify-center w-3/4 h-100">
        <img
          src="/images/bigmainimage.jpg"
          alt="BigImage"
          onClick={handleImageClick}
          style={{ cursor: "pointer", height: "100%", width: "100%" }}
        />
      </div>
      <MainPageCenter />
      <div className="slideshow-container flex items-center justify-center w-full h-96">
        {!isMobile ? (
          <div className="slides flex items-center justify-center w-3/4 h-96 overflow-hidden">
            <img
              src="/images/mainimage1.jpg"
              className="slide"
              style={{ width: "30%", height: "auto" }}
              alt="Slide 1"
            />
            <img
              src="/images/mainimage2.jpg"
              className="slide"
              style={{ width: "30%", height: "auto" }}
              alt="Slide 2"
            />
            <img
              src="/images/mainimage3.jpg"
              className="slide "
              style={{ width: "30%", height: "auto" }}
              alt="Slide 3"
            />
          </div>
        ) : (
          <div className="slides flex items-center justify-center w-3/4 overflow-hidden relative h-80">
            <button
              className="prev text-xl font-bold absolute left-0 top-1/2 transform -translate-y-1/2"
              onClick={() => plusSlides(-1)}
            >
              &#10094;
            </button>
            <img
              src={`/images/mainimage${slideIndex + 1}.jpg`}
              className="slide"
              style={{ width: "100%", height: "100%" }}
              alt={`Slide ${slideIndex + 1}`}
            />
            <button
              className="next text-xl font-bold absolute right-0 top-1/2 transform -translate-y-1/2"
              onClick={() => plusSlides(1)}
            >
              &#10095;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;
