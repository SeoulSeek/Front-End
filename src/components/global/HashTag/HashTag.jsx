// src/components/HashTag/HashTag
import React from "react";

const HashTag = ({ type = "default", text }) => {
  const getBackgroundColor = {
    district: "#91C6FF", // 자치구 태그 색상 - 하늘색
    place: "#968C6E", // 장소 태그 색상 - 연한금색
    default: "#D3D9DF", // 기본(일반) 태그 색상 - 연한회색
  };

  return (
    <>
      <span
        style={{
          display: "flex",
          height: "30px",
          padding: "0 20px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "100px",
          backgroundColor: getBackgroundColor[type],
          fontFamily: "Noto Sans KR",
          fontSize: "14px",
          fontWeight: "700",
          color: "#fff",
          whiteSpace: "nowrap",
          boxSizing: "border-box",
        }}
      >
        {text}
      </span>
    </>
  );
};

export default HashTag;
