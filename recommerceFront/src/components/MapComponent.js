/*global kakao*/
import React, { useEffect, useRef, useState } from "react";

const MapComponent = ({ initialPosition, onLocationSelect, readOnly }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [address, setAddress] = useState("");
  const [currentPosition, setCurrentPosition] = useState(null);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const initializeMap = (lat, lng) => {
      const mapOption = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 3,
        draggable: !readOnly,
      };

      const initializedMap = new kakao.maps.Map(
        mapContainer.current,
        mapOption
      );
      setMap(initializedMap);

      initializedMap.setDraggable(!readOnly);

      // 마커 이미지의 URL, 크기 및 옵션 설정
      const imageSrc = process.env.PUBLIC_URL + "/images/location.svg", // 마커 이미지의 주소
        imageSize = new kakao.maps.Size(40, 40), // 마커 이미지의 크기
        imageOption = { offset: new kakao.maps.Point(32, 69) }; // 이미지에서 마커의 위치를 조정 (이미지의 중앙 아래가 마커 위치)

      const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng),
        image: markerImage,
      });

      marker.setMap(initializedMap);

      // 지도 중앙 이동 시 마커 위치 업데이트
      kakao.maps.event.addListener(initializedMap, "center_changed", () => {
        const center = initializedMap.getCenter();
        marker.setPosition(center);
        setCurrentPosition(center);
      });

      // 사용자의 현재 위치를 초기 위치로 설정
      if (onLocationSelect) {
        updateAddress(initializedMap.getCenter());
      }
    };

    if (initialPosition) {
      initializeMap(initialPosition.lat, initialPosition.lng);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) =>
            initializeMap(position.coords.latitude, position.coords.longitude),
          (error) => {
            console.error("Geolocation 에러:", error);
            alert("위치 정보를 찾을 수 없습니다.");
            initializeMap(37.566826, 126.9786567); // 에러 시 기본 주소
          }
        );
      } else {
        alert("브라우저가 GPS를 지원하지 않습니다.");
        initializeMap(37.566826, 126.9786567); // 에러 시 기본 주소
      }
    }
  }, [initialPosition, readOnly]);

  // 사용자의 현재 위치로 되돌아오는 설정
  const moveToCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos = new kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          map.setCenter(newPos);
        },
        (error) => {
          console.error("Geolocation 접근 에러:", error);
        }
      );
    }
  };

  // 주소 검색
  const handleSearch = (e) => {
    e.preventDefault();
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(keyword, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        map.setCenter(coords);
        updateAddress(coords);
      }
    });
  };

  // 주소 검색이나 현재 위치 선택 시 업데이트
  const updateAddress = (location) => {
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(
      location.getLng(),
      location.getLat(),
      function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          const addressText = result[0].road_address
            ? result[0].road_address.address_name
            : "도로명 주소가 없습니다.";
          setAddress(addressText);
          // 위치 선택 callback 호출
          onLocationSelect({
            address: addressText,
            lat: location.getLat(),
            lng: location.getLng(),
          });
        }
      }
    );
  };

  return (
    <div className="map-wrap" style={{ width: "700px", height: "300px" }}>
      <div ref={mapContainer} className="w-full h-[500px] relative">
        {!readOnly && (
          <button
            onClick={moveToCurrentPosition}
            className="absolute bottom-[15px] right-[15px] z-10 w-[60px] h-[60px] border-[0.3px] border-[#2822224f] rounded-[50px] bg-white flex justify-center items-center"
          >
            <img
              src={process.env.PUBLIC_URL + "/images/gps.svg"}
              className="w-[30px] h-[30px] z-20"
            />
          </button>
        )}
      </div>
      {!readOnly && (
        <div className="m-4 w-full flex justify-start items-center">
          {/* <div className="mb-2 font-extrabold text-lg min-h-[30px]">
          <p>{address}</p>
        </div> */}
          <form onSubmit={handleSearch} className="flex w-1/2">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="행정동 이름 검색..."
              className="text-sm border rounded shadow py-2 px-4"
            />
            <button
              type="submit"
              className="ml-2 bg-[#282222] hover:bg-[#6f6e6e] text-white font-bold py-2 px-4 rounded whitespace-nowrap"
            >
              검색
            </button>
          </form>
          <button
            onClick={() => updateAddress(currentPosition)}
            className="bg-[#282222] hover:bg-[#6f6e6e] text-white font-bold py-2 px-4 rounded ml-2 my-2"
          >
            현재 위치 선택하기
          </button>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
