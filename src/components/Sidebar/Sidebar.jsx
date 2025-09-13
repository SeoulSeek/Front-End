import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { FaRegUserCircle } from "react-icons/fa";

const Sidebar = ({ onClose }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  // 공통으로 사이드바를 닫는 함수입니다.
  const closeSidebar = () => {
    setAnimate(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleOverlayClick = () => {
    closeSidebar();
  };

  const handleMenuItemClick = () => {
    closeSidebar();
  };

  return (
    <>
      <div className={styles.overlay} onClick={handleOverlayClick}></div>
      <div
        className={`${styles.sidebarContainer} ${
          animate ? styles.open : styles.closed
        }`}
      >
        <div className={styles.user}>
          <FaRegUserCircle className={styles.userIcon} />
          <h1 className={styles.h1}>
            <span className={styles.bold}>서우리</span> 님
          </h1>
        </div>
        <div className={styles.menu}>
          <Link
            to="/map"
            className={styles.menuItem}
            onClick={handleMenuItemClick}
          >
            SS MAP
          </Link>
          <Link
            to="/courses"
            className={styles.menuItem}
            onClick={handleMenuItemClick}
          >
            SS 관광코스 추천
          </Link>
          <Link
            to="/places"
            className={styles.menuItem}
            onClick={handleMenuItemClick}
          >
            SS 관광명소 추천
          </Link>
          <Link
            to="/mypage"
            className={styles.menuItem}
            onClick={handleMenuItemClick}
          >
            마이페이지
          </Link>
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
