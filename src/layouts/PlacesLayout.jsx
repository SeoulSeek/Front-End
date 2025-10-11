import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";

import $ from "./PlacesLayout.module.css";
import { useIsDesktop } from "../hooks/useIsDesktop";
import SearchBar from "../components/Input/SearchBar";
import Checkbox from "../components/Checkbox/Checkbox";
import KakaoMiniMap from "../components/KakaoMiniMap/KakaoMiniMap";

const PlacesLayout = ({ children, filters, onFilterChange }) => {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(`/places/result?q=${encodeURIComponent(query)}`);
  };
  const handleCreatePost = () => navigate("/places/edit");
  return (
    <div className={$.placesPage}>
      <div className={$.pageHeader}>
        <h1 className={$.pageTitle}>서울식 관광명소</h1>
        <div className={$.searchWrap}>
          <SearchBar
            onSearch={handleSearch}
            placeholder="자치구, 키워드, 유저명으로 검색"
          />
          <div className={$.filterContainer}>
            <Checkbox
              checked={filters.showAdminPosts}
              onChange={() => onFilterChange("showAdminPosts")}
            >
              관리자 추천 명소만 보기
            </Checkbox>
            <Checkbox
              checked={filters.showUserPosts}
              onChange={() => onFilterChange("showUserPosts")}
            >
              유저 추천 명소만 보기
            </Checkbox>
          </div>
        </div>
      </div>

      <main className={isDesktop ? $.contentsWrap : ""}>
        {isDesktop && (
          <aside className={$.mapWrap}>
            <div className={$.map}>
              <KakaoMiniMap />
            </div>
            <p className={$.message}>
              서울식 유저들이 가장 많이 방문한 역사 명소를 확인해보세요!
            </p>
          </aside>
        )}
        <section className={$.mainContent}>{children}</section>
      </main>

      <div className={$.postCreateBtnWrap}>
        <button onClick={handleCreatePost} className={$.postCreateBtn}>
          작성 <AiOutlineEdit />
        </button>
      </div>
    </div>
  );
};

export default PlacesLayout;
