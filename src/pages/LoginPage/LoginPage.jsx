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
          <h3></h3>
          <p></p>
        </div>
      </div>
    </>
  );
}

export default Login;
