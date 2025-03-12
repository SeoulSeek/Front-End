import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css"
import logo from "../../assets/logoMobile.png"
import { AiOutlineMenu } from "react-icons/ai";

const Header = () => {
  return(
    <>
      <div className={styles.header}>
        <Link to="/">
          <img
            src={logo}
            alt="서울식 로고"
            className={styles.logo}
          />
        </Link>
        <AiOutlineMenu className={styles.menu}/>
      </div>
    </>
  )
}

export default Header;