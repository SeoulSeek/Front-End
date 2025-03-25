// ./src/components/Input/SearchBar
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

import $ from "./SearchBar.module.css";
import { useNavigate } from "react-router";

const SearchBar = ({ initialValue = "", placeholder, onSearch }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/places/result?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      navigate(`/places/result?q=${encodeURIComponent(query)}`); // 엔터키 검색
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={$.searchWrap}>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
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

export default SearchBar;
