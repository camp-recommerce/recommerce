import React, { useState, useEffect, useCallback } from "react";
import { formatNumber } from "../../util/formatNumberUtil"; // 숫자 포맷팅 유틸리티
import { getList } from "../../api/productApi";
import { API_SERVER_HOST } from "../../api/userApi";

const host = API_SERVER_HOST;

const P_ListComponent = () => {
  const [state, setState] = useState({
    dtoList: [],
    totalCount: 0,
    pageRequestDTO: { page: 1, size: 8 },
  });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreData = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const { page, size } = state.pageRequestDTO;

    try {
      const response = await getList({ page, size });

      setState((prevState) => {
        const newDataList = [...prevState.dtoList, ...response.dtoList];
        const newTotalCount = response.totalCount;
        const newHasMore =
          newTotalCount > prevState.dtoList.length + response.dtoList.length;

        setHasMore(newHasMore); // Here we update hasMore based on new data.

        return {
          ...prevState,
          dtoList: newDataList,
          totalCount: newTotalCount,
          pageRequestDTO: { ...prevState.pageRequestDTO, page: page + 1 },
        };
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, state.pageRequestDTO, hasMore]);

  useEffect(() => {
    loadMoreData(); // 컴포넌트 마운트 시 첫 데이터 로드
  }, []);

  return (
    <div className="shopList_area flex flex-col items-center justify-center w-full">
      {state.dtoList.map((product) => (
        <div
          key={product.pno}
          className="shopList_wrap flex flex-col items-center mb-4 p-4 border rounded shadow"
        >
          <div className="shopList_thum mb-2">
            {product.uploadFileNames && product.uploadFileNames[0] && (
              <img
                src={`${host}/api/products/view/s_${product.uploadFileNames[0]}`}
                alt={product.pname}
                className="object-cover"
              />
            )}
          </div>
          <div className="shopList_info">
            <h3 className="text-lg font-bold">{product.pname}</h3>
            <p>
              {product.pcategory} - {product.plocat}
            </p>
            <p className="text-red-500">{formatNumber(product.price)}원</p>
            {product.delFlag && (
              <p className="text-sm text-gray-500">Unavailable</p>
            )}
          </div>
        </div>
      ))}
      {loading && <p>Loading more...</p>}
    </div>
  );
};

export default P_ListComponent;
