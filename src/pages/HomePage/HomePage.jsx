import React, { useState } from "react";
import styles from "./HomePage.module.css";
import CourseTag from "../../components/CourseTag/CourseTag";
import HashTag from "../../components/global/HashTag/HashTag";

import bannerMap from "../../assets/HomePage/bannerMap.png";
import foldingMap from "../../assets/HomePage/foldingMap.png";
import glass from "../../assets/HomePage/glass.png";
import dummy1 from "../../assets/HomePage/dummy1.jpg";
import dummy2 from "../../assets/HomePage/dummy2.jpg";
import Loading from "../../components/Loading/Loading";
import { Link } from "react-router";

const Home = () => {
  const [timePeriod, setTimePeriod] = useState("오후");
  const [isLoading, setIsLoading] = useState(true);

  const toggleTimePeriod = () => {
    setTimePeriod((prev) => (prev === "오후" ? "오전" : "오후"));
  };

  return (
    <>
      <div>
        <h1 className={styles.h1}>
          <span className={styles.bold}>서울</span>의 숨겨진 가치와 유산을{" "}
          <span className={styles.bold}>탐색하다</span>
        </h1>
        <img src={bannerMap} className={styles.bannerMap} alt="Banner Map" />
      </div>
      <p className={styles.p}>
        ‘서울식’이라는 표현은 단순히 서울만의 스타일이나
        <br />
        분위기를 의미하는 것을 넘어,
        <br />이 도시가 지닌 특별한 정체성과 개성을 나타냅니다.
      </p>
      <img src={foldingMap} className={styles.foldingMap} />
      <Link to="/map">
        <img src={glass} className={styles.glass} />
      </Link>
      <div className={styles.recommContainer}>
        <div className={styles.recommBox}>
          <h2 className={styles.h2}>금주의 추천 관광코스</h2>
          <div className={styles.recommInnerBox}>
            <div className={styles.tag1}>
              <CourseTag type="all" count={7} />
            </div>
            <div className={styles.tag2}>
              <CourseTag type="special" count={2} />
            </div>
            <div className={styles.tag3}>
              <CourseTag type="landmark" count={4} />
            </div>
            <div className={styles.tag4}>
              <CourseTag type="mission" count={1} />
            </div>
            <img
              alt="추천 관광코스 이미지"
              src={dummy1}
              className={styles.recommImg}
            />
          </div>
        </div>
        <div className={styles.recommBox}>
          <h2 className={styles.h2}>
            지금 이 시간,{" "}
            <span
              className={styles.special}
              onClick={toggleTimePeriod}
              style={{ cursor: "pointer" }}
            >
              {timePeriod}의 서울
            </span>{" "}
            명소
          </h2>
          <div className={styles.recommInnerBox}>
            <div className={styles.hashTagContainer}>
              <HashTag type="district" text="종로구" />
            </div>
            <img
              alt="서울 명소 이미지"
              src={dummy2}
              className={styles.recommImg}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
