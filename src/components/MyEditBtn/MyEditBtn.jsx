import React from "react";
import styles from "./MyEditBtn.module.css";
import { FaUserEdit } from "react-icons/fa";

const MyEditBtn = () => {
  return (
    <>
      <div className={styles.btnContainer}>
        <span className={styles.btnName}>수정</span>
        <FaUserEdit className={styles.btnIcon} />
      </div>
    </>
  );
};

export default MyEditBtn;
