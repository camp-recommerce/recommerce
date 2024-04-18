import React, { useState } from "react";
import MapComponent from "../../components/MapComponent";

const P_ModifyPage = () => {
  const [selectedAddress, setSelectedAddress] = useState("");

  const existingLocation = {
    lat: 37.5665, // 위도
    lng: 126.978, // 경도
  };

  const handleLocationSelect = (location) => {
    console.log("선택된 위치:", location);
    setSelectedAddress(location.address);
  };

  return (
    <div>
      P_ModifyPage
      <div className="add_area">
        <div className="add_wrap flex flex-col max-h-[150px]">
          <div className="flex">
            <label>거래장소</label>
            <p>{selectedAddress}</p>
          </div>
          <MapComponent
            initialPosition={existingLocation}
            onLocationSelect={handleLocationSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default P_ModifyPage;
