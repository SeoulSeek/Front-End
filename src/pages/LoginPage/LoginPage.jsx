import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import Input from "../../components/Input/Input";
import AuthLayout from "../../layouts/AuthLayout";
import styles from "./LoginPage.module.css";
import LogoKakao from "../../assets/LoginPage/LogoKakao.png";

const USER = {
  email: "abcd@naver.com",
  pw: "asdw1234@",
};

function Login() {
  const [userEmail, setUserEmail] = useState(""); // 이메일
  const [userPw, setUserPw] = useState(""); //비밀번호

  const handleLogin = () => {
    // 로그인 처리 로직 (현재 로컬로 진행 => 서버연결로 코드 수정)
    e.preventDefault();
    if (userEmail === USER.email && userPw === USER.pw) {
      console.log("로그인 성공");
    } else {
      alert(
        "올바른 이메일이 아니거나 이메일 또는 비밀번호를 잘못 입력했습니다."
      );
    }
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
          >
            <span className={styles.btn_text}>로그인</span>
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
        <div className={styles.kakao_wrap}>
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
}

export default Login;
