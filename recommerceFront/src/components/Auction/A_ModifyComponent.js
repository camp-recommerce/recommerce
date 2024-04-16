import React, { useEffect, useRef, useState } from "react";
import useCustomMovePage from "../../hooks/useCustomMovePage";
import { deleteOne, getOne, putOne } from "../../api/auctionApi";
import { API_SERVER_HOST } from "../../api/userApi";
import { useParams } from "react-router-dom";
import { formatNumber } from "../../util/formatNumberUtil";

const initState = {
  apCategory: "",
  apName: "",
  apDesc: "",
  apStartPrice: "",
  apBidIncrement: "",
  apStatus: "",
  apStartTime: "",
  uploadFileNames: [],
};

const host = API_SERVER_HOST;

const A_ModifyComponent = () => {
  const { apno } = useParams();
  const [auction, setAuction] = useState({ ...initState });
  const [result, setResult] = useState(null);
  const { moveReadPage, moveProductListPage } = useCustomMovePage();
  const [loading, setLoading] = useState(false);
  const uploadRef = useRef();
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [formattedPrice, setFormattedPrice] = useState("");
  const [formattedIncrement, setFormattedIncrement] = useState("");

  useEffect(() => {
    getOne(apno).then((data) => {
      setAuction(data);
      setFormattedPrice(
        data.apStartPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
      setFormattedIncrement(
        data.apBidIncrement.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
    });
  }, [apno]);

  const handleChangeAuction = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^\d]/g, "");

    if (name === "apStartPrice") {
      setAuction({ ...auction, [name]: numericValue });
      setFormattedPrice(numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    } else if (name === "apBidIncrement") {
      setAuction({ ...auction, [name]: numericValue });
      setFormattedIncrement(numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    } else {
      setAuction({ ...auction, [name]: value });
    }
  };

  // // 이미지 등록 시 미리보기 생성
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

  const removeImages = (imageName) => {
    const resultFileNames = auction.uploadFileNames.filter(
      (fileName) => fileName !== imageName
    );
    auction.uploadFileNames = resultFileNames;

    setAuction({ ...auction });
  };

  const handleClickModify = () => {
    const files = uploadRef.current.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    formData.append("apCategory", auction.apCategory);
    formData.append("apName", auction.apName);
    formData.append("apDesc", auction.apDesc);
    formData.append("apStartPrice", auction.apStartPrice);
    formData.append("apBidIncrement", auction.apBidIncrement);
    formData.append("apStatus", auction.apStatus);
    formData.append("apStartTime", auction.apStartTime);

    for (let i = 0; i < auction.uploadFileNames.length; i++) {
      formData.append("uploadFileNames", auction.uploadFileNames[i]);
    }

    setLoading(true);

    putOne(apno, formData)
      .then((data) => {
        setLoading(false);
        setResult(data.result);
        alert("수정되었습니다.");
        moveReadPage(apno);
      })
      .catch((error) => {
        setLoading(false);
        alert("수정에 실패했습니다.");
      });
  };

  const handleClickDelete = () => {
    setLoading(true);
    deleteOne(auction)
      .then((data) => {
        setLoading(false);
        setResult(data.result);
        alert("삭제되었습니다.");
        moveProductListPage({ page: 1 });
        setAuction({ ...initState });
      })
      .catch((error) => {
        setLoading(false);
        alert("삭제에 실패했습니다.");
      });
  };

  const AuctionStatus = {
    PENDING: "경매 대기 중",
    ACTIVE: "경매 진행 중",
    CLOSED: "경매 종료",
    CANCELLED: "경매 취소",
  };

  const AuctionCategories = {
    SHOES: "신발",
    CLOTHES: "옷",
    WATCH: "시계",
    ETC: "기타",
  };

  return (
    <div className="flex justify-center mt-20">
      <div>물품 수정</div>
      <div className="grid grid-cols-2 gap-10">
        <div className="flex justify-center items-center">
          <div className="modify_wrap">
            <div className="modify-info">현재 이미지</div>
            <div className="modify-content">
              {auction.uploadFileNames.map((imgFile, i) => (
                <div className="modify-box current" key={i}>
                  <div className="imageContainer">
                    <img
                      alt={auction.apName}
                      src={`${host}/auction/view/s_${imgFile}`}
                    />
                    <button
                      className="imgRemoveBtn"
                      onClick={() => removeImages(imgFile)}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="max-w-md">
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
              alt={auction.apName}
            />
          </div>
        </div>
        <div>
          <div className="text-lg mb-4">물품 번호: {auction.apno}</div>
          <div className="max-w-md">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-lg">카테고리</div>
              <div className="text-lg">
                <select
                  name="apCategory"
                  value={auction.apCategory}
                  onChange={handleChangeAuction}
                >
                  {Object.entries(AuctionCategories).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-lg">물품명</div>
              <div className="text-lg">
                <textarea
                  className=""
                  name="apName"
                  type={"text"}
                  onChange={handleChangeAuction}
                  value={auction.apName}
                ></textarea>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-lg">물품 상세</div>
              <textarea
                className=""
                name="apDesc"
                type={"text"}
                onChange={handleChangeAuction}
                value={auction.apDesc}
              ></textarea>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-lg">시작가</div>
              <div className="text-lg">
                <input
                  className="text-right"
                  name="apStartPrice"
                  type={"text"}
                  value={formattedPrice}
                  onChange={handleChangeAuction}
                ></input>
                원
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-lg">입찰단위</div>
              <div className="text-lg">
                <input
                  className="text-right"
                  name="apBidIncrement"
                  type={"text"}
                  value={formattedIncrement}
                  onChange={handleChangeAuction}
                ></input>
                원
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-lg">물품상태</div>
              <div className="text-lg">
                <select
                  name="apStatus"
                  value={auction.apStatus}
                  onChange={handleChangeAuction}
                >
                  {Object.entries(AuctionStatus).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="font-bold text-lg">시작시간</div>
              <div className="text-lg">
                <input
                  className=""
                  name="apStartTime"
                  type={"datetime-local"}
                  value={auction.apStartTime}
                  onChange={handleChangeAuction}
                ></input>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-800"
                onClick={moveProductListPage}
              >
                목록
              </button>
            </div>
            <div className="flex space-x-4">
              <button
                className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900"
                onClick={handleClickModify}
              >
                수정
              </button>
            </div>
            <div className="flex space-x-4">
              <button
                className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900"
                onClick={handleClickDelete}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default A_ModifyComponent;
