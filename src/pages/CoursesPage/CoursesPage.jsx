import React, { useState } from "react";
import styles from "./CoursesPage.module.css";
import CoursesBox from "../../components/CoursesBox/CoursesBox";

const CoursesPage = () => {
  return (
    <>
      <h1 className={styles.h1}>서울식 관광코스</h1>
      <div className={styles.boxes}>
        <CoursesBox />
      </div>
    </>
  );
};

export default CoursesPage;
