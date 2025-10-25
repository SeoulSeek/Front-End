// 방명록 검색 조회 페이지

import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import $ from "./PlacesSearchPage.module.css";
import PlacesLayout from "../../layouts/PlacesLayout"; // 1. 레이아웃 컴포넌트 import
import dummyPosts from "../../data/dummyPosts";
import PostBox from "../../components/PostBox/PostBox2";
import MiniPostBox from "../../components/MiniPostBox/MiniPostBox";
import SortMenu from "../../components/global/SortMenu/SortMenu";

const PlacesSearchPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const [activeTab, setActiveTab] = useState("district");
  const [filters, setFilters] = useState({
    showAdminPosts: true,
    showUserPosts: true,
  });
  const handleFilterChange = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const tabs = [
    { name: "자치구", key: "district" },
    { name: "키워드", key: "keyword" },
    { name: "유저", key: "username" },
  ];

  // 검색 쿼리와 활성 탭에 따라 결과 필터링
  const results = useMemo(() => {
    if (!searchQuery) return [];

    let initialResults;
    switch (activeTab) {
      case "district":
        initialResults = dummyPosts.filter((p) =>
          p.metadata.tags[0]?.includes(searchQuery)
        );
        break;
      case "keyword":
        initialResults = dummyPosts.filter((p) =>
          p.metadata.tags.slice(1)?.some((t) => t.includes(searchQuery))
        );
        break;
      case "username":
        initialResults = dummyPosts.filter((p) =>
          p.author.username?.includes(searchQuery)
        );
        break;
      default:
        initialResults = [];
    }

    // --- 검색 결과에 체크박스 필터 로직 ---
    return initialResults.filter(
      (post) =>
        (filters.showAdminPosts && post.author.admin) ||
        (filters.showUserPosts && !post.author.admin)
    );
  }, [searchQuery, activeTab, filters]);

  const PostComponent = activeTab === "username" ? MiniPostBox : PostBox;

  return (
    <PlacesLayout filters={filters} onFilterChange={handleFilterChange}>
      <div className={$.searchResults}>
        <h2 className={$.searchTitle}>'{searchQuery}' 검색 결과</h2>
        <div className={$.tabWrap}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`${$.tab} ${activeTab === tab.key ? $.activeTab : ""}`}
            >
              {tab.name}
            </button>
          ))}
          <div className={$.sortMenuWrapper}>
            <SortMenu />
          </div>
        </div>

        {results.length > 0 ? (
          <ul className={$.postList}>
            {results.map((post) => (
              <li key={post.id}>
                <PostComponent
                  id={post.id}
                  title={post.title}
                  author={post.author}
                  username={post.author.username}
                  hashtags={post.metadata.tags}
                  likes={post.stats.likes}
                  comments={post.comments.length}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className={$.noResults}>검색 결과가 없습니다.</p>
        )}
      </div>
    </PlacesLayout>
  );
};

export default PlacesSearchPage;
