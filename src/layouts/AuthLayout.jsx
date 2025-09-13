import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import $ from "./AuthLayout.module.css";
import Logo from "./../assets/LogoMobile.png";
import sample1 from "./../assets/LoginPage/sample1.jpg";
import sample2 from "./../assets/LoginPage/sample2.jpg";
import sample3 from "./../assets/LoginPage/sample3.jpg";
import sample4 from "./../assets/LoginPage/sample4.jpeg";

const images = [sample1, sample2, sample3, sample4];

const AuthLayout = ({ title, children }) => {
  const [currentImage, setCurrentImage] = useState(images[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => {
        const nextIndex = (images.indexOf(prev) + 1) % images.length;
        return images[nextIndex];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className={$.wrapper}>
        <div className={$.card}>
          <div className={$.image_section}>
            <img src={currentImage} alt="랜덤 이미지" className={$.image} />
          </div>
          <div className={$.login_section}>
            <header>
              <Link to="/">
                <img src={Logo} alt="서울식 로고" className={$.logo} />
              </Link>
            </header>
            {title && <h2 className={$.title}>{title}</h2>}
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
