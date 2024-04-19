import { useEffect, useRef, useState } from "react";
import { API_SERVER_HOST, getOne, putOne } from "../../api/productApi";

const initState = {
  pname: "",
  price: 0,
  pstate: "",
  plocat: "",
  pdesc: "",
  delFlag: false,
  uploadFileNames: [],
};

const host = API_SERVER_HOST;

const P_ModifyComponent = ({ pno }) => {
  const [product, setProduct] = useState({ ...initState });
  const [result, setResult] = useState(null);
  const [formattedPrice, setFormattedPrice] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const uploadRef = useRef();

  useEffect(() => {
    getOne(1).then((data) => {
      setProduct(data);
      // 데이터 로딩 시 숫자 가격을 콤마 포맷으로 변환하여 상태에 저장
      setFormattedPrice(
        data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
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

  const handleClickModify = () => {
    const files = uploadRef.current.files;
    const formData = new FormData();

    // other data
    formData.append("pname", product.pname);
    formData.append("price", product.price);
    formData.append("pstate", product.pstate);
    formData.append("plocat", product.plocat);
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

  return (
    <div className="modify_group">
      <div>상품 수정</div>
    </div>
  );
};

export default P_ModifyComponent;
