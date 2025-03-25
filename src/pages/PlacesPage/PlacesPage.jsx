// ./src/pages/PlacesPage/PlacesPage
import React, { useState } from "react";
import { useNavigate } from "react-router";

import $ from "./PlacesPage.module.css";
import SearchBar from "../../components/Input/SearchBar";
import PostBox from "../../components/PostBox/PostBox";
import dummyPosts from "../../data/dummyPosts";
import miniMap from "../../assets/miniMap.png";

const Places = () => {
  const [filteredPosts, setFilteredPosts] = useState(dummyPosts);

  // 검색어 서치
  const navigate = useNavigate();
  const handleSearch = (query) => {
    navigate(`/places/result?q=${encodeURIComponent(query)}`);
  };

  // 좋아요 토글
  const handleLikeToggle = (postId, newLiked) => {
    setFilteredPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: newLiked ? post.likes + 1 : post.likes - 1,
            }
          : post
      )
    );
  };

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
          {/*<label>
            <input
              type="checkbox"
              name="adminPlaces"
              checked={}
              onChange={handleChange}
            />
            관리자 추천명소만 보기
          </label>
          <label>
            <input
              type="checkbox"
              name="userPlaces"
              checked={}
              onChange={handleChange}
            />
            유저 추천 명소만 보기
          </label>*/}
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
            {filteredPosts.map((post) => (
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
                onLikeToggle={handleLikeToggle}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Places;
