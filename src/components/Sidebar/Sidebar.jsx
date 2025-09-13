import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { FaRegUserCircle } from "react-icons/fa";

const Sidebar = ({ onClose }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setAnimate(true);
    }, 10); 

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  // 공통으로 사이드바를 닫는 함수입니다.
  const closeSidebar = useCallback(() => {
    setAnimate(false);
    document.body.style.overflow = 'unset';
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const handleOverlayClick = () => {
    closeSidebar();
  };

  const handleMenuItemClick = () => {
    closeSidebar();
  };

  // ESC 키로 사이드바 닫기
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeSidebar]);

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
        </div>
      </div>
    </>
  );
};

export default Sidebar;
