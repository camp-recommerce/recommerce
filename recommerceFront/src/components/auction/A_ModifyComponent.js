import React, { useEffect, useRef, useState } from "react";
import useCustomMovePage from "../../hooks/useCustomMovePage";
import { deleteOne, getOne, putOne } from "../../api/auctionApi";
import { API_SERVER_HOST } from "../../api/userApi";
import { useParams } from "react-router-dom";
import LoadingModal from "../modal/LoadingModal";

const initState = {
  apCategory: "",
  apName: "",
  apDesc: "",
  apStartPrice: "",
  apBidIncrement: "",
  apStatus: "PENDING",
  apStartTime: "",
  apClosingTime: "",
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
  const [showFileSelect, setShowFileSelect] = useState(true); // 파일 선택 창 표시 여부

  useEffect(() => {
    getOne(apno).then((data) => {
      setAuction(data);
      setFormattedPrice(
        data.apStartPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
      setFormattedIncrement(
        data.apBidIncrement.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
      // 이미지 파일명이 존재할 경우 이미지 미리보기 설정
      if (data.uploadFileNames.length > 0) {
        setImagePreviewUrl(`${host}/auction/view/s_${data.uploadFileNames[0]}`);
        setShowFileSelect(false); // 이미지 파일이 있으면 파일 선택 창 숨김
      }
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

  const cancelImageUpload = () => {
    setAuction({ ...auction, uploadFileNames: [] }); // 파일 목록 초기화
    uploadRef.current.value = null; // 파일 업로드 input의 값 초기화
    setShowFileSelect(true); // 파일 선택 창 표시
    setImagePreviewUrl(""); // 이미지 미리보기 초기화
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

  const handleClickModify = () => {
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

  const categories = ["신발", "옷", "시계", "기타"];

  return (
    <>
      {loading ? <LoadingModal /> : <></>}
      <div className="flex justify-center mt-20" style={{ minHeight: "66vh" }}>
        <div className="grid grid-cols-2 gap-10">
          <div className="flex justify-center items-center">
            <div className="modify_wrap">
              <div className="modify-content"></div>
            </div>
            <div
              className="max-w-md flex items-center justify-center relative"
              style={{ border: "1px solid #CCCCCC", width: 550, height: 550 }}
            >
              {imagePreviewUrl ? (
                <img
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                  src={imagePreviewUrl}
                  alt={auction.apName}
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
                style={{ display: showFileSelect ? "block" : "none" }} // Adjusted condition
              />
              {imagePreviewUrl && (
                <button
                  className="absolute top-0 right-0 m-2 p-1 bg-red-500 text-white rounded"
                  onClick={cancelImageUpload}
                >
                  취소
                </button>
              )}
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
                    style={{
                      border: "1px solid #CCCCCC",
                      width: 250,
                      height: 30,
                      marginTop: 5,
                      lineHeight: "30px", // textarea의 높이와 일치하도록 설정
                      overflow: "hidden", // 스크롤 바 숨기기
                    }}
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
                  style={{
                    border: "1px solid #CCCCCC",
                    width: 250,
                    height: 30,
                    marginTop: 5,
                    lineHeight: "30px", // textarea의 높이와 일치하도록 설정
                    overflow: "hidden", // 스크롤 바 숨기기
                  }}
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
                    style={{ border: "1px solid #CCCCCC" }}
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
                    style={{ border: "1px solid #CCCCCC" }}
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
                  className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-800"
                  onClick={moveProductListPage}
                >
                  목록
                </button>
                <button
                  className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900"
                  onClick={handleClickModify}
                >
                  수정
                </button>
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
    </>
  );
};

export default A_ModifyComponent;
