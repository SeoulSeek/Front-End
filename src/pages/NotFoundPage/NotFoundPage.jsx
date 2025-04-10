import React from "react";
import { Link, useNavigate } from "react-router-dom";
import $ from "./NotFoundPage.module.css";
import cloud1 from "../../assets/NotFoundPage/cloud1.png";
import cloud2 from "../../assets/NotFoundPage/cloud2.png";

const NotFound = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  return (
    <>
      <div className={$.container}>
        <div className={$.textContainer}>
          <h1>404</h1>
          <h2>
            죄송합니다. <br />
            요청하신 페이지를 찾을 수 없습니다.
          </h2>
          <p>입력하신 주소를 다시 한 번 확인해 주세요.</p>
        </div>

        <div className={$.buttonContainer}>
          <button onClick={goBack}>이전 페이지로 돌아가기</button>
          <Link to="/">
            <button>메인으로 이동하기</button>
          </Link>
        </div>
      </div>
      <div className={$.cloud1}></div>
      <div className={$.cloud2}></div>
    </>
  );
};

export default NotFound;
