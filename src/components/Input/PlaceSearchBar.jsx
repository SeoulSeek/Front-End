import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import $ from "./PlaceSearchBar.module.css";

const PlaceSearchBar = ({ value, onChange, placeholder }) => {
  return (
    <>
      <div className={$.searchBar}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={$.searchInput}
        />
        <AiOutlineSearch size={30} style={{ color: "#000" }} />
      </div>
    </>
  );
};

export default PlaceSearchBar;
