import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getList } from "../../api/productApi";
import useCustomProductPage from "../../hooks/useCustomProductPage";
import LoadingModal from "../modal/LoadingModal";
import "../../scss/product/ListPage.scss";

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
    setLoading(true);
    const categoryQuery = pcategory === "ALL" ? "" : pcategory;
    getList({ page: 1, size, pname, pcategory: categoryQuery }).then((data) => {
      setServerData(data);
      setLoading(false);
    });
    setPName(pnameInput); // 입력 창의 값을 변수에 저장
    getList({ page: 1, size, pname: pnameInput, pcategory }).then((data) => {
      setServerData(data);
      setLoading(false);
    });
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
    setLoading(true);
    getList({ page, size, pname, pcategory })
      .then((data) => {
        console.log(data); // 여기에서 데이터 구조 확인
        if (data && data.data) {
          // 데이터 유효성 검사
          setServerData({
            dtoList: data.data,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalItems: data.totalItems,
            hasMore: data.hasMore,
          });
        } else {
          // 데이터가 없거나 예상 구조와 다른 경우 처리
          console.error("No data or unexpected data structure:", data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching initial product data:", error);
        setLoading(false);
      });
  }, [page, size, pname, pcategory]);

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
