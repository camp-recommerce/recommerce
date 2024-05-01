import { useEffect, useRef, useState } from "react";
import { getOne, soldOut } from "../../api/productApi";
import LoadingModal from "../modal/LoadingModal";
import ImageModal from "../modal/ImageModal";
import Chat from "../product/chat/chatcomponents/Chat";
import useCustomLoginPage from "../../hooks/useCustomLoginPage";
import useCustomProductPage from "../../hooks/useCustomProductPage";
import "../../scss/product/ReadPage.scss";
import useCustomWishListPage from "../../hooks/useCustomWishListPage";
import MapComponent from "../MapComponent";
import { Link } from "react-router-dom"; // 맨 위에 추가
import { formatNumber } from "../../util/formatNumberUtil";

import useCustomChatModal from "../../hooks/useCustomChatModal";
import { API_SERVER_HOST } from "../../api/userApi";
import { useNavigate, useParams } from "react-router-dom";
import AlertModal from "../modal/AlertModal";

const host = API_SERVER_HOST;

const initState = {
  pname: "",
  price: "",
  pcategory: "",
  pstate: "",
  plocat: "",
  addressLine: "",
  pdesc: "",
  lat: "",
  lng: "",
  fileName: [],
  loading: false,
  result: null,
  imagePreviewUrl: "",
};

const P_ReadComponent = () => {
  const { pno } = useParams();
  const [product, setProduct] = useState(initState);
  const [loading, setLoading] = useState(false);
  const [selectedImgPath, setSelectedImgPath] = useState("");
  const [openImg, setOpenImg] = useState(false);
  const { moveModifyPage, moveBeforeReadPage } = useCustomProductPage();
  const { loginState } = useCustomLoginPage();
  const { changeCart, cartItems, refreshCart } = useCustomWishListPage();
  const { openChatModal, closeChatModal, isChatModalOpen, socket } =
    useCustomChatModal();

  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (pno) {
      setLoading(true);
      getOne(pno)
        .then((data) => {
          setProduct(data);
          setLoading(false);
          console.log(data);
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          setLoading(false);
        });
    } else {
      console.error("Product number (pno) is undefined.");
    }
  }, [pno]);

  const handleOpenImg = (uploadFileNames) => {
    setSelectedImgPath(`${host}/product/view/${uploadFileNames}`);
    setOpenImg(true);
  };

  const closeImageModal = () => {
    setOpenImg(false);
  };

  const handleClickSoldOut = () => {
    setLoading(true);
    soldOut(product.pno).then((data) => {
      setResult("soldOut");
      setLoading(false);
    });
  };

  const handleClickAddCart = () => {
    const addedItem = cartItems.find((item) => item.pno === Number(pno)); // 명시적인 형변환
    if (addedItem !== undefined) {
      // 상품을 찾지 못한 경우에 대한 조건 추가
      window.alert("이미 추가된 상품입니다.");
    } else {
      changeCart({ email: loginState.email, pno: pno, qty: 1 });
      window.alert("찜 했습니다!");
      refreshCart();
    }
  };

  const handleCilkToList = () => {
    navigate("/");
    window.scrollTo(0, 0);
  };

  const closeAlertModal = () => {
    if (result === "soldOut") {
      navigate("/");
    }
  };

  return (
    <div className="shopRead_group ">
      {loading ? <LoadingModal /> : <></>}
      {result ? (
        <AlertModal
          title={`${result}`}
          content={"정상적으로 처리되었습니다."} //결과 모달창
          callbackFn={closeAlertModal}
        />
      ) : (
        <></>
      )}

      {/* 상품 영역 */}
      <div className="shopRead_img">
        <img
          alt="product"
          src={`${host}/product/view/${product.uploadFileNames}`}
          onClick={() => {
            setOpenImg(true);
            setSelectedImgPath(
              `${host}/product/view/${product.uploadFileNames}`
            );
          }}
        />
        <button className="goBack_btn" onClick={handleCilkToList}>
          목록으로
        </button>
      </div>
      {openImg && (
        <ImageModal
          openImg={openImg}
          callbackFn={closeImageModal}
          imagePath={selectedImgPath}
        />
      )}
      <div className="shopRead_details">
        <div className="shopRead_area">
          <div className="shopRead_box">
            <div className="item_info">
              <strong>상품이름</strong>
            </div>
            <p>{product.pname}</p>
          </div>
          <div className="shopRead_box">
            <div className="item_info">
              <strong>가격</strong>
            </div>
            <p key={product.price}>{formatNumber(product.price)}원</p>
          </div>
          <div className="shopRead_box">
            <div className="item_info">
              <strong>판매자</strong>
            </div>
            <p>
              <Link
                to={`/myPage/profile/${product.userEmail}`}
                style={{
                  color: "#000",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                {product.userEmail}
              </Link>
            </p>
          </div>
          <div className="shopRead_box">
            <div className="item_info">
              <strong>카테고리</strong>
            </div>
            <div className="shopRead_pstate">{product.pcategory}</div>
          </div>

          <div className="shopRead_box">
            <div className="item_info">
              <strong>상품상태</strong>
            </div>
            <div className="shopRead_pstate">{product.pstate}</div>
          </div>
          <div className="shopRead_box">
            <div className="item_info">
              <strong>상세설명</strong>
            </div>
            <p>{product.pdesc}</p>
          </div>
          <div className="shopRead_box_location">
            <div className="item_info">
              <strong>거래장소</strong>
            </div>
            <p>{product.plocat}</p>
            {product.lat && product.lng && (
              <MapComponent
                initialPosition={{ lat: product.lat, lng: product.lng }}
                readOnly={true}
              />
            )}
          </div>
          <div className="btnBox">
            <div className="btnforSeller">
              {loginState.email === product.userEmail && (
                <button
                  className="btn_modify  bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900 "
                  onClick={() => moveModifyPage(product.pno)}
                >
                  수정하기
                </button>
              )}
              {loginState.email === product.userEmail && (
                <button
                  className="btn_sell bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900"
                  onClick={handleClickSoldOut}
                >
                  판매완료
                </button>
              )}
            </div>
            <div className="btnforAll">
              <button
                className="btn_chat bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900"
                onClick={() => {
                  openChatModal(loginState.email + "-" + product.userEmail);
                }}
              >
                1:1 채팅
              </button>
              <button
                className="btn_cart bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900 "
                onClick={() => handleClickAddCart()}
              >
                찜
              </button>
            </div>
            <div>
              {isChatModalOpen && (
                <Chat
                  // user0@aaa.com 을 임시 판매자로 설정, 나중엔 product.seller 뭐 이렇게될듯
                  room={loginState.email + "-" + product.userEmail}
                  username={loginState.email}
                  socket={socket}
                  closeModal={closeChatModal}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default P_ReadComponent;
