import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import $ from "./PlaceSearchBar.module.css";

const PlaceSearchBar = ({ value, onChange, placeholder }) => {
  return (
    <>
      <form className={$.searchBar}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={$.searchInput}
        />
        <button
          type="submit"
          style={{
            position: "absolute",
            right: "5px",
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
          <AiOutlineSearch size={30} style={{ color: "#000" }} />
        </button>
      </form>
    </>
  );
};

export default PlaceSearchBar;
