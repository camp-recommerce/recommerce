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
    }
    setProduct({
      ...product,
      [name]: value,
    });
  };

  // // 이미지 등록 시 미리보기 생성
  const handleImagePreview = (e) => {
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
              <></>
            )}
            <input
              ref={uploadRef}
              id="uploadImage"
              type="file"
              multiple={true}
              onChange={handleImagePreview}
            />
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
              <label>제목</label>
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
              <label>카테고리</label>
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
              <label>상품 가격</label>
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
              <br />
            </div>
          </div>
          <div className="add_area">
            <div className="add_wrap">
              <label>상세설명</label>
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
                <label>거래장소</label>
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
