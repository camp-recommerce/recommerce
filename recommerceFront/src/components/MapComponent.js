/*global kakao*/
import React, { useEffect, useRef, useState } from "react";

const MapComponent = () => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [address, setAddress] = useState("");
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    const mapOption = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567), // 초기 지도 중심좌표
      level: 3, // 초기 지도 확대 레벨
    };
    const initializedMap = new kakao.maps.Map(mapContainer.current, mapOption);
    setMap(initializedMap);

    // 마커 생성 및 지도 중앙 고정
    const marker = new kakao.maps.Marker({
      position: mapOption.center,
    });
    marker.setMap(initializedMap);

    // 지도 중앙 이동 시 마커 위치 업데이트
    kakao.maps.event.addListener(initializedMap, "center_changed", () => {
      const center = initializedMap.getCenter();
      marker.setPosition(center);
      setCurrentPosition(center);
    });

    // 사용자의 현재 위치를 초기 위치로 설정
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = new kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          initializedMap.setCenter(currentLocation);
          marker.setPosition(currentLocation);
          setCurrentPosition(currentLocation);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  // 주소 검색 및 설정
  const findAddress = () => {
    const geocoder = new kakao.maps.services.Geocoder();
    const center = map.getCenter();
    geocoder.coord2Address(
      center.getLng(),
      center.getLat(),
      function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          setAddress(
            result[0].road_address
              ? result[0].road_address.address_name
              : "도로명 주소가 없습니다."
          );
        }
      }
    );
  };

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
          console.error("Error accessing geolocation:", error);
        }
      );
    }
  };

  return (
    <div className="map-wrap" style={{ width: "100%", height: "800px" }}>
      <div ref={mapContainer} className="w-full h-[500px] relative">
        <button
          onClick={moveToCurrentPosition}
          className="absolute bottom-[15px] right-[15px] z-10 w-[50px] h-[50px] rounded-3xl bg-white flex justify-center items-center"
        >
          <img
            src={process.env.PUBLIC_URL + "/images/gps.svg"}
            className="w-[30px] h-[30px] z-20"
          />
        </button>
      </div>
      <div className="m-4 w-full flex flex-col justify-center items-center">
        <div className="mb-2 font-extrabold text-lg">
          <p>{address}</p>
        </div>
        <button
          onClick={findAddress}
          className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded mb-4"
        >
          현재 위치 선택하기
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
