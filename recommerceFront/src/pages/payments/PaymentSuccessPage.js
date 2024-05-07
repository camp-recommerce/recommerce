import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function PaymentSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 3초 후에 상품 리스트 페이지로 리다이렉션
    const timer = setTimeout(() => {
      console.log("메인페이지로 리다이렉션합니다.");
      navigate("/");
    }, 3000);

    return () => {
      console.log("타이머를 정리합니다.");
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="payment-success-container px-5 py-5 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        결제가 완료되었습니다!
      </h1>
      <p className="text-lg text-gray-700 mb-2">
        고객님의 주문이 성공적으로 처리되었습니다. 주문해주셔서 감사합니다.
      </p>
      <p className="text-lg text-gray-700">
        잠시 후 상품 목록 페이지로 이동합니다...
      </p>
    </div>
  );
}
