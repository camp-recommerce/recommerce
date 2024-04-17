/*global kakao*/
import React, { useEffect, useRef, useState } from "react";

const MapComponent = () => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const mapOption = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567), // 초기 지도 중심좌표
      level: 3, // 초기 지도 확대 레벨
    };
    const initializedMap = new kakao.maps.Map(mapContainer.current, mapOption);
    setMap(initializedMap);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(keyword, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        map.setCenter(coords);
      }
    });
  };

  return (
    <div className="map-wrap" style={{ width: "100%", height: "500px" }}>
      <div ref={mapContainer} className="w-full h-full"></div>
      <form onSubmit={handleSearch} className="p-4">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="행정동 이름 검색..."
          className="p-2 text-sm border rounded shadow"
        />
        <button
          type="submit"
          className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          검색
        </button>
      </form>
    </div>
  );
};

export default MapComponent;
