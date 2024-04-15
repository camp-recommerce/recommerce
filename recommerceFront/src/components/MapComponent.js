/*global kakao*/
import React, { useEffect, useRef, useState } from "react";

const MapComponent = () => {
  const mapContainer = useRef(null); // 지도를 담을 컨테이너의 ref
  const [map, setMap] = useState(null); // 지도 객체를 상태로 관리
  const [locationInfo, setLocationInfo] = useState({
    addressName: "",
    code: "",
  });

  useEffect(() => {
    const options = {
      center: new kakao.maps.LatLng(37.57011257004789, 126.9772250564715), // 초기 주소 광화문역
      isPanto: true,
      level: 4,
    };
    const mapInstance = new kakao.maps.Map(mapContainer.current, options);
    setMap(mapInstance); // 지도 객체를 상태로 저장
  }, []);

  useEffect(() => {
    if (map) {
      // 지도 객체가 초기화된 후 이벤트 리스너 설정
      kakao.maps.event.addListener(map, "click", function (mouseEvent) {
        const latlng = mouseEvent.latLng;
        const geocoder = new kakao.maps.services.Geocoder();

        const callback = function (result, status) {
          if (status === kakao.maps.services.Status.OK) {
            setLocationInfo({
              addressName: result[0].address_name,
              code: result[0].code,
            });
          }
        };

        geocoder.coord2RegionCode(latlng.getLng(), latlng.getLat(), callback);
      });
    }
  }, [map]); // map 객체가 변할 때마다 이벤트 리스너를 다시 설정

  return (
    <div className="map-wrap w-4/5 h-96 border-2 border-black">
      <div ref={mapContainer} className="map-box w-full h-full"></div>
      <div>
        <p>지역 명칭: {locationInfo.addressName}</p>
        <p>행정구역 코드: {locationInfo.code}</p>
      </div>
    </div>
  );
};

export default MapComponent;
