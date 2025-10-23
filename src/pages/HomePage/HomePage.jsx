import React, { useState, useEffect } from "react";
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
import { API_ENDPOINTS } from "../../config/api";

const DISTRICT_MAP = {
  TEMP: "temp",
  JONGNO: "종로구",
  JUNG: "중구",
  YONGSAN: "용산구",
  SEONGDONG: "성동구",
  GWANGJIN: "광진구",
  DONGDAEMUN: "동대문구",
  JUNGRANG: "중랑구",
  SEONGBUK: "성북구",
  GANGBUK: "강북구",
  DOBONG: "도봉구",
  NOWON: "노원구",
  EUNPYEONG: "은평구",
  SEODAEMUN: "서대문구",
  MAPO: "마포구",
  YANGCHEON: "양천구",
  GANGSEO: "강서구",
  GURO: "구로구",
  GEUMCHEON: "금천구",
  YEONGDEUNGPO: "영등포구",
  DONGJAK: "동작구",
  GWANAK: "관악구",
  SEOCHO: "서초구",
  GANGNAM: "강남구",
  SONGPA: "송파구",
  GANGDONG: "강동구",
};

const Home = () => {
  const [timePeriod, setTimePeriod] = useState("오후");
  const [isLoading, setIsLoading] = useState(true);
  const [dailyLocation, setDailyLocation] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [weeklyCourse, setWeeklyCourse] = useState(null);
  const [courseError, setCourseError] = useState(false);

  useEffect(() => {
    const fetchDailyLocation = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.DAILY_LOCATION, {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
        });

        if (!response.ok) {
          throw new Error(`API 호출 실패: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.error || !result.data) {
          throw new Error("데이터 오류");
        }

        setDailyLocation(result.data);
        setTimePeriod(result.data.ampm ? "오전" : "오후");
        setHasError(false);
      } catch (error) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchWeeklyCourse = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.WEEKLY_COURSE, {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
        });

        if (!response.ok) {
          throw new Error(`API 호출 실패: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.error || !result.data) {
          throw new Error("데이터 오류");
        }

        setWeeklyCourse(result.data);
        setCourseError(false);
      } catch (error) {
        setCourseError(true);
      }
    };

    fetchDailyLocation();
    fetchWeeklyCourse();
  }, []);

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
          {courseError ? (
            <div className={styles.recommInnerBox}>
              <div className={styles.courseErrorText}>페이지를 새로고침해주세요.</div>
            </div>
          ) : (
            <Link 
              to={weeklyCourse?.id ? `/courses/${weeklyCourse.id}` : '#'} 
              style={{ textDecoration: 'none', cursor: weeklyCourse?.id ? 'pointer' : 'default' }}
            >
              <div className={styles.recommInnerBox}>
                <div className={styles.tag1}>
                  <CourseTag type="all" count={weeklyCourse?.totalLocations || 7} />
                </div>
                <div className={styles.tag2}>
                  <CourseTag type="special" count={weeklyCourse?.specialTourElements || 2} />
                </div>
                <div className={styles.tag3}>
                  <CourseTag type="landmark" count={weeklyCourse?.landmarkTourElements || 4} />
                </div>
                <div className={styles.tag4}>
                  <CourseTag type="mission" count={weeklyCourse?.missionTourElements || 1} />
                </div>
                <img
                  alt="추천 관광코스 이미지"
                  src={weeklyCourse?.imageUrl || dummy1}
                  className={styles.recommImg}
                />
              </div>
            </Link>
          )}
        </div>
        <div className={styles.recommBox}>
          <h2 className={styles.h2}>
            지금 이 시간,{" "}
            <span className={styles.special}>
              {timePeriod}의 서울
            </span>{" "}
            명소
          </h2>
          <div className={styles.recommInnerBox}>
            <div className={styles.hashTagContainer}>
              {hasError ? (
                <div className={styles.errorText}>페이지를 새로고침해주세요.</div>
              ) : (
                <HashTag 
                  type="district" 
                  text={DISTRICT_MAP[dailyLocation?.territory] || dailyLocation?.territory || "종로구"}
                  color="#91C6FF"
                  width="80px"
                />
              )}
            </div>
            <img
              alt="서울 명소 이미지"
              src={dailyLocation?.imageUrl || dummy2}
              className={styles.recommImg}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
