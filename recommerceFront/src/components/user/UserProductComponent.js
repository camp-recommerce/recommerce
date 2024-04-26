import React, { useState, useEffect } from "react";
import { fetchProductsByUserFromProductApi } from "../../api/productApi";

const UserProductComponent = ({ email, soldOut }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("pno");
  const [direction, setDirection] = useState("DESC");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetchProductsByUserFromProductApi(
          email,
          soldOut,
          page,
          size,
          sortBy,
          direction
        );
        if (response && response.data && response.data.length > 0) {
          setProducts(response.data);
          setError("");
        } else {
          setError("제품을 불러오는 데 실패했습니다.");
        }
      } catch (err) {
        console.error("제품 목록 조회 중 오류가 발생했습니다:", err);
        setError("제품 목록을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [email, soldOut, page, size, sortBy, direction]);

  return (
    <div>
      <h1>제품 목록</h1>
      {loading && <p>로딩 중...</p>}
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
        !loading && <p>등록된 제품이 없습니다.</p>
      )}
    </div>
  );
};

export default UserProductComponent;
