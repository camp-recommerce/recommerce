import { useEffect, useRef, useState } from "react";
import { deleteOne, getOne, putOne } from "../../api/productApi";
import LoadingModal from "../modal/LoadingModal";
import AlertModal from "../modal/AlertModal";
import useCustomProductPage from "../../hooks/useCustomProductPage";
import ImageModal from "../modal/ImageModal";
import "../../scss/product/ModifyPage.scss";
import { API_SERVER_HOST } from "../../api/userApi";
import { useNavigate, useParams } from "react-router-dom";
import MapComponent from "../MapComponent";

const initState = {
  pname: "",
  price: 0,
  pstate: "",
  plocat: "",
  addressLine: "",
  lat: "",
  lng: "",
  pdesc: "",
  delFlag: false,
  uploadFileNames: [],
};

const host = API_SERVER_HOST;

const P_ModifyComponent = () => {
  const { pno } = useParams();
  const [product, setProduct] = useState({ ...initState });
  const [openImg, setOpenImg] = useState(false);
  const [result, setResult] = useState(null);
  const [formattedPrice, setFormattedPrice] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImgPath, setSelectedImgPath] = useState("");
  const { moveBeforeReadPage } = useCustomProductPage();
  const [location, setLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const uploadRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    getOne(pno).then((data) => {
      setProduct(data);
      // 데이터 로딩 시 숫자 가격을 콤마 포맷으로 변환하여 상태에 저장
      setFormattedPrice(
        data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
      setLocation({ lat: data.lat, lng: data.lng });
    });
  }, [pno]);

  const handleChangeProduct = (e) => {
    let { name, value } = e.target;
    if (name === "price") {
      // 입력 값에서 숫자만 추출
      const numericValue = value.replace(/[^\d]/g, "");
      // 상태 업데이트
      setProduct({
        ...product,
        [name]: numericValue,
      });
      // 콤마 포맷으로 변환하여 별도의 상태에 저장
      setFormattedPrice(numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    } else {
      setProduct({
        ...product,
        [name]: value,
      });
    }
  };

  // 주소 처리
  const handleLocationSelect = (loc) => {
    setLocation(loc);
    setSelectedAddress(loc.address);
    // 선택된 주소를 자동으로 입력
    setProduct((prevProduct) => ({
      ...prevProduct,
      addressLine: loc.addressLine,
    }));
  };

  const handleClickModify = () => {
    const files = uploadRef.current.files;
    const formData = new FormData();

    // other data
    formData.append("pname", product.pname);
    formData.append("price", product.price);
    formData.append("pstate", product.pstate);
    formData.append("plocat", product.plocat);
    formData.append("addressLine", product.addressLine);
    formData.append("lat", location.lat); // 하위 MapComponent에서 콜백 함수로 위도 전달
    formData.append("lng", location.lng); // 하위 MapComponent에서 콜백 함수로 경도 전달
    formData.append("pdesc", product.pdesc);
    formData.append("delFlag", product.delFlag);

    setLoading(true);

    putOne(pno, formData).then((data) => {
      setResult("Modified");
      setLoading(false);
    });
  };

  // 이미지 등록 시 미리보기 생성s
  const handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleClickDelete = () => {
    setLoading(true);
    deleteOne(product).then((data) => {
      setResult("Deleted");
      setLoading(false);
    });
  };

  const closeAlertModal = () => {
    if (result === "Deleted") {
      navigate("/");
    } else {
      moveBeforeReadPage(pno);
    }
    setResult(null);
  };

  const handleOpenImg = (imgFile) => {
    setSelectedImgPath(`${host}/product/view/${imgFile}`);
    setOpenImg(true);
  };

  const closeImageModal = () => {
    setOpenImg(false);
  };

  return (
    <div className="modify_group">
      <div className="modify_title">상품 수정</div>
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
      <div className="modify_container">
        {/* 상품 이미지 영역 */}
        <div className="modify_imgArea">
          <div className="modify_imgRemove">
            {product.uploadFileNames.map((imgFile, i) => (
              <div className="modify-box" key={i}>
                <div className="imageContainer">
                  <img
                    alt={product.pname}
                    // src={`${host}/product/view/s_${imgFile}`}
                    src="/winter.jpg"
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
              </div>
            ))}
          </div>
          <div className="modify_imgAdd">
            <div className="image_upload_preview">
              {imagePreviewUrl ? (
                <img src={imagePreviewUrl} className="addImage" alt="preview" />
              ) : (
                <label htmlFor="uploadImage">파일 선택</label>
              )}
              <input
                ref={uploadRef}
                id="uploadImage"
                type="file"
                multiple={true}
                onChange={handleImageChange}
                style={{ display: "none" }}
                alt={product.pname}
              />
            </div>
          </div>
        </div>
        {/* 상품 상세 영역 */}
        <div className="modify_textArea">
          <div className="modify-wrap ">
            <div className="modify-info">상품명</div>
            <input
              name="pname"
              type={"text"}
              value={product.pname}
              onChange={handleChangeProduct}
            ></input>
          </div>

          <div className="modify-wrap">
            <div className="modify-info ">판매가</div>
            <input
              name="price"
              type={"text"}
              value={formattedPrice}
              onChange={handleChangeProduct}
            ></input>
          </div>
          <div className="modify-wrap">
            <label>조건 선택 </label>
            <br />
            <input
              type="radio"
              id="condition1"
              name="pstate"
              value="최상"
              checked={product.pstate === "최상"}
              onChange={handleChangeProduct}
            />
            <label htmlFor="condition1">최상</label>
            <br />
            <input
              type="radio"
              id="condition2"
              name="pstate"
              value="상"
              checked={product.pstate === "상"}
              onChange={handleChangeProduct}
            />
            <label htmlFor="condition2">상</label>
            <br />
            <input
              type="radio"
              id="condition3"
              name="pstate"
              value="중"
              checked={product.pstate === "중"}
              onChange={handleChangeProduct}
            />
            <label htmlFor="condition3">중</label>
            <br />
            <input
              type="radio"
              id="condition4"
              name="pstate"
              value="하"
              checked={product.pstate === "하"}
              onChange={handleChangeProduct}
            />
            <label htmlFor="condition4">하</label>
          </div>
          <div className="modify-wrap ">
            <div className="modify-info ">상품 상세</div>
            <textarea
              name="pdesc"
              rows="4"
              onChange={handleChangeProduct}
              value={product.pdesc}
            >
              {product.pdesc}
            </textarea>
          </div>
          <div className="modify_area">
            <div className="modify_wrap flex flex-col max-h-[150px]">
              <div className="flex">
                <label>거래장소</label>
                <input
                  name="plocat"
                  type="text"
                  value={product.plocat}
                  onChange={handleChangeProduct}
                />
              </div>
              <p>{selectedAddress}</p>
              <MapComponent
                initialPosition={location}
                onLocationSelect={handleLocationSelect}
              />
            </div>
          </div>
          <div className="modify-wrap r">
            <div className="modify-info">삭제 여부</div>
            <select
              name="delFlag"
              value={product.delFlag}
              onChange={handleChangeProduct}
              className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            >
              <option value={false}>유효함</option>
              <option value={true}>삭제됨</option>
            </select>
          </div>
        </div>
      </div>
      {/* 버튼 영역 */}
      <div className="shopModify_btn">
        <button
          type="button"
          className="shopModify_modifyBtn"
          onClick={handleClickModify}
        >
          수정
        </button>
        <button
          type="button"
          className="shopModify_deleteBtn"
          onClick={handleClickDelete}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default P_ModifyComponent;
