import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import Logo from "../../assets/LogoMobileV2.png";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.menu}>
        <p className={styles.linkItem}>서비스 이용약관</p>
        <p className={styles.linkItem}>개인정보 처리방침</p>
        <p className={styles.linkItem}>한국관광공사 tourAPI</p>
        <p className={styles.linkItem}>카카오 kakao Open API</p>
      </div>
      <img src={Logo} alt="서울식 로고" className={styles.logo} />
      <p className={styles.copyright}>ⓒ 2025. 서울식 Seoul Seek All rights reserved.</p>
    </div>
  );
};

export default Footer;
