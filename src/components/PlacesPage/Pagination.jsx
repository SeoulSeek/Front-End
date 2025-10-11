import React from "react";
import $ from "./Pagination.module.css";

const Pagination = ({ currentPage, totalPages, onPageClick }) => {
  if (totalPages <= 1) return null;

  return (
    <nav className={$.pagination}>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageClick(i + 1)}
          className={currentPage === i + 1 ? $.activePage : ""}
        >
          {i + 1}
        </button>
      ))}
    </nav>
  );
};

export default Pagination;
