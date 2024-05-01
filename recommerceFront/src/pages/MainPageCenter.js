import React, { useRef, useState } from "react";
import "../scss/MainPageCenter.scss";

function ImageScroll() {
  const scrollContainer = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  const startDragging = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainer.current.offsetLeft);
    setScrollLeftStart(scrollContainer.current.scrollLeft);
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const onDrag = (e) => {
    if (isDragging) {
      e.preventDefault();
      const x = e.pageX - scrollContainer.current.offsetLeft;
      const walk = (x - startX) * 1; //scroll-fast
      scrollContainer.current.scrollLeft = scrollLeftStart - walk;
    }
  };

  // 추가: 마우스를 뗐을 때도 드래그 중단 처리를 하기 위한 이벤트 리스너
  React.useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const images = Array.from(
    { length: 12 },
    (_, i) => `/images/brand${i + 1}.png`
  );

  return (
    <div className="MainCenterBox flex flex-col  justify-between w-2/3">
      <p class="text-lg font-bold mb-4">Brand List</p>
      <div
        ref={scrollContainer}
        className="cursor-grab flex overflow-x-scroll scrollbar-hide space-x-4"
        onMouseDown={startDragging}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onMouseMove={onDrag}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Brand ${index + 1}`}
            className="flex-shrink-0 w-36 h-28 object-cover"
            draggable="false" // 이미지 드래그 방지
          />
        ))}
      </div>
    </div>
  );
}

export default ImageScroll;
