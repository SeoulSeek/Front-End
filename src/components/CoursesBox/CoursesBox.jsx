import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CoursesBox.module.css";
import dummy1 from "../../assets/HomePage/dummy1.jpg";
import CoursesMobileTag from "../CoursesMobileTag/CoursesMobileTag";
import starIcon from "../../assets/CoursesPage/AiStar.png";
import starIconFill from "../../assets/CoursesPage/AiFillStar.png";
import { useAuth } from "../../contexts/AuthContext";
import { API_ENDPOINTS } from "../../config/api";

const CoursesBox = ({ 
  id, 
  title = "고궁 스토리텔링", 
  image = dummy1,
  totalLocations = 0,
  landmarkTourElements = 0,
  specialTourElements = 0,
  missionTourElements = 0
}) => {
  const [isStarFilled, setIsStarFilled] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const toggleStarIcon = async () => {
    // 로그인 체크
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 현재 상태 저장 (실패 시 복구용)
    const previousState = isStarFilled;
    
    // 낙관적 업데이트 (UI 먼저 변경)
    setIsStarFilled((prev) => !prev);

    try {
      // refreshToken 가져오기
      const token = localStorage.getItem('refreshToken');
      
      if (!token) {
        alert("로그인이 필요합니다.");
        setIsStarFilled(previousState); // 원래 상태로 복구
        return;
      }

      const response = await fetch(API_ENDPOINTS.COURSE_SCRAP(id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // API 호출 실패 시 조용히 실패하고 원래 상태로 복구
        setIsStarFilled(previousState);
        return;
      }

      const result = await response.json();
      
      // API 응답의 scrapped 값으로 상태 동기화
      if (result.error === false && result.data) {
        setIsStarFilled(result.data.scrapped);
      } else {
        // 에러 응답 시 원래 상태로 복구
        setIsStarFilled(previousState);
      }
    } catch (error) {
      // 네트워크 오류 등 예외 발생 시 조용히 실패하고 원래 상태로 복구
      console.error('Course scrap error:', error);
      setIsStarFilled(previousState);
    }
  };

  const handleBoxClick = () => {
    navigate(`/courses/${id}`);
  };

  return (
    <div
      className={styles.boxContainer}
      onClick={handleBoxClick}
      style={{ cursor: "pointer" }}
    >
      <h2 className={styles.h2}>{title}</h2>
      <div className={styles.imageContainer}>
        <img 
          src={image}
          className={styles.courseImg}
          alt="코스 대표이미지"
        />
        <img 
          src={isStarFilled ? starIconFill : starIcon}
          className={styles.starIcon}
          alt="star icon"
          onClick={(e) => {
            e.stopPropagation(); // 클릭 이벤트가 부모로 전파되지 않도록 처리
            toggleStarIcon();
          }}
          style={{ cursor: "pointer" }}
        />
      </div>
      <div className={styles.tagContainer}>
        <div className={styles.tagInner}>
          <CoursesMobileTag type="all" count={totalLocations} />
          <CoursesMobileTag type="landmark" count={landmarkTourElements} />
        </div>
        <div className={styles.tagInner}>
          <CoursesMobileTag type="special" count={specialTourElements} />
          <CoursesMobileTag type="mission" count={missionTourElements} />
        </div>
      </div>
    </div>
  );
};

export default CoursesBox;
