import React, { useState } from "react";
import styles from "./CoursesPage.module.css";
import CoursesBox from "../../components/CoursesBox/CoursesBox";
import SortMenu from "../../components/global/SortMenu/SortMenu";

const CoursesPage = () => {
  return (
    <>
      <h1 className={styles.h1}>서울식 관광코스</h1>
      <SortMenu className={styles.sort}/>
      <div className={styles.boxes}>
        <CoursesBox />
        <CoursesBox />
        <CoursesBox />
        <CoursesBox />
      </div>
      <p className={styles.bottomText}>목록이 끝났어요.</p>
    </>
  );
};

export default CoursesPage;
