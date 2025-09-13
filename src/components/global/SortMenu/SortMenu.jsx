import React, { useState, useEffect, useRef } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import styles from "./SortMenu.module.css";

const SortMenu = () => {
  const [selected, setSelected] = useState("최신순");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = ["최신순", "조회순", "추천순"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  const filteredOptions = options.filter((opt) => opt !== selected);

  return (
    <div className={styles.sortMenu} ref={dropdownRef}>
      {/* 선택된 옵션 영역 */}
      <div className={styles.selectedContainer} onClick={toggleDropdown}>
        <span>{selected}</span>
        <IoMdArrowDropdown className={styles.icon} />
      </div>
      {/* 드롭다운 옵션 영역 */}
      <div className={`${styles.dropdown} ${isOpen ? styles.open : ""}`}>
        {filteredOptions.map((option) => (
          <div
            key={option}
            className={styles.dropdownItem}
            onClick={() => handleSelect(option)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SortMenu;
