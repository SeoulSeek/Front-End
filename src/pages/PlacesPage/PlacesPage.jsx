// ./src/pages/PlacesPage/PlacesPage
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { AiOutlineEdit } from "react-icons/ai";

import $ from "./PlacesPage.module.css";
import SearchBar from "../../components/Input/SearchBar";
import PostBox from "../../components/PostBox/PostBox";
import Checkbox from "../../components/Checkbox/Checkbox";
import SortMenu from "../../components/global/SortMenu/SortMenu";
import dummyPosts from "../../data/dummyPosts";
import seoulMap from "../../assets/PlacePage/seoulMap.jpg";

const Places = () => {
  const [showAdminPosts, setShowAdminPosts] = useState(true);
  const [showUserPosts, setShowUserPosts] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3); // default: 모바일

  // 검색어 서치
  const navigate = useNavigate();
  const handleSearch = (query) => {
    navigate(`/places/result?q=${encodeURIComponent(query)}`);
  };
  const handleCreatePost = () => {
    navigate("/places/edit");
  };

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setItemsPerPage(9); // PC
      } else if (width >= 768) {
        setItemsPerPage(6); // 태블릿
      } else {
        setItemsPerPage(3); // 모바일
      }
    };

    updateItemsPerPage(); // 처음 실행
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // 유저, 관리자 게시물 필터링
  const filteredPosts = dummyPosts.filter((post) => {
    const isAdminPost = post.author.admin;
    return (showAdminPosts && isAdminPost) || (showUserPosts && !isAdminPost);
  });

  const totalPages = Math.ceil(dummyPosts.length / itemsPerPage);
  // 현재 페이지 게시물
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className={$.placesPage}>
        <div className={$.titleWrap}>
          <h1 className={$.pageTitle}>서울식 관광명소</h1>
          <div className={$.searchWrap}>
            <SearchBar
              onSearch={handleSearch}
              placeholder="자치구, 키워드, 유저명으로 방명록을 검색해보세요"
            />
            <div className={$.filterContainer}>
              <Checkbox
                checked={showAdminPosts}
                onChange={() => setShowAdminPosts(!showAdminPosts)}
              >
                관리자 추천 명소만 보기
              </Checkbox>
              <Checkbox
                checked={showUserPosts}
                onChange={() => setShowUserPosts(!showUserPosts)}
              >
                유저 추천 명소만 보기
              </Checkbox>
            </div>
          </div>
        </div>

        <div className={$.contentsWrap}>
          <div className={$.mapWrap}>
            <div className={$.map}>
              {/* 미니맵 지도 API */}
              <img src={seoulMap} />
            </div>
            <span className={$.message}>
              서울식 유저들이 가장 많이 방문한 역사 명소를 확인해보세요!
            </span>
          </div>

          <div className={$.postListWrap}>
            <ul className={$.postList}>
              {currentPosts.map((post) => (
                <PostBox
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  place={post.metadata.location.name}
                  district={post.metadata.location.district}
                  hashtags={post.metadata.tags}
                  username={post.author.username}
                  likes={post.stats.likes}
                  comments={post.comments.length}
                />
              ))}
            </ul>
          </div>
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
