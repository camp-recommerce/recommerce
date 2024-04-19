import { useNavigate } from "react-router-dom";

const useCustomProductPage = () => {
  const navigate = useNavigate();

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

  return {
    moveToPath,
    moveModifyPage,
    moveBeforeReadPage,
  };
};

export default useCustomProductPage;
