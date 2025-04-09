import React from "react";
import { Link } from "react-router";
import $ from "./AuthLayout.module.css";
import Logo from "./../assets/LogoMobile.png";

const AuthLayout = ({ title, welcomeTitle, welcomeMessage, children }) => {
  return (
    <>
      <div className={$.container}>
        <div className={$.login_container}>
          <header>
            <Link to="/">
              <img src={Logo} alt="서울식 로고" className={$.logo} />
            </Link>
          </header>
          {welcomeTitle && (
            <div className={$.welcomeText}>
              <h3 className={$.welcomeTitle}>{welcomeTitle}</h3>
              <p className={$.welcomeMessage}>{welcomeMessage}</p>
            </div>
          )}
          {title && <h2 className={$.title}>{title}</h2>}
          {children}
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
