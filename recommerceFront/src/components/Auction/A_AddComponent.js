import React, { useRef, useState } from "react";
import { postOne } from "../../api/auctionApi";
import useCustomMovePage from "../../hooks/useCustomMovePage";

const initState = {
  apName: "",
  apDesc: "",
  apStartPrice: "",
  apBidIncrement: "",
  apStatus: "PENDING",
  apStartTime: "",
  files: [],
};

const A_AddComponent = () => {
  const [auction, setAuction] = useState({ ...initState });
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const uploadRef = useRef();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { moveProductListPage } = useCustomMovePage();

  const handleChangeAuction = (e) => {
    const { name, value } = e.target;
    console.log("Field Changed:", name, "Value:", value); // 변경된 필드와 값 로깅

    if (name === "apStartPrice" || name === "apBidIncrement") {
      const numericValue = value.replace(/[^\d]/g, "");
      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setAuction({
        ...auction,
        [name]: formattedValue,
      });
    } else {
      setAuction({
        ...auction,
        [name]: value,
      });
    }
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

    formData.append("apName", auction.apName);
    formData.append("apDesc", auction.apDesc);
    formData.append("apStartPrice", auction.apStartPrice.replace(/[^\d]/g, ""));
    formData.append(
      "apBidIncrement",
      auction.apBidIncrement.replace(/[^\d]/g, "")
    );
    formData.append("apStatus", auction.apStatus);
    formData.append("apStartTime", auction.apStartTime);

    console.log(formData);

    setLoading(true);

    postOne(formData).then((data) => {
      setLoading(false);
      setResult(data.result);
      setAuction({ ...initState });
    });
  };

  const closeAlertModal = () => {
    setResult(null);
    moveProductListPage({ page: 1 });
  };

  const AuctionStatus = {
    PENDING: "경매 대기 중",
    ACTIVE: "경매 진행 중",
    CLOSED: "경매 종료",
    CANCELLED: "경매 취소",
  };

  return (
    <div className="flex justify-center mt-20">
      <div>물품 등록</div>
      {/* {loading ? <LoadingModal /> : <></>}
      {result ? (
        <AlertModal
          title={"물품이 등록되었습니다."}
          content={`${result}번 물품 등록 완료`}
          callbackFn={closeAlertModal}
        />
      ) : (
        <></>
      )} */}
      <div className="grid grid-cols-2 gap-10">
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
            />
          </div>
        </div>
        <div>
          <div className="max-w-md">
            <div className="text-lg mb-4">{auction.apCategory}</div>
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
            <div className="text-gray-700 mb-4">물품 번호: {auction.apno}</div>
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-lg">시작가</div>
              <div className="text-lg">
                <input
                  className="text-right"
                  name="apStartPrice"
                  type={"text"}
                  value={auction.apStartPrice}
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
                  value={auction.apBidIncrement}
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
  );
};

export default A_AddComponent;
