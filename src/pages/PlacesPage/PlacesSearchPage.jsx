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
    { id: 2, name: "키워드", key: "keyword" },
    { id: 3, name: "유저", key: "username" },
  ];

  // 탭별 필터링
  const filteredPostsByTab = useCallback(() => {
    if (!searchQuery) return dummyPosts;

    switch (activeTab) {
      case "district":
        return dummyPosts.filter(
          (post) => post.district && post.district.includes(searchQuery)
        );
      case "keyword":
        return dummyPosts.filter(
          (post) =>
            (post.hashtags &&
              post.hashtags.some((tag) => tag.includes(searchQuery))) ||
            (post.place && post.place.includes(searchQuery))
        );
      case "username":
        return dummyPosts.filter(
          (post) => post.username && post.username.includes(searchQuery)
        );
      default:
        dummyPosts;
    }
  }, [searchQuery, activeTab]);

  const filteredPosts = React.useMemo(() => {
    return filteredPostsByTab();
  }, [filteredPostsByTab]);

  // 무한스크롤
  const loadMorePosts = useCallback(() => {
    const newPosts = filteredPosts.slice(0, page * ITEMS_PER_LOAD);
    console.log(page * ITEMS_PER_LOAD);
    setLoadedPosts(newPosts);
    // 더 로드할 데이터 없으면 옵저버 비활성
    if (page * ITEMS_PER_LOAD >= filteredPosts.length) {
      preventRef.current = false;
    } else {
      preventRef.current = true;
    }
  }, [page, filteredPosts]);

  // 검색조건 변경시 초기화
  useEffect(() => {
    setPage(1);
    setLoadedPosts([]);
    preventRef.current = true;
    loadMorePosts(); // 초기데이터로드
  }, [searchQuery, activeTab]);

  // 페이지변경시 데이터 로드
  useEffect(() => {
    loadMorePosts();
  }, [loadMorePosts]);

  // 인터셉션옵저버
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && preventRef.current) {
        preventRef.current = false;
        setPage((prev) => prev + 1);
      }
    });
    const sentinel = document.querySelector("#sentinel");
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect(); // 수정?
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
              className={`${$.tab} ${activeTab === tab.key ? $.activeTab : ""}`}
            >
              {tab.name}
            </button>
          ))}
          <div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="lastest">최신순</option>
              <option value="popular">추천순</option>
            </select>
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
