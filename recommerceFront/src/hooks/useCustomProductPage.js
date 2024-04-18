import { useNavigate } from "react-router-dom";

const useCustomProductPage = () => {
  const navigate = useNavigate();

  const moveToPath = (path) => {
    //----------------페이지 이동
    navigate({ pathname: path }, { replace: true });
  };

  return {
    moveToPath,
  };
};

export default useCustomProductPage;
