// 방명록 검색 조회 페이지

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useSearchParams } from "react-router-dom";

import $ from "./PlacesSearchPage.module.css";
import Loading from "../../components/Loading/Loading";
import { API_ENDPOINTS } from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { DISTRICT_KOR_TO_ENG } from "../../config/mapping";

import PlacesLayout from "../../layouts/PlacesLayout";
import PostBox from "../../components/PostBox/PostBox2";
import MiniPostBox from "../../components/MiniPostBox/MiniPostBox";
import SortMenu from "../../components/global/SortMenu/SortMenu";

const ITEMS_PER_LOAD = 6; // 한 번에 불러올 아이템 수 (조절 가능)

const PlacesSearchPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const [loadedPosts, setLoadedPosts] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalPages: 1,
    hasNext: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("views");
  const [activeTab, setActiveTab] = useState("district");
  const [filters, setFilters] = useState({
    showAdminPosts: true,
    showUserPosts: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isDesktop = useIsDesktop();
  const observer = useRef();
  const auth = useAuth();

  const tabs = [
    { name: "자치구", key: "district" },
    { name: "키워드", key: "keyword" },
    { name: "유저", key: "username" },
  ];

  // API
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        setLoadedPosts([]);
        setIsLoading(false);
        setError(null);
        setPageInfo({ page: 0, totalPages: 1, hasNext: false });
        return;
      }

      setIsLoading(true);
      setError(null);
      console.log(`[검색페이지] Fetching: query=${searchQuery}`);

      try {
        const token = localStorage.getItem("refreshToken");
        const headers = { "Content-Type": "application/json;charset=UTF-8" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        let mode;
        let apiMessage = searchQuery;

        switch (activeTab) {
          case "district":
            mode = 1;
            const englishDistrict = DISTRICT_KOR_TO_ENG[searchQuery];
            if (englishDistrict) {
              apiMessage = englishDistrict;
              console.log(
                `[검색페이지] 자치구 '${searchQuery}' -> 영문 '${apiMessage}' 변환`
              );
            }
            break;
          case "keyword":
            mode = 2;
            break;
          case "username":
            mode = 3;
            break;
          default:
            mode = 1;
        }

        const params = new URLSearchParams({
          mode: mode,
          orderBy: sortBy,
          mobile: !isDesktop,
          pageNumber: currentPage - 1,
          message: apiMessage,
        });

        console.log(
          `[검색페이지] 요청 URL: ${
            API_ENDPOINTS.REVIEW_LIST
          }?${params.toString()}`
        );
        const response = await fetch(
          `${API_ENDPOINTS.REVIEW_LIST}?${params.toString()}`,
          { headers: headers, credentials: "include" }
        );

        if (!response.ok) {
          throw new Error(
            `게시물을 불러오는 데 실패했습니다 (${response.status})`
          );
        }

        const result = await response.json();
        console.log(`[검색페이지] Response Body (JSON):`, result);

        const clientFilteredData = result.data.filter(
          (post) =>
            (filters.showAdminPosts && post.author?.admin) ||
            (filters.showUserPosts && !post.author?.admin)
        );

        setPageInfo(result.pageInfo);
        setLoadedPosts((prev) =>
          currentPage === 1
            ? clientFilteredData
            : [...prev, ...clientFilteredData]
        );
      } catch {
        console.error("[검색페이지]: 게시물 목록 조회 중 에러:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSearchResults();
  }, [searchQuery, currentPage, activeTab, filters, sortBy, isDesktop, auth]);

  // --- 상태 초기화 Effect (검색 조건 변경 시) ---
  useEffect(() => {
    setCurrentPage(1); // 페이지 1로 리셋
    setLoadedPosts([]); // 기존 목록 비우기
  }, [searchQuery, activeTab, filters, sortBy]);

  // --- 무한 스크롤 옵저버 ---
  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        // 다음 페이지가 있고, PC 화면일 때만 다음 페이지 로드
        // 모바일에서는 무한 스크롤 비활성화 (선택)
        if (entries[0].isIntersecting && pageInfo.hasNext /*&& isDesktop*/) {
          console.log("[검색페이지] 다음 페이지 로드...");
          setCurrentPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, pageInfo.hasNext /*, isDesktop*/]
  );

  // --- 이벤트 핸들러 ---
  const handleFilterChange = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

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
            <SortMenu currentSort={sortBy} onSortChange={handleSortChange} />
          </div>
        </div>

        {isLoading && currentPage === 1 && <Loading />}
        {error && <p>오류: {error}</p>}
        {!isLoading && !error && loadedPosts.length === 0 && searchQuery && (
          <p className={$.noResults}>검색 결과가 없습니다.</p>
        )}
        {!searchQuery && <p className={$.noResults}>검색어를 입력해주세요.</p>}

        {loadedPosts.length > 0 && (
          <ul className={$.postList}>
            {loadedPosts.map((post, index) => {
              const isLastElement = loadedPosts.length === index + 1;
              const postProps = {
                id: post.id,
                title: post.title,
                hashtags: post.tags || [],
                author: {
                  userId: null,
                  username: post.username,
                  profileImage: post.fileURL,
                },
                likes: post.like,
                comments: post.comments,
              };
              return (
                <li
                  ref={isLastElement ? lastPostElementRef : null}
                  key={`${post.id}-${index}`}
                >
                  <PostComponent {...postProps} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PlacesLayout>
  );
};

export default PlacesSearchPage;
