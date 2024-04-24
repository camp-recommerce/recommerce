import { useEffect, useRef } from "react";

const ImageModal = ({ openImg, callbackFn, imagePath }) => {
  // useRef 훅을 사용하여 모달 바깥쪽 요소를 참조합니다.
  const modalRef = useRef(null);

  useEffect(() => {
    // 모달 바깥쪽을 클릭했을 때의 이벤트 핸들러입니다.
    const handleClickOutside = (event) => {
      // 모달 바깥쪽 요소가 존재하고, 클릭한 요소가 모달 바깥쪽에 포함되지 않는 경우 모달을 닫습니다.
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // 콜백 함수가 존재하는 경우 콜백 함수를 호출하여 모달을 닫습니다.
        if (callbackFn) {
          callbackFn();
        }
      }
    };

    // 모달이 열렸을 때만 이벤트 리스너를 추가합니다.
    if (openImg) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // 모달이 닫혔을 때는 이벤트 리스너를 제거합니다.
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // 컴포넌트가 언마운트되거나 업데이트될 때 이벤트 리스너를 제거합니다.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openImg, callbackFn]);

  // 모달이 닫혔을 때는 null을 반환하여 모달을 숨깁니다.
  if (!openImg) return null;
  return (
    // 모달을 화면 가운데에 고정하여 표시합니다.
    <div className="fixed top-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
      {/* 모달 영역입니다. */}
      <div className="bg-black w-3/5 h-3/5 min-w-400 flex justify-center items-center">
        {/* 모달 내부입니다. */}
        <div ref={modalRef} className="relative w-full h-full">
          {/* 모달 닫기 버튼입니다. */}
          <button
            className="absolute top-2 right-2 w-8 h-8 bg-black text-white border border-black flex justify-center items-center cursor-pointer"
            onClick={() => {
              if (callbackFn) {
                callbackFn();
              }
            }}
          >
            X
          </button>
          {/* 이미지를 표시하는 부분입니다. */}
          <img
            src={imagePath}
            alt="productImage"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
