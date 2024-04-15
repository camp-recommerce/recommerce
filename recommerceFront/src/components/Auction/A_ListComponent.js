import React, { useCallback, useEffect, useState } from "react";
import { getList } from "../../api/auctionApi";
import useCustomMovePage from "../../hooks/useCustomMovePage";
import PagingComponent from "../common/PagingComponent";
import { API_SERVER_HOST } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "../../util/formatNumberUtil";

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
  const [apName, setApName] = useState(""); // 검색어 상태 추가
  const [apCategory, setApCategory] = useState(""); // 카테고리 상태 추가

  useEffect(() => {
    setLoading(true);

    // 검색어와 카테고리 정보를 getList 함수로 전달
    getList({ page, size }).then((data) => {
      setServerData(data);
      setLoading(false);
    });
    console.log(serverData.uploadFileNames);
  }, [page, size, refresh]); // 의존성 배열에 추가

  const navigate = useNavigate();

  const handleClickAdd = useCallback(() => {
    navigate({ pathname: "/auction/add" });
    window.scrollTo(0, 0);
  });

  // 검색어 입력 핸들러
  const handleSearchInputChange = (e) => {
    setApName(e.target.value);
  };

  // 카테고리 선택 핸들러
  const handleCategoryChange = (e) => {
    setApCategory(e.target.value);
  };

  // 검색 버튼 클릭 핸들러
  const handleSearchButtonClick = () => {
    getList({ page: 1, size, apName, apCategory }).then((data) => {
      setServerData(data);
      setLoading(false);
    });
  };

  // 엔터 키 입력 핸들러
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchButtonClick();
    }
  };

  return (
    <div
      className="flex justify-center items-center flex-col"
      style={{ minHeight: "80vh" }}
    >
      {/* minHeight 추가 */}
      <div
        className="shopList_area grid grid-cols-4 gap-4"
        style={{ width: "1160px" }}
      >
        {/* height 삭제 */}
        {serverData.dtoList.map((auctionProduct) => (
          <div
            key={auctionProduct.apno}
            className="shopList_wrap mt-64"
            onClick={() => moveReadPage(auctionProduct.apno)}
            style={{ width: "300px", height: "100px" }}
          >
            <div className="shopList_box">
              <div className="shopList_info flex">
                <div className="shopList_thum mr-2">
                  <img
                    alt={auctionProduct.apno}
                    src={`${host}/auction/view/s_${auctionProduct.uploadFileNames[0]}`}
                    className="w-40 h-40 object-cover"
                  />
                </div>
                <div className="shopList_sum">
                  <div className="shopList_pname text-sm">
                    {auctionProduct.apName}
                  </div>
                  <div className="shopList_price text-sm">
                    {formatNumber(auctionProduct.apStartPrice)}원
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        {/* 페이지 번호와 등록 버튼을 여기로 이동 */}
        <PagingComponent
          serverData={serverData}
          movePage={moveProductListPage}
        />
      </div>
      <div className="shopList_btn fixed right-0 mb-8 mr-8 z-10">
        <div
          className="shopList_addBtn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleClickAdd}
        >
          상품 등록
        </div>
      </div>
    </div>
  );
};

export default A_ListComponent;
