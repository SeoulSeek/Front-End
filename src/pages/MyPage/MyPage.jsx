import React, { useState } from "react";
import styles from "./MyPage.module.css";
import defaultProfile from "../../assets/MyPage/defaultProfile.png";

const MyPage = () => {

  const [activeTab, setActiveTab] = useState("places");

  return (
    <div className={styles.myContainer}>
      <div className={styles.myInfoContainer}>
        <img
          src={defaultProfile}
          className={styles.profilePic}
          alt="프로필 이미지"
        />
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

      <div className={styles.myMenuContainer}>
        <div className={styles.tabMenu}>
          <span
            className={styles.tab}
            onClick={() => setActiveTab("places")}
            style={{
              color: activeTab === "places" ? "#000000" : "#D3D9DF",
              cursor: "pointer",
            }}
          >
            나의 장소
          </span>
          <span
            className={styles.tab}
            onClick={() => setActiveTab("guestbook")}
            style={{
              color: activeTab === "guestbook" ? "#000000" : "#D3D9DF",
              cursor: "pointer",
            }}
          >
            나의 방명록
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
