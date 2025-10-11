// src/components/HashTag/HashTag
import React from "react";

const HashTag = ({ text, color }) => {
  return (
    <>
      <span
        style={{
          display: "flex",
          height: "30px",
          padding: "0 20px",
          alignItems: "center",
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
