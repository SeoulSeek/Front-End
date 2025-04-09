import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CoursesBox.module.css";
import dummy1 from "../../assets/HomePage/dummy1.jpg";
import CoursesMobileTag from "../CoursesMobileTag/CoursesMobileTag";
import starIcon from "../../assets/CoursesPage/AiStar.png";
import starIconFill from "../../assets/CoursesPage/AiFillStar.png";

const CoursesBox = ({ id, title = "고궁 스토리텔링", image = dummy1 }) => {
  const [isStarFilled, setIsStarFilled] = useState(false);
  const navigate = useNavigate();

  const toggleStarIcon = () => {
    setIsStarFilled((prev) => !prev);
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
          <CoursesMobileTag type="all" count={7} />
          <CoursesMobileTag type="landmark" count={4} />
        </div>
        <div className={styles.tagInner}>
          <CoursesMobileTag type="special" count={2} />
          <CoursesMobileTag type="mission" count={1} />
        </div>
      </div>
    </div>
  );
};

export default CoursesBox;
