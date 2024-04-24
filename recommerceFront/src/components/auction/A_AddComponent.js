import React, { useRef, useState } from "react";
import { postOne } from "../../api/auctionApi";
import useCustomMovePage from "../../hooks/useCustomMovePage";
import {
  getInitialStartTime,
  getInitialClosingTime,
} from "../../util/formatTimeUtil";
import LoadingModal from "../modal/LoadingModal";

const initState = {
  apCategory: "기타",
  apName: "",
  apDesc: "",
  apStartPrice: "",
  apBidIncrement: "",
  apStatus: "PENDING",
  apStartTime: getInitialStartTime(),
  apClosingTime: getInitialClosingTime(),
  files: [],
};

const A_AddComponent = () => {
  const [auction, setAuction] = useState({ ...initState });
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const uploadRef = useRef();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { moveProductListPage } = useCustomMovePage();
  const [formattedPrice, setFormattedPrice] = useState("");
  const [formattedIncrement, setFormattedIncrement] = useState("");

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

    const startTime = new Date(auction.apStartTime);
    const closingTime = new Date(auction.apClosingTime);
    const now = new Date();

    if (startTime < now) {
      alert("경매 시작 시간은 현재 시간보다 이전으로 설정할 수 없습니다.");
      return;
    }
    if (closingTime <= startTime) {
      alert("입찰 마감 시간은 시작 시간보다 이전으로 설정할 수 없습니다.");
      return;
    }

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
    formData.append("apClosingTime", auction.apClosingTime);

    console.log(formData);

    setLoading(true);

    postOne(formData)
      .then((data) => {
        setLoading(false);
        setResult(data.result);
        alert("등록되었습니다.");
        moveProductListPage({ page: 1 });
        setAuction({ ...initState });
      })
      .catch((error) => {
        setLoading(false);
        alert("등록에 실패했습니다.");
      });
  };

  const categories = ["신발", "옷", "시계", "기타"];

  return (
    <>
      {loading ? <LoadingModal /> : <></>}
      <div className="flex justify-center mt-20" style={{ minHeight: "66vh" }}>
        <div>물품 등록</div>
        <div className="grid grid-cols-2 gap-10">
<<<<<<< Updated upstream
          <div className="flex justify-center items-center">
            <div className="max-w-md">
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  className="addImage"
                  alt={auction.apName}
                />
              ) : (
                <label htmlFor="uploadImage">파일 선택</label>
              )}
              <input
                ref={uploadRef}
                id="uploadImage"
                type="file"
                multiple={true}
                onChange={handleImagePreview}
=======
          <div
            className="max-w-md flex items-end justify-center"
            style={{
              border: "1px solid #CCCCCC",
              width: 550,
              height: 550,
              marginBottom: 10,
            }}
          >
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                className="addImage"
                alt={auction.apName}
>>>>>>> Stashed changes
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
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
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
              <div className="flex items-center justify-between">
                <div className="font-bold text-lg">종료시간</div>
                <div className="text-lg">
                  <input
                    className=""
                    name="apClosingTime"
                    type={"datetime-local"}
                    value={auction.apClosingTime}
                    onChange={handleChangeAuction}
                  ></input>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900"
                  onClick={handleClickAdd}
                >
                  물품 등록
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default A_AddComponent;
