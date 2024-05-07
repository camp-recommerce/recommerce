import { useSearchParams, useNavigate } from "react-router-dom";

export function FailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");

  const handleRetry = () => {
    navigate("/myPage/auction");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="flex flex-col items-center w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <img
          src="https://static.toss.im/lotties/error-spot-apng.png"
          width="120"
          height="120"
          alt="error"
          className="mb-4"
        />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          결제를 실패했어요
        </h2>
        <div className="w-full mb-6">
          <div className="flex justify-center items-center mb-2">
            <span className="text-gray-600 font-semibold">실패요청</span>
            <span id="error-code" className="text-gray-800 font-semibold ml-2">
              {errorCode}
            </span>
          </div>
          <div className="flex justify-center items-center">
            <span className="text-gray-600 font-semibold">다시 시도하세요</span>
            <span
              id="error-message"
              className="text-gray-800 font-semibold ml-2"
            >
              {errorMessage}
            </span>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
            onClick={handleRetry}
          >
            다시 테스트하기
          </button>
          <div className="flex gap-2">
            <a
              className="bg-green-500 hover:bg-green-600 text-white w-full text-center py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
              href="https://docs.tosspayments.com/reference/error-codes"
              target="_blank"
              rel="noreferrer noopener"
            >
              에러코드 문서보기
            </a>
            <a
              className="bg-purple-500 hover:bg-purple-600 text-white w-full text-center py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
              href="https://techchat.tosspayments.com"
              target="_blank"
              rel="noreferrer noopener"
            >
              실시간 문의하기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
