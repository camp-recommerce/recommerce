import { useNavigate, useSearchParams } from "react-router-dom";

const getNum = (param, defaultValue) => {
  if (!param) {
    return defaultValue;
  }
  return parseInt(param);
};

const useCustomProductPage = () => {
  const [queryParams] = useSearchParams();
  const navigate = useNavigate();

  const page = getNum(queryParams.get("page"), 1);
  const size = getNum(queryParams.get("size"), 8);

  const moveToPath = (path) => {
    //----------------페이지 이동
    navigate({ pathname: path }, { replace: true });
  };

  const moveModifyPage = (num) => {
    navigate({
      pathname: `../product/modify/${num}`,
    });
  };

  const moveBeforeReadPage = (num) => {
    navigate({
      pathname: `../product/read/${num}`,
    });
  };

  const moveReadPage = (num) => {
    navigate({
      pathname: `../product/read/${num}`,
    });
    window.scrollTo(0, 0);
  };

  return {
    moveToPath,
    moveModifyPage,
    moveBeforeReadPage,
    moveReadPage,
    page,
    size,
  };
};

export default useCustomProductPage;
