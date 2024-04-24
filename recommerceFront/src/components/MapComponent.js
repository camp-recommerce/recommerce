/*global kakao*/
import React, { useEffect, useRef, useState } from "react";

const MapComponent = ({
  initialPosition,
  onLocationSelect,
  readOnly,
  isModal,
  onDistrictSelect,
}) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [address, setAddress] = useState("");
  const [roadAddress, setRoadAddress] = useState("");
  const [currentPosition, setCurrentPosition] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(""); // 주소를 저장할 상태 추가

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
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng),
        image: new kakao.maps.MarkerImage(
          process.env.PUBLIC_URL + "/images/location.svg",
          new kakao.maps.Size(30, 30),
          { offset: new kakao.maps.Point(15, 30) }
        ),
      });
      marker.setMap(initializedMap);

      // 지도 중앙 이동 시 마커 위치 업데이트
      kakao.maps.event.addListener(initializedMap, "center_changed", () => {
        const center = initializedMap.getCenter();
        marker.setPosition(center);
        setCurrentPosition(center);
      });

      // 드래그 끝난 후 주소 업데이트
      kakao.maps.event.addListener(initializedMap, "dragend", () => {
        updateAddress(initializedMap.getCenter());
      });
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
          updateAddress(newPos);
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
          const roadAddressText = result[0].road_address // 도로명 주소 가져오고, 도로명 주소 없는 곳에만 지번 주소 가져옴
            ? result[0].road_address.address_name
            : result[0].address.address_name;
          setSelectedAddress(roadAddressText);
          const addressText = result[0].address.address_name; // 도로명 주소 <-> 지번 주소 전환 버튼 추가 시 사용
          const addressInfo = result[0].address; // 지번 주소 정보 객체
          const addressLine = `${addressInfo.region_1depth_name} ${addressInfo.region_2depth_name} ${addressInfo.region_3depth_name}`;
          const district = addressInfo.region_3depth_name; // 동 정보만 추출
          if (isModal && onDistrictSelect) {
            onDistrictSelect(district); // 모달 사용 시에만 동 정보 전달
          } else if (!readOnly && onLocationSelect) {
            onLocationSelect({
              address: roadAddressText,
              lat: location.getLat(),
              lng: location.getLng(),
              addressLine: addressLine,
            });
          }
        }
      }
    );
  };

  return (
    <div className="map-wrap" style={{ width: "600px", height: "350px" }}>
      {!readOnly && (
        <div className="my-4 w-full flex justify-start items-center">
          <form onSubmit={handleSearch} className="flex w-1/2">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={
                isModal
                  ? "원하는 지역을 검색해주세요."
                  : "동명(읍, 면)으로 검색 (ex. 서초동)"
              }
              className="text-sm border rounded shadow py-2 px-4 min-w-[228px]"
            />
            <button
              type="submit"
              className="ml-2 bg-[#282222] hover:bg-[#6f6e6e] text-white font-bold py-2 px-4 rounded whitespace-nowrap"
            >
              검색
            </button>
          </form>
          <p>{selectedAddress}</p>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-[350px] relative">
        {!readOnly && (
          <button
            onClick={moveToCurrentPosition}
            className="absolute bottom-[15px] right-[15px] z-10 w-[40px] h-[40px] border-[0.3px] border-[#2822224f] rounded-[50px] bg-white flex justify-center items-center"
          >
            <img
              src={process.env.PUBLIC_URL + "/images/gps.svg"}
              className="w-[20px] h-[20px] z-20"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
