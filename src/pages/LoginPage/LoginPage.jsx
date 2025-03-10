import React, { useEffect, useState } from "react";
import styles from "./LoginPage.module.css";

const USER = {
  email: "abcd@naver.com",
  pw: "asdw1234@",
};

function Login() {
  const [email, setEmail] = useState(""); // 이메일
  const [pw, setPw] = useState(""); //비밀번호

  const [emailVaild, setEmailVaild] = useState(false); //이메일 유효성 확인
  const [pwVaild, setpwVaild] = useState(false); //비밀번호 유효성 확인
  const [notAllow, setNotAllow] = useState(true); //로그인버튼 (비)활성화

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <div>
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
            <div>
              <input placeholder="이메일 주소를 입력해 주세요" />
            </div>
            <div>
              <input placeholder="비밀번호를 입력해 주세요" />
            </div>

            <button></button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
