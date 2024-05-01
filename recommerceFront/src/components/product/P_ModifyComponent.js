import { useEffect, useRef, useState } from "react";
import { deleteOne, getOne, putOne } from "../../api/productApi";
import LoadingModal from "../modal/LoadingModal";
import AlertModal from "../modal/AlertModal";
import useCustomProductPage from "../../hooks/useCustomProductPage";
import "../../scss/product/ModifyPage.scss";
import { API_SERVER_HOST } from "../../api/userApi";
import { useNavigate, useParams } from "react-router-dom";
import MapComponent from "../MapComponent";

const initState = {
  pname: "",
  price: 0,
  pcategory: "",
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
  const [result, setResult] = useState(null);
  const [formattedPrice, setFormattedPrice] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { moveBeforeReadPage } = useCustomProductPage();
  const [location, setLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showFileSelect, setShowFileSelect] = useState(true); // 파일 선택 창 표시 여부
  const uploadRef = useRef();
  const navigate = useNavigate();

  const categories = ["신발", "옷", "시계", "기타"];

  useEffect(() => {
    getOne(pno).then((data) => {
      setProduct(data);
      // 데이터 로딩 시 숫자 가격을 콤마 포맷으로 변환하여 상태에 저장
      setFormattedPrice(
        data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
      setLocation({ lat: data.lat, lng: data.lng });
      // 이미지 파일명이 존재할 경우 이미지 미리보기 설정
      if (data.uploadFileNames.length > 0) {
        setImagePreviewUrl(`${host}/product/view/${data.uploadFileNames}`);
        setShowFileSelect(false); // 이미지 파일이 있으면 파일 선택 창 숨김
      }
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

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    // other data
    formData.append("pname", product.pname);
    formData.append("price", product.price);
    formData.append("pcategory", product.pcategory);
    formData.append("pstate", product.pstate);
    formData.append("plocat", product.plocat);
    formData.append("addressLine", product.addressLine);
    formData.append("lat", location.lat); // 하위 MapComponent에서 콜백 함수로 위도 전달
    formData.append("lng", location.lng); // 하위 MapComponent에서 콜백 함수로 경도 전달
    formData.append("pdesc", product.pdesc);
    formData.append("delFlag", product.delFlag);

    for (let i = 0; i < product.uploadFileNames.length; i++) {
      formData.append("uploadFileNames", product.uploadFileNames[i]);
    }

    setLoading(true);

    putOne(pno, formData).then((data) => {
      setResult("Modified");
      setLoading(false);
    });
  };

  const handleClickDelete = () => {
    setLoading(true);
    deleteOne(product).then((data) => {
      setResult("Deleted");
      setLoading(false);
      alert("삭제되었습니다.");
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

  const handleImagePreview = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
      setShowFileSelect(false); // 이미지를 선택한 후 파일 선택 창 숨김
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const cancelImageUpload = () => {
    setProduct({ ...product, uploadFileNames: [] }); // 파일 목록 초기화
    uploadRef.current.value = null; // 파일 업로드 input의 값 초기화
    setShowFileSelect(true); // 파일 선택 창 표시
    setImagePreviewUrl(""); // 이미지 미리보기 초기화
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
          {imagePreviewUrl ? (
            <img alt={product.pname} src={imagePreviewUrl} />
          ) : (
            <label htmlFor="uploadImage"></label>
          )}
          <input
            ref={uploadRef}
            id="uploadImage"
            type="file"
            multiple={true}
            onChange={handleImagePreview}
            style={{ display: showFileSelect ? "block" : "none" }} // Adjusted condition
          />
          {imagePreviewUrl && (
            <button className="deleteBtn" onClick={cancelImageUpload}>
              취소
            </button>
          )}
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
            <div className="modify-info ">카테고리</div>
            <select
              name="pcategory"
              value={product.pcategory}
              onChange={handleChangeProduct}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="modify-wrap">
            <div className="modify-info ">조건 선택 </div>
            <input
              type="radio"
              id="condition1"
              name="pstate"
              value="최상"
              checked={product.pstate === "최상"}
              onChange={handleChangeProduct}
            />
            <label htmlFor="condition1">최상</label>

            <input
              type="radio"
              id="condition2"
              name="pstate"
              value="상"
              checked={product.pstate === "상"}
              onChange={handleChangeProduct}
            />
            <label htmlFor="condition2">상</label>

            <input
              type="radio"
              id="condition3"
              name="pstate"
              value="중"
              checked={product.pstate === "중"}
              onChange={handleChangeProduct}
            />
            <label htmlFor="condition3">중</label>
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
            <div className="modify_wrap ">
              <div className="modify_area_text">
                <div className="modify-info ">거래장소</div>
                <input
                  name="plocat"
                  type="text"
                  value={product.plocat}
                  onChange={handleChangeProduct}
                />
              </div>
              <MapComponent
                initialPosition={location}
                onLocationSelect={handleLocationSelect}
              />
            </div>
          </div>
          {/* 관리자만 확인 가능 */}
          {/* <div className="modify-wrap">
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
          </div> */}
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
