import React, { useCallback, useEffect, useState } from "react";
import { getList } from "../../api/auctionApi";
import useCustomMovePage from "../../hooks/useCustomMovePage";
import PagingComponent from "../common/PagingComponent";
import { API_SERVER_HOST } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "../../util/formatNumberUtil";
import useCustomTimesList from "../../hooks/useCustomTimesList";

const host = API_SERVER_HOST;

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const A_ListComponent = () => {
  const { page, size, refresh, moveProductListPage, moveReadPage } =
    useCustomMovePage();
  const [serverData, setServerData] = useState(initState);
  const [loading, setLoading] = useState(false);
  const [apName, setApName] = useState("");
  const [apCategory, setApCategory] = useState("");
  const remainingTimes = useCustomTimesList(serverData); // 사용자 정의 훅 사용

  useEffect(() => {
    setLoading(true);
    getList({ page, size }).then((data) => {
      setServerData(data);
      setLoading(false);
    });
  }, [page, size, refresh]);

  const navigate = useNavigate();

  const handleClickAdd = useCallback(() => {
    navigate({ pathname: "/auction/add" });
    window.scrollTo(0, 0);
  });

  const handleSearchInputChange = (e) => {
    setApName(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setApCategory(e.target.value);
  };

  const handleSearchButtonClick = () => {
    getList({ page: 1, size, apName, apCategory }).then((data) => {
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
      className="flex justify-center items-center flex-col"
      style={{ minHeight: "70vh" }}
    >
      <div className="mb-4">
        <input
          type="text"
          value={apName}
          onChange={handleSearchInputChange}
          onKeyPress={handleKeyPress}
          placeholder="상품 이름 검색"
          style={{
            width: "400px",
            padding: "0.375rem 0.75rem",
            border: "1px solid #ccc",
            borderRadius: "0.375rem",
            marginBottom: "20px",
          }}
        />
        <select
          value={apCategory}
          onChange={handleCategoryChange}
          className="px-3 py-1 border border-gray-300 rounded-md w-100 h-10 ml-2"
        >
          <option value="">전체 카테고리</option>
        </select>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded h-10 ml-2"
          onClick={handleSearchButtonClick}
        >
          검색
        </button>
      </div>
      <div
        className="shopList_area grid grid-cols-4 gap-2"
        style={{ width: "80%" }}
      >
        {serverData.dtoList.length === 0 ? (
          <div></div>
        ) : (
          serverData.dtoList.map((auctionProduct, index) => (
            <div
              key={auctionProduct.apno}
              className="shopList_wrap"
              onClick={() => moveReadPage(auctionProduct.apno)}
            >
              <div
                className="shopList_box"
                style={{ width: "300px", height: "400px" }}
              >
                <div className="shopList_thum mb-2">
                  <img
                    alt={auctionProduct.apno}
                    src={`${host}/auction/view/s_${auctionProduct.uploadFileNames[0]}`}
                    style={{ width: "300px", height: "400px" }}
                  />
                </div>
                <div className="shopList_sum text-center">
                  <div className="shopList_pname text-sm mb-1">
                    {auctionProduct.apName}
                  </div>
                  <div className="shopList_price text-sm">
                    시작가: {formatNumber(auctionProduct.apStartPrice)}원
                  </div>
                  <div className="shopList_end text-sm">
                    경매 종료까지: {remainingTimes[index]}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="shopList_btn fixed right-0 mb-8 mr-8 z-10">
        <div
          className="shopList_addBtn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleClickAdd}
        >
          상품 등록
        </div>
      </div>
      <div
        className="flex justify-center items-center"
        style={{ marginTop: "90px" }}
      >
        <PagingComponent
          serverData={serverData}
          movePage={moveProductListPage}
        />
      </div>
    </div>
  );
};

export default A_ListComponent;
