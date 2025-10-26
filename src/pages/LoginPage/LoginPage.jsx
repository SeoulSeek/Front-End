import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import Input from "../../components/Input/Input";
import AuthLayout from "../../layouts/AuthLayout";
import styles from "./LoginPage.module.css";
import LogoKakao from "../../assets/LoginPage/LogoKakao.png";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userEmail, setUserEmail] = useState(""); // 이메일
  const [userPw, setUserPw] = useState(""); //비밀번호
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!userEmail || !userPw) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login({
        email: userEmail,
        password: userPw,
        rememberMe: true,
      });

      if (result.success) {
        navigate("/");
      } else {
        alert(result.message || "로그인에 실패했습니다.");
      }
    } catch (err) {
      alert("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
    const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  return (
    <>
      <AuthLayout>
        <div className={styles.welcomeText}>
          <h3>환영합니다!</h3>
          <p>로그인하시면 홈페이지를 보다 편리하게 이용하실 수 있습니다.</p>
        </div>
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.login_box}>
            <Input
              type="email"
              placeholder="이메일 주소를 입력해 주세요"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              name="email"
            />
            <Input
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              value={userPw}
              onChange={(e) => setUserPw(e.target.value)}
              name="password"
            />
          </div>
          <button
            type="submit"
            className={styles.btn_login}
            onClick={handleLogin}
            disabled={isLoading}
          >
            <span className={styles.btn_text}>
              {isLoading ? "로그인 중..." : "로그인"}
            </span>
          </button>
          <div className={styles.regiLink}>
            <span className={styles.text}>서울식 회원이 아니신가요?</span>{" "}
            <Link to="/signin" className={`${styles.link}`}>
              회원가입
            </Link>
          </div>
          <div className={styles.dividing}>
            <span className={styles.text}>또는</span>
          </div>
        </form>
        <div className={styles.kakao_wrap} onClick={handleKakaoLogin}>
          <img
            src={LogoKakao}
            alt="카카오 로고"
            className={styles.kakao_logo}
          />
          <div className={styles.kakao_label}>
            <p>카카오로 시작하기</p>
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

export default Login;
