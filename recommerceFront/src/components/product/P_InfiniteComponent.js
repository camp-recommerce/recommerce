import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getList } from "../../api/productApi";
import useCustomProductPage from "../../hooks/useCustomProductPage";
import LoadingModal from "../modal/LoadingModal";
import "../../scss/product/ListPage.scss";
import MapComponent from "../MapComponent";

const P_InfiniteComponent = () => {
  const { page, size, moveReadPage } = useCustomProductPage();
  const [serverData, setServerData] = useState({
    dtoList: [],
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
    hasMore: false,
  });

  const categories = ["전체", "신발", "옷", "시계", "기타"];
  const [loading, setLoading] = useState(false);
  const [pname, setPName] = useState(""); // pname 상태 추가
  const [pnameInput, setPNameInput] = useState("");
  const [pcategory, setPCategory] = useState(""); // pcategory 상태 추가
  const [isMapModalOpen, setMapModalOpen] = useState(false);

  const handleCategoryClick = (category) => {
    // "전체"를 선택한 경우
    if (category === "전체") {
      setPCategory(null); // 카테고리를 null로 설정하여 검색 조건을 초기화합니다.
      setPName(""); // 입력값도 초기화합니다.
    } else {
      setPCategory(category);
    }
  };

  const handleSearchInputChange = (e) => {
    setPNameInput(e.target.value);
  };

  const handleSearchButtonClick = () => {
    setPName(pnameInput); // 검색 버튼 클릭 시 pname 상태 업데이트
    setMapModalOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchButtonClick();
    }
  };

  const fetchMoreData = () => {
    if (serverData.hasMore && !loading) {
      setLoading(true);
      const nextPage = serverData.currentPage + 1;
      getList({ page: nextPage, size, pname, pcategory })
        .then((data) => {
          if (data && data.data.length > 0) {
            setServerData((prev) => ({
              ...prev,
              dtoList: prev.dtoList.concat(data.data),
              currentPage: nextPage, // 현재 페이지 업데이트
              totalPages: data.totalPages,
              totalItems: data.totalItems,
              hasMore: data.hasMore,
            }));
          } else {
            setServerData((prev) => ({ ...prev, hasMore: false })); // 데이터가 없으면 hasMore를 false로 설정
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching more product data:", error);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      const categoryQuery = pcategory === "전체" || !pcategory ? "" : pcategory;
      const nameQuery = pname ? pname : "";

      getList({ page: 1, size, pname: nameQuery, pcategory: categoryQuery })
        .then((data) => {
          if (data && data.data) {
            setServerData({
              dtoList: data.data,
              currentPage: data.currentPage,
              totalPages: data.totalPages,
              totalItems: data.totalItems,
              hasMore: data.hasMore,
            });
          } else {
            setServerData((prev) => ({ ...prev, hasMore: false })); // 데이터 없음 처리
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
          setLoading(false);
          setServerData((prev) => ({ ...prev, hasMore: false })); // 에러 발생 시 처리
        });
    };

    fetchData();
  }, [page, size, pname, pcategory]); // 의존성 배열에 pname과 pcategory 추가

  const toggleMapModal = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setMapModalOpen(!isMapModalOpen);
  };

  // 모달 컨테이너 내부 클릭 이벤트 핸들러
  const handleModalClick = (e) => {
    e.stopPropagation(); // 모달 내부에서의 이벤트 버블링 방지
  };

  const handleDistrictSelect = (district) => {
    setPNameInput(district); // 검색 입력란에 동 정보 설정
  };

  return (
    <>
      {loading ? <LoadingModal /> : <></>}
      <div className="searchBox">
        <div className="inputBox">
          <input
            className="searchInput"
            type="text"
            value={pnameInput}
            onChange={handleSearchInputChange}
            onKeyPress={handleKeyPress}
            placeholder="상품 이름 검색"
          />
          <button
            className="btn_search"
            onClick={handleSearchButtonClick} // 검색 버튼 클릭 시 검색 실행
          >
            검색
          </button>
          <button className="btn_search relative" onClick={toggleMapModal}>
            <img
              src={process.env.PUBLIC_URL + "/images/map.svg"}
              className="w-[25px] h-[25px]"
            />
            {isMapModalOpen && (
              <div className="modal" onClick={handleModalClick}>
                <div className="modal-content">
                  <span className="close text-black" onClick={toggleMapModal}>
                    <img
                      src={process.env.PUBLIC_URL + "/images/close.svg"}
                      className="w-[25px] h-[35px] z-20"
                    />
                  </span>
                  <MapComponent
                    isModal={true}
                    onDistrictSelect={handleDistrictSelect}
                  />
                </div>
              </div>
            )}{" "}
          </button>
        </div>
        <div className="categoryBox">
          {categories.map((category) => (
            <div
              key={category}
              className={`cursor-pointer px-3 py-1 bg-gray-100 border border-gray-500 rounded-md h-10 ml-2 ${
                pcategory === category ||
                (category === "전체" && pcategory === null)
                  ? "bg-gray-500"
                  : ""
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </div>
          ))}
        </div>
      </div>
      <InfiniteScroll
        className="infiniteBox"
        dataLength={serverData.dtoList.length}
        next={fetchMoreData}
        pageStart={0}
        hasMore={serverData.hasMore}
        endMessage={<p>You are all set!</p>}
      >
        <div className="shopList_container">
          {serverData.dtoList &&
            serverData.dtoList.map((product) => (
              <div
                key={product.pno}
                className="shopList_wrap"
                onClick={() => moveReadPage(product.pno)}
              >
                <div className="shopList_pname text-sm mb-1 text-center">
                  {product.pname}
                </div>
                <div className="shopList_pcategory text-sm mb-1 text-center">
                  {product.pcategory}
                </div>
                <div className="shopList_price text-sm mb-1 text-center">
                  {product.price}원
                </div>
                <div className="shopList_pstate text-sm mb-1 text-center">
                  {product.pstate}
                </div>
                <div className="shopList_plocat text-sm mb-1 text-center">
                  {product.plocat}
                </div>
                <div className="shopList_pdesc text-sm mb-1 text-center">
                  {product.pdesc}
                </div>
              </div>
            ))}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default P_InfiniteComponent;
