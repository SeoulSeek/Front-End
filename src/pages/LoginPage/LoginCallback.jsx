// LoginCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";

const LoginCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 카카오 로그인 후 백엔드에서 쿠키 저장했기 때문에 별도 처리 없이 홈으로 이동
    const timer = setTimeout(() => {
      navigate("/"); // 또는 마이페이지 등으로 이동
    }, 2000); // 3초 후 이동

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
  }, []);

  return (
    <>
      <Loading />
    </>
  );
};

export default LoginCallback;
