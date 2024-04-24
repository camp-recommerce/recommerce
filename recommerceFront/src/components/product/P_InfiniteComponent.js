import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getList } from "../../api/productApi";
import useCustomProductPage from "../../hooks/useCustomProductPage";
import "../../scss/product/ListPage.scss";
import MapComponent from "../MapComponent";

const P_InfiniteComponent = () => {
  const { page, size, moveReadPage } = useCustomProductPage();
  const [serverData, setServerData] = useState({
    dtoList: [],
    currentPage: 0,
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

  const toggleMapModal = () => {
    setMapModalOpen(!isMapModalOpen);
  };

  const handleCategoryClick = (category) => {
    // "전체"를 선택한 경우
    if (category === "전체") {
      setPCategory(null); // 카테고리를 null로 설정하여 검색 조건을 초기화합니다.
      setPNameInput(""); // 입력값도 초기화합니다.
      setPName(""); // 입력값도 초기화합니다.
    } else {
      setPCategory(category);
    }
  };

  const handleSearchInputChange = (e) => {
    setPNameInput(e.target.value);
  };

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      const categoryQuery = pcategory === "전체" || !pcategory ? "" : pcategory;
      const nameQuery = pname ? pname : "";

      getList({ page, size, pname: nameQuery, pcategory: categoryQuery })
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

  const fetchMoreData = () => {
    if (serverData.currentPage >= serverData.totalPages) {
      setServerData((prev) => ({ ...prev, hasMore: false }));
      return;
    }

    const nextPage = serverData.currentPage + 1;

    getList({ page: nextPage, size, pname: pname, pcategory: pcategory })
      .then((data) => {
        if (data && data.data) {
          setServerData((prev) => ({
            dtoList: prev.dtoList.concat(data.data),
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalItems: data.totalItems,
            hasMore: data.hasMore,
          }));
        } else {
          setServerData((prev) => ({ ...prev, hasMore: false }));
        }
      })
      .catch((error) => {
        console.error("Error fetching more product data:", error);
        setServerData((prev) => ({ ...prev, hasMore: false }));
      });
  };

  const handleSearchButtonClick = () => {
    setPName(pnameInput); // 검색 버튼 클릭 시 pname 상태 업데이트
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchButtonClick(); // 엔터 키 입력 시 검색 실행
    }
  };

  return (
    <>
      <div className="searchBox">
        <div className="inputBox">
          <input
            className="searchInput"
            type="text"
            value={pnameInput}
            onChange={handleSearchInputChange}
            onKeyPress={handleKeyPress}
            placeholder="상품 이름 혹은 거래장소 검색"
          />
          <button
            className="btn_search"
            onClick={handleSearchButtonClick} // 검색 버튼 클릭 시 검색 실행
          >
            검색
          </button>
          <button className="btn_search" onClick={toggleMapModal}>
            <img
              src={process.env.PUBLIC_URL + "/images/map.svg"}
              className="w-[25px] h-[25px]"
              alt="searchLocate"
            />
          </button>
          {isMapModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={toggleMapModal}>
                  &times;
                </span>
                <MapComponent readOnly={false} />
              </div>
            </div>
          )}
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
