import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import $ from "./PlacesPage.module.css";
import SearchBar from "../../components/Input/SearchBar";
import PostBox from "../../components/PostBox/PostBox";
import dummyPosts from "../../data/dummyPosts";

const Search = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [sortBy, setSortBy] = useState("latest"); // 정렬 상태 (기본값: 최신순)
  const [activeTab, setActiveTab] = useState("district"); // 현재 활성화된 탭

  const tabs = [
    { id: 1, name: "자치구", key: "district" },
    { id: 2, name: "키워드", key: "place" },
    { id: 3, name: "유저", key: "username" },
  ];

  const filteredPosts = dummyPosts.filter((post) =>
    post.district.includes(searchQuery)
  );

  const handleLikeToggle = (postId, newLiked) => {
    //좋아요 상태 업뎃
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
            initialValue={searchQuery}
            placeholder="자치구, 키워드, 유저명으로 방명록을 검색해보세요"
          />
          <div>{/* 체크박스 */}</div>
        </div>

        <div className={$.tabWrap}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.key)}
              className={$.tab}
              style={{
                fontFamily: "Noto Sans KR",
                fontSize: "20px",
                fontWeight: "700",
                color: activeTab === tab.key ? "#6d8196" : "#d3d9df",
                padding: "0 10px",
                boxSizing: "border-box",
              }}
            >
              {tab.name}
            </button>
          ))}
          <div>
            {
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="lastest">최신순</option>
                <option value="popular">추천순</option>
              </select>
            }
          </div>
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
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Search;
