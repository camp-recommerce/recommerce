import React, { useEffect, useRef, useState } from "react";
import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk";
import { useLocation, useNavigate } from "react-router-dom";
import { buyOne } from "../../api/auctionApi";

const generateOrderId = () => `order_${Date.now()}`;

export function CheckoutPage() {
  const paymentWidgetRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]); // 선택된 상품의 ID를 저장할 상태

  const handleSelectProduct = (productId) => {
    // 이미 선택된 상품인지 확인하고 선택된 상품 목록을 업데이트합니다.
    const isSelected = selectedProducts.includes(productId);
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const { productName, productPrice, productId } = location.state || {};

  useEffect(() => {
    (async () => {
      const paymentWidget = await loadPaymentWidget(
        "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm",
        ANONYMOUS
      );
      paymentWidgetRef.current = paymentWidget;

      paymentWidget.renderPaymentMethods(
        "#payment-method",
        { value: productPrice },
        { variantKey: "DEFAULT" }
      );
      paymentWidget.renderAgreement("#agreement", { variantKey: "DEFAULT" });
    })();
  }, [productPrice]);

  const handlePayment = async () => {
    if (!paymentWidgetRef.current) {
      console.error("결제 위젯이 로드되지 않았습니다.");
      return;
    }
    console.log("apno" + productId);
    buyOne(productId);

    try {
      const response = await paymentWidgetRef.current.requestPayment({
        orderId: generateOrderId(),
        orderName: productName || "Default Product Name",
        customerName: "고객 이름", // 고객 이름 동적 할당
        customerEmail: "customer@example.com", // 고객 이메일 동적 할당
        amount: productPrice,
        successUrl: window.location.origin + "/payment/success", // 성공 시 리디렉션할 경로
        failUrl: window.location.origin + "/payment/fail", // 실패 시 리디렉션할 경로
      });

      if (response.success) {
        navigate("/payment/success");
      } else {
        navigate("/payment/fail");
      }
    } catch (error) {
      console.error("결제 처리 중 오류 발생:", error);
      navigate("/payment/fail"); // 에러 발생 시 실패 페이지로 리디렉션
    }
  };

  return (
    <div className="wrapper w-100">
      <div className="max-w-540 w-100">
        <div id="payment-method" className="w-100" />
        <div id="agreement" className="w-100" />
        <div className="btn-wrapper flex justify-center w-100">
          <button
            className="bg-blue-500 text-white rounded-lg px-4 py-2"
            style={{ width: "200px" }}
            onClick={handlePayment}
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
}
