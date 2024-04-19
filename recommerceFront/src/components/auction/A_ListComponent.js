import React, { useCallback, useEffect, useState } from "react";
import { getList } from "../../api/auctionApi";
import useCustomMovePage from "../../hooks/useCustomMovePage";
import PagingComponent from "../common/PagingComponent";
import { API_SERVER_HOST } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "../../util/formatNumberUtil";
import useCustomTimesList from "../../hooks/useCustomTimesList";
import LoadingModal from "../modal/LoadingModal";

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

const categories = ["전체", "신발", "옷", "시계", "기타"];

const A_ListComponent = () => {
  const { page, size, refresh, moveProductListPage, moveReadPage } =
    useCustomMovePage();
  const [serverData, setServerData] = useState(initState);
  const [loading, setLoading] = useState(false);
  const [apNameInput, setApNameInput] = useState("");
  const [apName, setApName] = useState("");
  const [apCategory, setApCategory] = useState("");
  const remainingTimes = useCustomTimesList(serverData); // 사용자 정의 훅 사용

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getList({ page, size, apName, apCategory }).then((data) => {
      console.log(data);
      setServerData(data);
      setLoading(false);
    });
    console.log(serverData.uploadFileNames);
  }, [page, size, refresh, apName, apCategory]); // 의존성 배열에 추가

  useEffect(() => {
    const handleResize = () => {
      // 화면의 너비에 따라 그리드의 열 수를 결정하여 설정합니다.
      const numCols = window.innerWidth > 768 ? 4 : 2;
      document.documentElement.style.setProperty("--grid-cols", numCols);
    };

    // 컴포넌트가 마운트될 때 한 번 실행하고, 창의 크기가 변할 때마다 다시 실행합니다.
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClickAdd = useCallback(() => {
    navigate({ pathname: "/auction/add" });
    window.scrollTo(0, 0);
  });

  const handleCategoryClick = (category) => {
    // "전체"를 선택한 경우
    if (category === "전체") {
      setApCategory(null); // apCategory를 null로 설정
    } else {
      setApCategory(category);
    }
  };

  const handleSearchInputChange = (e) => {
    setApNameInput(e.target.value);
  };

  const handleSearchButtonClick = () => {
    setLoading(true);
    const categoryQuery = apCategory === "ALL" ? "" : apCategory;
    getList({ page: 1, size, apName, apCategory: categoryQuery }).then(
      (data) => {
        setServerData(data);
        setLoading(false);
      }
    );

    setApName(apNameInput); // 입력 창의 값을 변수에 저장
    getList({ page: 1, size, apName: apNameInput, apCategory }).then((data) => {
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
    <>
      {loading ? <LoadingModal /> : <></>}
      <div
        className="flex justify-center items-center flex-col"
        style={{ minHeight: "75vh" }}
      >
        <div
          className="mb-4 flex items-center"
          style={{ marginBottom: "40px" }}
        >
          <input
            type="text"
            value={apNameInput}
            onChange={handleSearchInputChange}
            onKeyPress={handleKeyPress}
            placeholder="상품 이름 검색"
            style={{
              width: "400px",
              padding: "0.375rem 0.75rem",
              border: "1px solid #ccc",
              borderRadius: "0.375rem",
            }}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded h-10 ml-2"
            onClick={handleSearchButtonClick} // 검색 버튼 클릭 시 검색 실행
          >
            검색
          </button>
          <div className="flex items-center ml-4">
            {categories.map((category) => (
              <div
                key={category}
                className={`cursor-pointer px-3 py-1 border border-gray-300 rounded-md h-10 ml-2 ${
                  apCategory === category ||
                  (category === "전체" && apCategory === null)
                    ? "bg-gray-200"
                    : ""
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </div>
            ))}
          </div>
        </div>
        <div
          className="shopList_area grid gap-2"
          style={{
            width: "80%",
            gridTemplateColumns: "repeat(var(--grid-cols), 1fr)",
          }}
        >
          {serverData.dtoList.map((auctionProduct, index) => (
            // A_ListComponent 컴포넌트의 코드에 적용된 부분입니다.
            <div
              key={auctionProduct.apno}
              className="shopList_wrap"
              onClick={() => moveReadPage(auctionProduct.apno)}
              // 마우스를 올렸을 때 크기를 조정
              onMouseEnter={(e) => {
                // 마우스를 올린 요소의 스타일을 직접 수정합니다.
                e.currentTarget.querySelector(".shopList_box").style.transform =
                  "scale(1.05)";
              }}
              // 마우스가 벗어났을 때 원래 크기로
              onMouseLeave={(e) => {
                // 마우스를 벗어난 요소의 스타일을 직접 수정합니다.
                e.currentTarget.querySelector(".shopList_box").style.transform =
                  "scale(1)";
              }}
            >
              <div className="shopList_box">
                <div className="shopList_thum mb-2">
                  <img
                    alt={auctionProduct.apno}
                    src={`${host}/auction/view/s_${auctionProduct.uploadFileNames[0]}`}
                    style={{ width: "100%", height: "400px" }}
                  />
                </div>
                <div className="shopList_sum text-center">
                  <div className="shopList_pname text-sm mb-1">
                    {auctionProduct.apName}
                  </div>
                  <div className="shopList_price text-sm">
                    {auctionProduct.apStatus === "ACTIVE"
                      ? `현재 입찰가: ${formatNumber(
                          auctionProduct.apCurrentPrice
                        )}원`
                      : `경매 시작가: ${formatNumber(
                          auctionProduct.apStartPrice
                        )}원`}
                  </div>
                  {auctionProduct.apStatus === "CLOSED" && (
                    <div className="text-sm">
                      낙찰가:{auctionProduct.apCurrentPrice}원
                    </div>
                  )}
                  <div className="shopList_end text-sm">
                    {remainingTimes[index]}
                  </div>
                </div>
              </div>
            </div>
          ))}
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
          style={{ marginTop: "0px" }}
        >
          <PagingComponent
            serverData={serverData}
            movePage={moveProductListPage}
          />
        </div>
      </div>
    </>
  );
};
export default A_ListComponent;