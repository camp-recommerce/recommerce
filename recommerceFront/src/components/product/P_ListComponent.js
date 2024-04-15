import React, { useState } from "react";
import { API_SERVER_HOST } from "../../services/productApi";
import { formatNumber } from "../../util/formatNumberUtil";

const initState = {
  dtoList: [],
};

const host = API_SERVER_HOST;

const P_ListComponent = () => {
  const [serverData, setServerData] = useState(initState);
  return (
    <div className="shopList_area">
      {serverData.dtoList.map((product) => (
        <div key={product.pno} className="shopList_wrap">
          <div className="shopList_box">
            <div className="shopList_info">
              <div className="shopList_thum">
                <img
                  alt={product.pname}
                  src={`${host}/api/products/view/s_${product.uploadFileNames[0]}`}
                />
              </div>

              <div className="shopList_sum">
                <div className="shopList_pname">{product.pname}</div>
                <div className="shopList_price">
                  {formatNumber(product.price)}원
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default P_ListComponent;
