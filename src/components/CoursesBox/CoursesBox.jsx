import React, { useState } from "react";
import styles from "./CoursesBox.module.css";
import dummy1 from "../../assets/HomePage/dummy1.jpg";
import CoursesMobileTag from "../CoursesMobileTag/CoursesMobileTag";

const CoursesBox = () => {
  return (
    <>
      <div className={styles.boxContainer}>
        <h2 className={styles.h2}>고궁 스토리텔링</h2>
        <img 
          src={dummy1}
          className={styles.courseImg}
          alt="코스 대표이미지"
        />
        <div className={styles.tagContainer}>
          <div className={styles.tagInner}>
            <CoursesMobileTag type="all" count={7}/>
            <CoursesMobileTag type="landmark" count={4}/>
          </div>
          <div className={styles.tagInner}>
            <CoursesMobileTag type="special" count={2}/>
            <CoursesMobileTag type="mission" count={1}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursesBox;