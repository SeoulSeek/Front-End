// src/components/Input/Input.jsx
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import $ from "./Input.module.css";

const Input = ({
  type,
  placeholder,
  value,
  onChange,
  name,
  verifyButton = false,
  onVerifyButtonClick,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className={$.inputWrap}>
      <input
        type={type === "password" && showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        className={$.inputItem}
      />
      {type === "password" && (
        <button
          type="button"
          onClick={handleTogglePassword}
          style={{
            position: "absolute",
            right: verifyButton ? "100px" : "5px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {showPassword ? (
            <AiOutlineEye size={30} style={{ color: "#000" }} />
          ) : (
            <AiOutlineEyeInvisible size={30} style={{ color: "#000" }} />
          )}
        </button>
      )}
      {verifyButton && (
        <button
          type="button"
          onClick={onVerifyButtonClick}
          style={{
            position: "absolute",
            width: "50px",
            height: "50px",
            right: "0px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "#000",
            color: "#fff",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: "15px",
            fontFamily: "Noto Sans KR",
            fontWeight: "700",
          }}
        >
          인증
        </button>
      )}
    </div>
  );
};

export default Input;
