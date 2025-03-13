// src/components/Logo/Logo.jsx
import React from "react";
import { Link } from "react-router";
import Frame from "../../assets/Frame.svg";

const Logo = () => {
  const imageUrl = Frame;
  const logoText = {
    korean: "서울식",
    english: "Seoul Seek",
  };
  return (
    <Link to="/" style={{ textDecoration: "none" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <img
          src={imageUrl}
          alt="Logo"
          style={{ width: "40px", height: "40px" }}
        />
        <div style={{ display: "flex", gap: "5px" }}>
          <span
            style={{ fontSize: "20px", fontWeight: "700", color: "#303943" }}
          >
            {logoText.korean}
          </span>
          <span
            style={{ fontSize: "20px", fontWeight: "400", color: "#303943" }}
          >
            {logoText.english}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
