import React, { useEffect, useState } from "react";
import { API_SERVER_HOST, getList } from "../../api/productApi";
import { formatNumber } from "../../util/formatNumberUtil";

const initState = {
  dtoList: [],
};

const categories = ["전체", "신발", "옷", "시계", "기타"];

const host = API_SERVER_HOST;

const P_ListComponent = () => {
  const [serverData, setServerData] = useState(initState);
  const [pcategory, setPcategory] = useState("");
  const [pname, setPname] = useState("");
  const [loading, setLoading] = useState(false);
  const [pnameInput, setPnameInput] = useState("");

  useEffect(() => {
    setLoading(true);
    getList({ pname, pcategory }).then((data) => {
      setServerData(data);
      setLoading(false);
    });
    console.log(serverData.uploadFileNames);
  }, [pname, pcategory]); // 의존성 배열에 추가

  const handleSearchInputChange = (e) => {
    setPname(e.target.value);
  };

  const handleCategoryClick = (category) => {
    // "전체"를 선택한 경우
    if (category === "전체") {
      setPcategory(null); // pcategory를 null로 설정
    } else {
      setPcategory(category);
    }
  };

  const handleSearchButtonClick = () => {
    setLoading(true);
    const categoryQuery = pcategory === "ALL" ? "" : pcategory;
    getList({ pname, pcategory: categoryQuery }).then((data) => {
      setServerData(data);
      setLoading(false);
    });

    setPname(pnameInput); // 입력 창의 값을 변수에 저장
    getList({ pname: pnameInput, pcategory }).then((data) => {
      setServerData(data);
      setLoading(false);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchButtonClick();
    }
  };

  return (
    <div
      className="shopList_area flex items-center justify-center "
      style={{ width: "100%", height: "auto" }}
    >
      <div
        className="flex items-center justify-center"
        style={{ marginBottom: "20px", height: "auto", width: "100%" }}
      >
        <input
          type="text"
          value={pname}
          onChange={handleSearchInputChange}
          onKeyPress={handleKeyPress}
          placeholder="상품 검색"
          style={{
            width: "60%",
            padding: "0.375rem 0.75rem",
            border: "1px solid #ccc",
            borderRadius: "0.375rem",
          }}
        />
        <button
          className="bg-[#282222] hover:bg-[#6f6e6e] text-white font-bold py-1 px-4 rounded h-10 ml-2"
          onClick={handleSearchButtonClick} // 검색 버튼 클릭 시 검색 실행
        >
          검색
        </button>
        <div className="flex items-center ml-4">
          {/* {categories.map((category) => (
            <div
              key={category}
              className={`cursor-pointer px-3 py-1 border border-gray-300 rounded-md h-10 ml-2 ${
                pcategory === category ||
                (category === "전체" && pcategory === null)
                  ? "bg-gray-200"
                  : ""
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </div>
          ))} */}
        </div>
      </div>
      {/* {serverData.dtoList.map((product) => (
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
      ))} */}
    </div>
  );
};

export default P_ListComponent;
