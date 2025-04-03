import React from "react";
import { Link } from "react-router-dom";
import styles from "./SortMenu.module.css";
import { IoMdArrowDropdown } from "react-icons/io";

const SortMenu = () => {
  return (
    <div className={styles.sortContainer}>
        추천순
        <IoMdArrowDropdown className={styles.icon}/>
    </div>
  );
};

export default SortMenu;
