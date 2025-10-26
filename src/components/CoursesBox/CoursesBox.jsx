import React, { useState, useEffect, useRef } from "react";
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
  scrapped = false,
  totalLocations = 0,
  landmarkTourElements = 0,
  specialTourElements = 0,
  missionTourElements = 0,
  onScrapChange
}) => {
  const [isStarFilled, setIsStarFilled] = useState(scrapped);
  const hasInitialized = useRef(false);
  const navigate = useNavigate();
  const { user, refreshAuthToken } = useAuth();

  // 첫 마운트 시에만 초기 상태 설정
  useEffect(() => {
    if (!hasInitialized.current) {
      setIsStarFilled(scrapped);
      hasInitialized.current = true;
    }
  }, [scrapped]);

  const toggleStarIcon = async (retryCount = 0) => {
    console.log('=== CoursesBox toggleStarIcon 시작 ===');
    console.log('현재 상태:', isStarFilled);
    console.log('코스 ID:', id);
    
    // 로그인 체크
    if (!user) {
      console.log('로그인 필요');
      alert("로그인이 필요합니다.");
      return;
    }

    // 현재 상태 저장 (실패 시 복구용)
    const previousState = isStarFilled;
    
    // 낙관적 업데이트 (UI 먼저 변경)
    setIsStarFilled((prev) => !prev);
    console.log('낙관적 업데이트 후:', !previousState);

    try {
      // refreshToken 가져오기
      const token = localStorage.getItem('refreshToken');
      console.log('토큰 존재:', !!token);
      
      if (!token) {
        alert("로그인이 필요합니다.");
        setIsStarFilled(previousState);
        return;
      }

      const url = API_ENDPOINTS.COURSE_SCRAP(id);
      console.log('스크랩 API URL:', url);

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      console.log('API 응답 상태:', response.status);

      if (response.status === 401 && retryCount === 0) {
        // 401 에러 발생 시 토큰 재발급 시도
        const newToken = await refreshAuthToken();
        
        if (newToken) {
          // 토큰 재발급 성공 시 다시 시도
          return toggleStarIcon(1);
        } else {
          // 토큰 재발급 실패
          alert("로그인이 필요합니다.");
          setIsStarFilled(previousState);
          return;
        }
      }

      if (!response.ok) {
        // API 호출 실패 시 조용히 실패하고 원래 상태로 복구
        setIsStarFilled(previousState);
        return;
      }

      const result = await response.json();
      console.log('API 응답 데이터:', result);
      
      // API 응답의 scrapped 값으로 상태 동기화
      if (result.error === false && result.data) {
        const newScrappedState = result.data.scrapped;
        console.log('새 스크랩 상태:', newScrappedState);
        setIsStarFilled(newScrappedState);
        // 부모 컴포넌트에 변경사항 알림
        if (onScrapChange) {
          console.log('부모 컴포넌트에 알림');
          onScrapChange();
        }
      } else {
        console.log('에러 응답, 원래 상태로 복구');
        // 에러 응답 시 원래 상태로 복구
        setIsStarFilled(previousState);
      }
    } catch (error) {
      // 네트워크 오류 등 예외 발생 시 조용히 실패하고 원래 상태로 복구
      console.error('Course scrap error:', error);
      setIsStarFilled(previousState);
    }
    console.log('=== CoursesBox toggleStarIcon 종료 ===');
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
