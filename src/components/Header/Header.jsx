import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import Logo from "../../assets/LogoMobile.png";
import { AiOutlineMenu } from "react-icons/ai";

const Header = ({ onMenuClick, onLogoClick }) => {
  return (
    <div className={styles.header}>
      <Link to="/" onClick={onLogoClick}>
        <img src={Logo} alt="서울식 로고" className={styles.logo} />
      </Link>
      <AiOutlineMenu className={styles.menu} onClick={onMenuClick} />
    </div>
  );
};

export default Header;
