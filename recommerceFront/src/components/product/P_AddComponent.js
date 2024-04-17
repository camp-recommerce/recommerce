import { useRef, useState } from "react";
import { postOne } from "../../api/productApi";
import useCustomMovePage from "../../hooks/useCustomMovePage";
import AlertModal from "../modal/AlertModal";
import LoadingModal from "../modal/LoadingModal";
import "../../scss/product/AddPage.scss";

const initState = {
  pname: "",
  price: "",
  pstate: "",
  plocat: "",
  pdesc: "",
  files: [],
};

const P_AddComponent = () => {
  const [product, setProduct] = useState({ ...initState });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

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

  const handleClickAdd = (e) => {
    const files = uploadRef.current.files;

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    //other data
    formData.append("pname", product.pname);
    formData.append("price", product.price.replace(/[^\d]/g, ""));
    formData.append("pstate", product.pstate);
    formData.append("plocat", product.plocat);
    formData.append("pdesc", product.pdesc);

    console.log(formData);

    setLoading(true);

    postOne(formData).then((data) => {
      setLoading(false);
      setResult(data.result);
      setProduct({ ...initState });
    });
  };

  const closeAlertModal = () => {
    setResult(null);
  };

  return (
    <div className="add_group ">
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
              <label>거래장소</label>
              <input
                className=""
                name="plocat"
                type={"text"}
                value={product.plocat}
                onChange={handleChangeProduct}
              ></input>
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
        </div>
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
  );
};

export default P_AddComponent;
