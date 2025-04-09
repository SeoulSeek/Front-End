import React from "react";
import { AiOutlineBorder, AiOutlineCheckSquare } from "react-icons/ai";

const Checkbox = ({ checked, onChange, link, children }) => {
  const handleChange = () => {
    if (onChange) {
      onChange(!checked);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "15px",
        cursor: "pointer",
      }}
    >
      <div
        onClick={handleChange}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {checked ? (
          <AiOutlineCheckSquare size={20} />
        ) : (
          <AiOutlineBorder size={20} />
        )}
      </div>
      {link ? <a href={link}>{children}</a> : <span>{children}</span>}
    </div>
  );
};

export default Checkbox;
