import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getList } from "../../api/productApi";
import useCustomProductPage from "../../hooks/useCustomProductPage";
import "../../scss/product/ListPage.scss";
import MapComponent from "../MapComponent";
import { API_SERVER_HOST } from "../../api/userApi";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { FaMapMarkedAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const host = API_SERVER_HOST;

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
  const modalRef = useRef();

  const toggleMapModal = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
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
    // 데이터 목록 초기화와 첫 페이지 설정
    setServerData({
      dtoList: [],
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
      hasMore: true,
    });
  };

  const handleSearchInputChange = (e) => {
    setPNameInput(e.target.value);
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

  const fetchMoreData = () => {
    if (serverData.currentPage >= serverData.totalPages) {
      setServerData((prev) => ({ ...prev, hasMore: false }));
      return;
    }

    const nextPage = serverData.currentPage + 1; // 다음 페이지 번호 계산

    getList({ page: nextPage, size, pname: pname, pcategory: pcategory })
      .then((data) => {
        if (data && data.data.length > 0) {
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
    setMapModalOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchButtonClick();
    }
  };

  // 모달 컨테이너 내부 클릭 이벤트 핸들러
  const handleModalClick = (e) => {
    e.stopPropagation(); // 모달 내부에서의 이벤트 버블링 방지
  };

  const handleDistrictSelect = (district) => {
    setPNameInput(district); // 검색 입력란에 동 정보 설정
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setMapModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          <button
            className="btn_search relative w-[54px] h-[54px]"
            onClick={toggleMapModal}
          >
            <FaMapMarkedAlt size="24" color="#fff" />
            {isMapModalOpen && (
              <div className="modal" onClick={handleModalClick} ref={modalRef}>
                <div className="modal-content">
                  <span className="close text-black" onClick={toggleMapModal}>
                    <AiOutlineCloseSquare size="26" color="#6f6e6e" />
                  </span>
                  <MapComponent
                    isModal={true}
                    onDistrictSelect={handleDistrictSelect}
                  />
                </div>
              </div>
            )}
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
        className="infiniteBox min-h-[300px]"
        dataLength={serverData.dtoList.length}
        next={fetchMoreData}
        hasMore={serverData.hasMore}
        endMessage={
          serverData.dtoList.length > 0 ? (
            <p>You are all set!</p>
          ) : (
            <p className="h-[300px] text-center flex flex-col justify-center items-center">
              <span>검색 결과가 없습니다.</span>
              <span>검색 조건을 변경해보세요.</span>
            </p>
          )
        }
      >
        <div className="shopList_container">
          {serverData.dtoList &&
            serverData.dtoList.map((product) => (
              <div
                key={product.pno}
                className="shopList_wrap"
                onClick={() => moveReadPage(product.pno)}
              >
                <div className="shopList_uploadImage text-sm mb-1 text-center">
                  <img
                    alt={product.pname}
                    src={`${host}/product/view/${product.uploadFileNames}`}
                  />
                </div>
                <div className="shopList_pname text-sm mb-1 text-center">
                  {product.pname}
                </div>

                <div className="shopList_price text-sm mb-1 text-center">
                  {product.price}원
                </div>
              </div>
            ))}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default P_InfiniteComponent;
