import React, { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";

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
        {/* 사이드바 내부 콘텐츠 */}
        <p>Sidebar Content</p>
      </div>
    </>
  );
};

export default Sidebar;
