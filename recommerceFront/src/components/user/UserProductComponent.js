import React, { useState, useEffect } from "react";
import { fetchProductsByUser } from "../../api/userApi"; // api 파일의 경로가 올바른지 확인하세요.

const UserProductComponent = ({ email, soldOut }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await fetchProductsByUser(email, soldOut);
      if (fetchedProducts) {
        setProducts(fetchedProducts);
        setError(""); // 에러 메시지 초기화
      } else {
        setError("제품을 불러오는 데 실패했습니다.");
      }
    };

    fetchProducts();
  }, [email, soldOut]);

  return (
    <div>
      <h1>제품 목록</h1>
      {error && <p className="error">{error}</p>}
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.pno}>
              <h2>{product.pname}</h2>
              <p>카테고리: {product.pcategory}</p>
              <p>가격: {product.price}원</p>
              <p>상태: {product.soldOut ? "판매완료" : "판매중"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>등록된 제품이 없습니다.</p>
      )}
    </div>
  );
};

export default UserProductComponent;
