import { useRef, useState } from "react";
import { postOne } from "../../api/productApi";
import AlertModal from "../modal/AlertModal";
import LoadingModal from "../modal/LoadingModal";
import "../../scss/product/AddPage.scss";
import useCustomProductPage from "../../hooks/useCustomProductPage";
import MapComponent from "../MapComponent";
import useCustomLoginPage from "../../hooks/useCustomLoginPage";

const initState = {
  pname: "",
  pcategory: "기타",
  price: "",
  pstate: "",
  plocat: "",
  addressLine: "",
  lat: "",
  lng: "",
  pdesc: "",
  files: [],
  userEmail: "",
  soldOut: false,
};

const P_AddComponent = () => {
  const [product, setProduct] = useState({ ...initState });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const { moveToPath } = useCustomProductPage();
  const [location, setLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const { loginState } = useCustomLoginPage();

  const uploadRef = useRef();

  const handleChangeProduct = (e) => {
    let { name, value } = e.target;
    if (name === "price") {
      // 가격 콤마 표시 후 숫자만 반환
      value = value.replace(/[^\d]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else if (name === "soldOut") {
      // 셀렉트 박스에서는 문자열 "true" 또는 "false"가 전달되므로,
      // 해당 값을 불리언 값으로 변환하여 상태에 설정합니다.
      value = value === "true";
    }
    setProduct({
      ...product,
      [name]: value,
    });
  };

  // 이미지 등록 시 미리보기 생성
  const handleImagePreview = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
      uploadRef.current.style.display = "none"; // 이미지를 선택한 후 파일 선택 창 숨김
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const cancelImageUpload = () => {
    setProduct({ ...product, files: [] }); // 파일 목록 초기화
    uploadRef.current.value = null; // 파일 업로드 input의 값 초기화
    uploadRef.current.style.display = "block"; // 파일 선택 창 다시 표시
    setImagePreviewUrl(""); // 이미지 미리보기 초기화
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

  const handleClickAdd = (e) => {
    const files = uploadRef.current.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    //other data
    formData.append("pname", product.pname);
    formData.append("pcategory", product.pcategory);
    formData.append("price", product.price.replace(/[^\d]/g, ""));
    formData.append("pstate", product.pstate);
    formData.append("plocat", product.plocat);
    formData.append("addressLine", product.addressLine);
    formData.append("lat", location.lat); // 하위 MapComponent에서 콜백 함수로 위도 전달
    formData.append("lng", location.lng); // 하위 MapComponent에서 콜백 함수로 경도 전달
    formData.append("pdesc", product.pdesc);
    formData.append("userEmail", loginState.email);
    formData.append("soldOut", product.soldOut.toString());

    console.log(formData);

    setLoading(true);

    postOne(formData).then((data) => {
      setLoading(false);
      setResult(data.result);
      setProduct({ ...initState });
    });
  };

  const categories = ["신발", "옷", "시계", "기타"];

  const closeAlertModal = () => {
    setResult(null);
    moveToPath("/");
  };

  return (
    <div className="add_group min-h-[1100px]">
      {loading ? <LoadingModal /> : <></>}
      {result ? (
        <AlertModal
          title={"상품이 등록되었습니다."}
          content={`${result}번 상품 등록 완료`}
          callbackFn={closeAlertModal}
        />
      ) : (
        <></>
      )}
      <div className="add_container">
        {/* 상품 이미지 영역 */}
        <div className="wrap_imagnbtn">
          <div className="add_imgArea">
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                className="addImage"
                alt={product.pname}
              />
            ) : (
              <label htmlFor="uploadImage"></label>
            )}
            <input
              ref={uploadRef}
              id="uploadImage"
              type="file"
              multiple={true}
              onChange={handleImagePreview}
            />
            {imagePreviewUrl && (
              <button onClick={cancelImageUpload}>취소</button>
            )}
          </div>
          {/* 버튼 영역 */}
          <div className="shopList_btn">
            <button
              type="button"
              className="shopList_addBtn"
              onClick={handleClickAdd}
            >
              상품 등록
            </button>
          </div>
        </div>
        {/* 상품 상세 영역 */}
        <div className="add_textArea">
          <div className="add_area">
            <div className="add_wrap">
              <p>제목</p>
              <input
                className=""
                name="pname"
                type={"text"}
                value={product.pname}
                onChange={handleChangeProduct}
              ></input>
            </div>
          </div>
          <div className="add_area">
            <div className="add_wrap">
              <p>카테고리</p>
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
          </div>
          <div className="add_area">
            <div className="add_wrap">
              <p>판매 상태</p>
              <select
                name="soldOut"
                value={product.soldOut}
                onChange={handleChangeProduct}
              >
                <option value={false}>판매중</option>
                <option value={true}>판매완료</option>
              </select>
            </div>
          </div>
          <div className="add_area">
            <div className="add_wrap">
              <p>상품 가격</p>
              <input
                className=""
                name="price"
                type={"text"}
                value={product.price}
                onChange={handleChangeProduct}
              ></input>
            </div>
          </div>
          <div className="add_area">
            <div className="add_wrap">
              <p>조건 선택 </p>
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
              <br />
            </div>
          </div>
          <div className="add_area">
            <div className="add_wrap">
              <p>상세설명</p>
              <textarea
                className=""
                name="pdesc"
                type={"text"}
                onChange={handleChangeProduct}
                value={product.pdesc}
              ></textarea>
            </div>
          </div>
          <div className="add_area">
            <div className="add_wrap flex flex-col max-h-[150px]">
              <div className="flex">
                <p>거래장소</p>
                <input
                  name="plocat"
                  type="text"
                  value={product.plocat}
                  onChange={handleChangeProduct}
                />
              </div>
              <MapComponent onLocationSelect={handleLocationSelect} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default P_AddComponent;
