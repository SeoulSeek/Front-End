// src/components/HashTag/HashTag
import React from "react";

const HashTag = ({ text, color, width }) => {
  return (
    <>
      <span
        style={{
          display: "flex",
          width: width || "auto",
          height: "30px",
          padding: width ? "0" : "0 20px",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "100px",
          backgroundColor: color,
          fontFamily: "Noto Sans KR",
          fontSize: "0.85rem",
          fontWeight: "600",
          color: "#fff",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    </>
  );
};

export default HashTag;
