import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";

import $ from "./PlacesPage.module.css";
import SearchBar from "../../components/Input/SearchBar";
import PostBox from "../../components/PostBox/PostBox";
import dummyPosts from "../../data/dummyPosts";

const ITEMS_PER_LOAD = 5;

const Search = () => {
  const [page, setPage] = useState(1); // 현재페이지
  const [loadedPosts, setLoadedPosts] = useState([]);
  const preventRef = useRef(true); //옵저버 중복 실행 방지
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [sortBy, setSortBy] = useState("latest"); // 정렬 상태 (기본값: 최신순)
  const [activeTab, setActiveTab] = useState("district"); // 현재 활성화된 탭

  const tabs = [
    { id: 1, name: "자치구", key: "district" },
    { id: 2, name: "키워드", key: "place" },
    { id: 3, name: "유저", key: "username" },
  ];

  // 탭별 필터링
  const filteredPosts = dummyPosts.filter((post) =>
    post.district.includes(searchQuery)
  );
  // 무한스크롤
  const loadMorePosts = useCallback(() => {
    const newPosts = filteredPosts.slice(0, page * ITEMS_PER_LOAD);
    console.log(page * ITEMS_PER_LOAD);
    setLoadedPosts(newPosts);
  }, [page]);

  useEffect(() => {
    loadMorePosts();
  }, [loadMorePosts]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && preventRef.current) {
        preventRef.current = false;
        setPage((prev) => prev + 1);
      }
    });
    const sentinel = document.querySelector("#sentinel");
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

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
            {loadedPosts.map((post) => (
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
            <li id="sentinel" style={{ height: "20px" }}></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Search;
