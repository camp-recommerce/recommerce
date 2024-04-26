import React, { useState, useEffect } from "react";
import { fetchProductsByUserFrom } from "../../api/productApi";
import useCustomLogin from "../../hooks/useCustomLoginPage";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loginState } = useCustomLogin();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProductsByUserFrom({
          page: 1,
          size: 10,
          userEmail: loginState.email,
        });
        setProducts(data); // 제품 목록 설정
        setLoading(false); // 로딩 상태 갱신
      } catch (error) {
        console.error("제품 목록을 불러오는 중 오류가 발생했습니다:", error);
        setLoading(false); // 로딩 상태 갱신
      }
    };

    fetchData(); // 데이터 가져오기 함수 호출
  }, []); // userEmail 값이 변경될 때마다 다시 불러오기

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!products || products.length === 0) {
    return <div>제품이 없습니다.</div>;
  }

  return (
    <div>
      <h2>제품 목록</h2>
      <ul>
        {products.dtoList.map((product) => (
          <li key={product.pno}>{product.pname}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
