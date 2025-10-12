import React from "react";
import $ from "./../../pages/PlacesPage/PlacesPage2.module.css";
import SearchBar from "../Input/SearchBar";
import Checkbox from "../Checkbox/Checkbox";

const PageHeader = ({ onSearch, filters, onFilterChange }) => (
  <div className={$.titleWrap}>
    <h1 className={$.pageTitle}>서울식 관광명소</h1>
    <div className={$.searchWrap}>
      <SearchBar
        onSearch={onSearch}
        placeholder="자치구, 키워드, 유저명으로 방명록을 검색해보세요"
      />
      <div className={$.filterContainer}>
        <Checkbox
          checked={filters.showAdminPosts}
          onChange={() =>
            onFilterChange("showAdminPosts", !filters.showAdminPosts)
          }
        >
          관리자 추천 명소만 보기
        </Checkbox>
        <Checkbox
          checked={filters.showUserPosts}
          onChange={() =>
            onFilterChange("showUserPosts", !filters.showUserPosts)
          }
        >
          유저 추천 명소만 보기
        </Checkbox>
      </div>
    </div>
  </div>
);

export default PageHeader;
