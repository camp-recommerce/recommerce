import { useEffect, useState } from "react";
import { API_SERVER_HOST, getOne } from "../../api/productApi";
import LoadingModal from "../modal/LoadingModal";
import ImageModal from "../modal/ImageModal";

const host = API_SERVER_HOST;

const initState = {
  pname: "",
  price: "",
  pstate: "",
  plocat: "",
  pdesc: "",
  files: [],
  loading: false,
  result: null,
  imagePreviewUrl: "",
};

const P_ReadComponent = ({ pno }) => {
  const [product, setProduct] = useState(initState);
  const [loading, setLoading] = useState(false);
  const [selectedImgPath, setSelectedImgPath] = useState("");
  const [openImg, setOpenImg] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getOne(1);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        // 오류 처리 로직
      }
      setLoading(false);
    };

    if (pno) {
      fetchProduct();
    } else {
      console.error("Product number (pno) is undefined.");
    }
  }, [pno]);

  const handleOpenImg = (imgFile) => {
    setSelectedImgPath(`${host}/product/view/${imgFile}`);
    setOpenImg(true);
  };

  const closeImageModal = () => {
    setOpenImg(false);
  };

  return (
    <div className="shopRead_group">
      {loading ? <LoadingModal /> : <></>}

      {/* 상품 영역 */}
      <div className="shopRead_img">
        <img
          alt="product"
          src={`${host}/api/products/view/${product.uploadFileNames}`}
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
            <div className="shopRead_pname">{product.pname}</div>
          </div>
          <div className="shopRead_box">
            <div className="shopRead_price">{product.price}</div>
          </div>
          <div className="shopRead_box">
            <div className="shopRead_pstate">{product.pstate}</div>
          </div>
          <div className="shopRead_box">
            <div className="shopRead_plocat">{product.plocat}</div>
          </div>
          <div className="shopRead_box">
            <div className="shopRead_pdesc">{product.pdesc}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default P_ReadComponent;
