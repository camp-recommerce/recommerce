import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ClipLoader } from "react-spinners";
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
  const [loading, setLoading] = useState(false);
  const [pname, setPName] = useState(""); // pname 상태 추가
  const [pcategory, setPCategory] = useState(""); // pcategory 상태 추가

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
      <InfiniteScroll
        className="infiniteBox"
        dataLength={8}
        next={fetchMoreData}
        pageStart={0}
        hasMore={serverData.hasMore}
        loader={<ClipLoader color={"#123abc"} loading={true} size={100} />}
        endMessage={<p>You are all set!</p>}
      >
        {serverData.dtoList &&
          serverData.dtoList.map((product) => (
            <div
              key={product.pno}
              className="shopList_wrap"
              onClick={() => moveReadPage(product.pno)}
            >
              <div className="shopList_box">
                <div className="shopList_pname text-sm mb-1 text-center">
                  {product.pname}
                </div>
                <div className="shopList_pname text-sm mb-1 text-center">
                  {product.price}원
                </div>
                <div className="shopList_pname text-sm mb-1 text-center">
                  {product.pstate}
                </div>
                <div className="shopList_pname text-sm mb-1 text-center">
                  {product.plocat}
                </div>
                <div className="shopList_pname text-sm mb-1 text-center">
                  {product.pdesc}
                </div>
              </div>
            </div>
          ))}
      </InfiniteScroll>
    </>
  );
};

export default P_InfiniteComponent;
