// ./src/pages/PlacesPage/PlacesPage
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { AiOutlineEdit } from "react-icons/ai";

import $ from "./PlacesPage.module.css";
import SearchBar from "../../components/Input/SearchBar";
import PostBox from "../../components/PostBox/PostBox";
import dummyPosts from "../../data/dummyPosts";
import miniMap from "../../assets/miniMap.png";

const ITEMS_PER_PAGE = 3;

const Places = () => {
  const [showAdminPosts, setShowAdminPosts] = useState(true);
  const [showUserPosts, setShowUserPosts] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(dummyPosts.length / ITEMS_PER_PAGE);

  // 검색어 서치
  const navigate = useNavigate();
  const handleSearch = (query) => {
    navigate(`/places/result?q=${encodeURIComponent(query)}`);
  };
  const handleCreatePost = () => {
    navigate("post/new");
  };

  // 유저, 관리자 게시물 필터링
  const filteredPosts = dummyPosts.filter((post) => {
    const isAdminPost = post.admin;
    return (showAdminPosts && isAdminPost) || (showUserPosts && !isAdminPost);
  });

  // 현재 페이지 게시물
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <div className={$.placesPage}>
        <div className={$.titleWrap}>
          <h1 className={$.pageTitle}>서울식 관광명소</h1>
        </div>

        <div>
          <SearchBar
            onSearch={handleSearch}
            placeholder="자치구, 키워드, 유저명으로 방명록을 검색해보세요"
          />
          <div className={$.filterContainer}>
            <label className={$.checkboxLabel}>
              <input
                type="checkbox"
                name="adminPosts"
                checked={showAdminPosts}
                onChange={() => setShowAdminPosts(!showAdminPosts)}
                className={$.checkboxStyle}
              />
              관리자 추천 명소만 보기
            </label>
            <label className={$.checkboxLabel}>
              <input
                type="checkbox"
                name="userPosts"
                checked={showUserPosts}
                onChange={() => setShowUserPosts(!showUserPosts)}
                className={$.checkboxStyle}
              />
              유저 추천 명소만 보기
            </label>
          </div>
        </div>

        <div className={$.mapWrap}>
          <div className={$.map}>
            {/* 미니맵 지도 API */}
            <img src={miniMap} alt="minimap" className={$.miniMap} />
          </div>
          <span className={$.message}>
            서울식 유저들이 가장 많이 방문한
            <br /> 역사 명소를 확인해보세요!
          </span>
        </div>

        <div className={$.postListWrap}>
          <ul className={$.postList}>
            {currentPosts.map((post) => (
              <PostBox
                key={post.id}
                id={post.id}
                title={post.title}
                place={post.place}
                district={post.district}
                hashtags={post.hashtags}
                username={post.username}
                likes={post.likes}
                comments={post.comments}
              />
            ))}
          </ul>
        </div>

        <div className={$.postCreateBtnWrap}>
          <button onClick={handleCreatePost} className={$.postCreateBtn}>
            작성
            <AiOutlineEdit />
          </button>
        </div>

        <div className={$.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              style={{ fontWeight: currentPage === i + 1 ? 700 : 300 }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Places;
