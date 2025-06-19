import React from "react";
import styles from "./MyPublicBtn.module.css";
import { BiSolidLockOpenAlt, BiSolidLockAlt } from "react-icons/bi";

const MyPublicBtn = ({ isPublic, onClick }) => {
  return (
    <div
      className={`${styles.btnContainer} ${
        isPublic ? styles.activeContainer : ""
      }`}
      onClick={onClick}
    >
      <span
        className={`${styles.btnName} ${
          isPublic ? styles.activeName : ""
        }`}
      >
        공개
      </span>
      {isPublic ? (
        <BiSolidLockAlt
          className={`${styles.btnIcon} ${styles.activeIcon}`}
        />
      ) : (
        <BiSolidLockOpenAlt className={styles.btnIcon} />
      )}
    </div>
  );
};

export default MyPublicBtn;
