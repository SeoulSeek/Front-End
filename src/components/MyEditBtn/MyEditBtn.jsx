import React from "react";
import styles from "./MyEditBtn.module.css";
import { FaUserEdit } from "react-icons/fa";

const MyEditBtn = ({ isEditing, onClick }) => {
  return (
    <div
      className={`${styles.btnContainer} ${
        isEditing ? styles.activeContainer : ""
      }`}
      onClick={onClick}
    >
      <span
        className={`${styles.btnName} ${
          isEditing ? styles.activeName : ""
        }`}
      >
        {isEditing ? "저장" : "수정"}
      </span>
      <FaUserEdit
        className={`${styles.btnIcon} ${
          isEditing ? styles.activeIcon : ""
        }`}
      />
    </div>
  );
};

export default MyEditBtn;
