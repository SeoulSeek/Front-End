import React, { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import { FaRegUserCircle } from "react-icons/fa";

const Sidebar = ({ onClose }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleOverlayClick = () => {
    setAnimate(false);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <>
      <div className={styles.overlay} onClick={handleOverlayClick}></div>
      <div className={`${styles.sidebarContainer} ${animate ? styles.open : styles.closed}`}>
        <div className={styles.user}>
          <FaRegUserCircle className={styles.userIcon}/>
          <h1 className={styles.h1}>
            <span className={styles.bold}>서우리</span> 님
          </h1>
        </div>
        <div className={styles.menu}>
          <p className={styles.menuItem}>SS MAP</p>
          <p className={styles.menuItem}>SS 관광코스 추천</p>
          <p className={styles.menuItem}>SS 관광코스 추천</p>
          <p className={styles.menuItem}>마이페이지</p>
          <a
            href="https://www.visitseoul.net/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkItem}
          >
            VISIT SEOUL NET
          </a>
          <a
            href="https://www.sto.or.kr/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkItem}
          >
            서울관광재단
          </a>
          <a
            href="https://m.map.kakao.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkItem}
          >
            카카오맵 kakaomap
          </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
