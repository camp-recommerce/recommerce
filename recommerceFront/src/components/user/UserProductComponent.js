import React, { useState, useEffect } from "react";
import { fetchProductsByUserFrom } from "../../api/productApi";
import useCustomLogin from "../../hooks/useCustomLoginPage";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('onSale'); // 상태 관리를 위해 'onSale' 또는 'soldOut' 사용
  const { loginState } = useCustomLogin();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProductsByUserFrom({
          page: 1,
          size: 10,
          userEmail: loginState.email,
        });
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("제품 목록을 불러오는 중 오류가 발생했습니다:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [loginState.email]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '20px' }}>로딩 중...</div>;
  }

  if (!products || products.length === 0) {
    return <div style={{ textAlign: 'center', marginTop: '20px' }}>상품이 없습니다.</div>;
  }

  const filteredProducts = products.dtoList.filter(product =>
    activeTab === 'onSale' ? !product.soldOut : product.soldOut
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>상품 목록</h2>
      <div>
        <button onClick={() => setActiveTab('onSale')}>판매 중</button>
        
        <button onClick={() => setActiveTab('soldOut')}>판매 완료</button>
      </div>
      <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          alignItems: 'flex-start'
      }}>
        {filteredProducts.map((product) => (
          <div key={product.pno} style={{
            background: '#f0f0f0',
            width: 'calc(50% - 10px)',
            margin: '5px',
            padding: '15px',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            boxSizing: 'border-box'
          }}>
            <Link to={`/product/read/${product.pno}`} style={{
              textDecoration: 'none',
              color: 'black',
              display: 'block'
            }}>
              <strong>{product.pname}</strong> - {product.pcategory} - {product.price.toLocaleString()}원
              <div style={{ fontSize: '14px', color: '#555' }}>상태: {product.pstate}</div>
              <div style={{ fontSize: '14px', color: '#555' }}>위치: {product.plocat}</div>
              <div style={{ fontSize: '14px', color: '#555' }}>상세 설명: {product.pdesc}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
