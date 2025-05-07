import React from "react";
import styles from "./MyPage.module.css";
import defaultProfile from "../../assets/MyPage/defaultProfile.png"

const MyPage = () => {
  return (
    <>
      <div className={styles.myContainer}>
        <div className={styles.myInfoContainer}>
          <img src={defaultProfile} className={styles.profilePic} alt="프로필 이미지" />
          <div className={styles.myInfo}>
            <span className={styles.myName}>
              <span className={styles.blue}>서우리</span>님의 역사 탐험록
            </span>
            <div className={styles.myLang}>
              <span className={styles.lang}>한국어</span>
              <span className={styles.lang}>English</span>
              <span className={styles.lang}>中國語</span>
            </div>
            <div className={styles.myStats}>
              <span className={styles.stats}>작성한 방명록 수 100</span>
              <span className={styles.stats}>누적 좋아요 수 50</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyPage;
