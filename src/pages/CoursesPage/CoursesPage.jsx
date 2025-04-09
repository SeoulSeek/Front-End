import React from "react";
import styles from "./CoursesPage.module.css";
import CoursesBox from "../../components/CoursesBox/CoursesBox";
import SortMenu from "../../components/global/SortMenu/SortMenu";

const CoursesPage = () => {
  return (
    <>
      <h1 className={styles.h1}>서울식 관광코스</h1>
      <div className={styles.sortWrapper}>
        <SortMenu />
      </div>
      <div className={styles.boxes}>
        <CoursesBox id={1} />
        <CoursesBox id={2} />
        <CoursesBox id={3} />
        <CoursesBox id={4} />
      </div>
      <p className={styles.bottomText}>목록이 끝났어요.</p>
    </>
  );
};

export default CoursesPage;
