import React, { useState, useEffect } from "react";
import { fetchProductsByUserFrom } from "../../api/productApi";
import useCustomLogin from "../../hooks/useCustomLoginPage";
import { Link, useParams } from "react-router-dom";
import { readUser } from "../../api/userApi";
import "../../scss/user/PublicProfileComponent.scss";
import AnalysisComponent from "./AnalysisComponent";

const PublicProfileComponent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("onSale");
  const [profile, setProfile] = useState(null);
  const { email } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProductsByUserFrom({
          page: 1,
          size: 50,
          userEmail: email,
        });
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchData();

    if (email) {
      const fetchProfile = async () => {
        try {
          const response = await readUser(email);
          console.log("Profile data:", response);
          setProfile(response);
        } catch (error) {
          console.error("Error fetching public profile:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [email]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

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
    <div className="container">
      <div className="profile-section">
        {profile ? (
          <div>
            <h2>프로필</h2>
            <p>Email: {profile.email}</p>
            <p>닉네임: {profile.nickname}</p>
          </div>
        ) : (
          <div>사용자의 프로필이 없습니다.</div>
        )}
      </div>
      <div className="analysis-section">
        <h2>고객 분석 데이터</h2>
        <AnalysisComponent email={email} />
      </div>
      <div className="products-section">
        <h2>상품 목록</h2>
        <div className="button-group">
          <button
            className={activeTab === "onSale" ? "active" : ""}
            onClick={() => handleTabClick("onSale")}
          >
            판매 중
          </button>
          <button
            className={activeTab === "soldOut" ? "active" : ""}
            onClick={() => handleTabClick("soldOut")}
          >
            판매 완료
          </button>
        </div>
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

export default PublicProfileComponent;
