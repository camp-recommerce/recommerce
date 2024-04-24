import { useEffect, useState } from "react";
import { getOne } from "../../api/productApi";
import LoadingModal from "../modal/LoadingModal";
import ImageModal from "../modal/ImageModal";
import Chat from "../product/chat/chatcomponents/Chat";
import useCustomLoginPage from "../../hooks/useCustomLoginPage";
import useCustomProductPage from "../../hooks/useCustomProductPage";
import "../../scss/product/ReadPage.scss";
import useCustomWishListPage from "../../hooks/useCustomWishListPage";

import MapComponent from "../MapComponent";

import useCustomChatModal from "../../hooks/useCustomChatModal";
import { API_SERVER_HOST } from "../../api/userApi";
import { useParams } from "react-router-dom";

const host = API_SERVER_HOST;

const initState = {
  pname: "",
  price: "",
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
  const { moveModifyPage } = useCustomProductPage();
  const { loginState } = useCustomLoginPage();
  const { changeCart, cartItems, refreshCart } = useCustomWishListPage();
  const { openChatModal, closeChatModal, isChatModalOpen, socket } =
    useCustomChatModal();

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

  return (
    <div className="shopRead_group ">
      {loading ? <LoadingModal /> : <></>}

      {/* 상품 영역 */}
      <div className="shopRead_img">
        <img
          alt="product"
          src={`${host}/product/view/${product.uploadFileNames}`}
          onClick={handleOpenImg}
        />
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
            <label>
              <strong>상품이름 :</strong>
            </label>
            <div className="shopRead_pname">{product.pname}</div>
          </div>
          <div className="shopRead_box">
            <label>
              <strong>가격 :</strong>
            </label>
          </div>
          <div className="shopRead_box">
            <div className="shopRead_price">{product.userEmail}</div>
          </div>
          <div className="shopRead_box">
            <div className="shopRead_price">{product.price}</div>
          </div>
          <div className="shopRead_box">
            <label>
              <strong>상품상태 :</strong>
            </label>
            <div className="shopRead_pstate">{product.pstate}</div>
          </div>
          <div className="shopRead_box">
            <label>
              <strong>상세설명 :</strong>
            </label>
            <div className="shopRead_pdesc">{product.pdesc}</div>
          </div>
          <div className="shopRead_box_location">
            <div className="shopRead_plocat">
              <div className="flex">
                <label>
                  <strong>거래장소 :</strong>
                </label>
                <p>{product.plocat}</p>
              </div>
              <MapComponent
                initialPosition={{ lat: product.lat, lng: product.lng }}
                readOnly={true}
              />
            </div>
          </div>
          <div className="btn_modify">
            {loginState.email === product.userEmail && (
              <button onClick={() => moveModifyPage(product.pno)}>
                수정하기
              </button>
            )}
          </div>
          <button
            className="btn_chat bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900"
            onClick={() => {
              openChatModal(loginState.email + product.userEmail);
            }}
          >
            1:1 채팅
          </button>
          <button
            className="btn_cart bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900 mt-5"
            onClick={() => handleClickAddCart()}
          >
            찜
          </button>
          <div className="btn_sell bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900 mt-5">
            {loginState.email === product.userEmail && (
              <button>판매완료</button>
            )}
          </div>
          <div>
            {isChatModalOpen && (
              <Chat
                // user0@aaa.com 을 임시 판매자로 설정, 나중엔 product.seller 뭐 이렇게될듯
                room={loginState.email + product.userEmail}
                username={loginState.email}
                socket={socket}
                closeModal={closeChatModal}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default P_ReadComponent;
