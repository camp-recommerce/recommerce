import React, { useEffect, useRef, useState } from "react";
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

  const getInitialStartTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 2);
    tomorrow.setHours(6, 0, 0, 0); // 오후9시

    // ISO 8601 형식(yyyy-MM-ddTHH:mm:ss)으로 반환
    return tomorrow.toISOString().slice(0, 16);
  };

  const getInitialClosingTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 3);
    tomorrow.setHours(6, 0, 0, 0); // 오후 9시

    // ISO 8601 형식(yyyy-MM-ddTHH:mm:ss)으로 반환
    return tomorrow.toISOString().slice(0, 16);
  };

  const cancelImageUpload = () => {
    setAuction({ ...auction, files: [] }); // 파일 목록 초기화
    uploadRef.current.value = null; // 파일 업로드 input의 값 초기화
    uploadRef.current.style.display = "block"; // 파일 선택 창 다시 표시
    setImagePreviewUrl(""); // 이미지 미리보기 초기화
  };

  useEffect(() => {
    const initialStartTime = getInitialStartTime();
    const initialClosingTime = getInitialClosingTime();

    setAuction((prevAuction) => ({
      ...prevAuction,
      apStartTime: initialStartTime,
      apClosingTime: initialClosingTime,
    }));
  }, []);

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
      {loading ? <LoadingModal /> : null} {/* <></> 대신에 null로 수정 */}
      <div className="flex justify-center mt-20" style={{ minHeight: "66vh" }}>
        <div className="grid grid-cols-2 gap-10">
          <div
            className="max-w-md flex items-center justify-center relative"
            style={{
              border: "1px solid #CCCCCC",
              width: 550,
              height: 550,
              marginBottom: 10,
            }}
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

          <div>
            <div className="max-w-md" style={{ height: "500px" }}>
              {" "}
              {/* Height 대문자 -> 소문자로 수정 */}
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-lg">카테고리</div>
                <div className="text-lg">
                  <select
                    name="apCategory"
                    value={auction.apCategory}
                    onChange={handleChangeAuction}
                    style={{ border: "1px solid #CCCCCC" }}
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
                    height: 100,
                    marginTop: 5,
                    lineHeight: "30px", // textarea의 높이와 일치하도록 설정
                    // 스크롤 바 숨기기
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
                  className="bg-[#282222] text-[#E4E4E3] px-6 py-2 rounded-md hover:bg-[#515151]"
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
