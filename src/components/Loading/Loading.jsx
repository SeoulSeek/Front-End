import React from "react";
import $ from "./Loading.module.css";
import clock from "../../assets/LoadingIcons/clock.png";
import glass from "../../assets/LoadingIcons/glass.png";
import eyes from "../../assets/LoadingIcons/eyes.png";
import foots from "../../assets/LoadingIcons/foots.png";

const Loading = () => {
  const loaders = [
    {
      icon: clock,
      text: "서울 시간여행을 떠나는중 ",
    },
    {
      icon: foots,
      text: "서울 한바퀴 도는중 ",
    },
    { icon: eyes, text: "서울 곳곳을 탐방중 " },
    {
      icon: glass,
      text: "서울 지도 살펴보는중 ",
    },
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
            strokeWidth="1"
            strokeMiterlimit="10"
          />
        </svg>
        <img className={$.emoji} src={randomLoader.icon} alt="loading icon" />
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
