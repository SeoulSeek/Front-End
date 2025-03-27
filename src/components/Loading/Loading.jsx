import React, { useState, useEffect } from "react";
import $ from "./Loading.module.css";

const Loading = () => {
  const loaders = [
    { icon: "⏱️", text: "서울시간여행을 떠나는중 " },
    { icon: "👣", text: "서울 한바퀴 도는중 " },
    { icon: "👀", text: "서울 곳곳을 탐방중 " },
    { icon: "🔍", text: "서울 지도 살펴보는중 " },
  ];

  const randomLoader = loaders[Math.floor(Math.random() * loaders.length)];

  return (
    <div className={$.showbox}>
      <div className={$.loader}>
        <svg className={$.circular} viewBox="25 25 50 50">
          <circle
            className={$.path}
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke-width="1"
            stroke-miterlimit="10"
          />
        </svg>
        <div className={$.emoji}>{randomLoader.icon}</div>
        <div className={$.text}>
          {randomLoader.text}
          <span className={$.dots}>
            <span className={$.dot}>.</span>
            <span className={$.dot}>.</span>
            <span className={$.dot}>.</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loading;
