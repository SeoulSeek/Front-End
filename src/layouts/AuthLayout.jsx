import React from "react";
import { Link } from "react-router";
import $ from "./AuthLayout.module.css";
import LogoMobile from "../components/Logo/Logo";

const AuthLayout = ({ title, welcomeTitle, welcomeMessage, children }) => {
  return (
    <>
      <div className={$.container}>
        <div className={$.login_container}>
          <header>
            <LogoMobile />
          </header>
          {welcomeTitle && (
            <div className={$.welcomeText}>
              <h3 className={$.welcomeTitle}>{welcomeTitle}</h3>
              <p className={$.welcomeMessage}>{welcomeMessage}</p>
            </div>
          )}
          <h2 className={$.title}>{title}</h2>
          {children}
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
