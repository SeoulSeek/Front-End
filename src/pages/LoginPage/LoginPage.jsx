import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import styles from "./LoginPage.module.css";

const USER = {
  email: "abcd@naver.com",
  pw: "asdw1234@",
};

function Login() {
  const [userEmail, setUserEmail] = useState(""); // 이메일
  const [userPw, setUserPw] = useState(""); //비밀번호

  const [isShowPw, setIsShowPW] = useState(false);

  const handleLogin = () => {
    // 로그인 처리 로직 (현재 로컬로 진행 => 서버연결로 코드 수정)
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
      <div className="login-container">
        <header>서울식</header>
        <div>
          <h3>환영합니다</h3>
          <p>로그인하시면 홈페이지를 보다 편리하게 이용하실 수 있습니다.</p>
        </div>
        <div>
          <h1>로그인</h1>
        </div>
        <div>
          <form>
            <div className="inputEmailWrap">
              <input
                type="email"
                id="email"
                className="inputEmail"
                placeholder="이메일 주소를 입력해 주세요"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            <div className="inputPwWrap">
              <input
                type="password"
                id="pw"
                className="inputPw"
                placeholder="비밀번호를 입력해 주세요"
                value={userPw}
                onChange={(e) => setUserPw(e.target.value)}
              />
            </div>
            <div>
              <button type="submit" onClick={handleLogin}>
                로그인
              </button>
            </div>
            <div>또는</div>
            <div>
              <button type="button">카카오로 시작하기</button>
            </div>
          </form>
          <div>
            서울식 회원이 아니신가요? <Link to="/signin">회원가입</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
