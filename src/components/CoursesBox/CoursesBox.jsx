import React, { useState } from "react";
import styles from "./CoursesBox.module.css";
import dummy1 from "../../assets/HomePage/dummy1.jpg";

const CoursesBox = () => {
  return (
    <>
      <div className={styles.boxContainer}>
        <h2>고궁 스토리텔링</h2>
        <img 
          src={dummy1}
          className={styles.courseImg}
          alt="코스 대표이미지"
        />
      </div>
    </>
  );
};

export default CoursesBox;