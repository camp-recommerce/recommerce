import React, { useState, useEffect } from "react";
import { fetchProductsByUserFrom } from "../../api/productApi";
import useCustomLogin from "../../hooks/useCustomLoginPage";
import { Link } from "react-router-dom";
import "../../scss/user/UserProductComponent.scss"; // SCSS 파일 임포트

const UserProductComponent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("onSale");
  const { loginState } = useCustomLogin();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProductsByUserFrom({
          page: 1,
          size: 50,
          userEmail: loginState.email,
        });
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading products:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [loginState.email]);

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!products || products.length === 0) {
    return <div className="no-products">상품이 없습니다.</div>;
  }

  const filteredProducts = products.dtoList.filter((product) =>
    activeTab === "onSale" ? !product.soldOut : product.soldOut
  );

  return (
    <div className="user-product-container">
      <h2 className="heading">상품 목록</h2>
      <div className="button-group">
        <button
          className={activeTab === "onSale" ? "active" : ""}
          onClick={() => setActiveTab("onSale")}
        >
          판매 중
        </button>
        <button
          className={activeTab === "soldOut" ? "active" : ""}
          onClick={() => setActiveTab("soldOut")}
        >
          판매 완료
        </button>
      </div>
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.pno} className="product-card">
            <Link to={`/product/read/${product.pno}`} className="product-link">
              <strong>{product.pname}</strong> - {product.pcategory} -{" "}
              {product.price.toLocaleString()}원
              <div className="product-details">상태: {product.pstate}</div>
              <div className="product-details">위치: {product.plocat}</div>
              <div className="product-details">상세 설명: {product.pdesc}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProductComponent;
