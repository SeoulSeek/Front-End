// 방명록 기본 메인 페이지

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";

import $ from "./PlacesPage2.module.css";
import KakaoMiniMap from "../../components/KakaoMiniMap/KakaoMiniMap";
import Loading from "../../components/Loading/Loading";
import { API_ENDPOINTS } from "../../config/api"; // API 엔드포인트
import { useIsDesktop } from "../../hooks/useIsDesktop"; // useIsDesktop
import { useAuth } from "../../contexts/AuthContext"; // useAuth

// 컴포넌트 import
import PageHeader from "./../../components/PlacesPage/PlacesPageHeader";
import PostList from "./../../components/PlacesPage/PostList";
import SortMenu from "../../components/global/SortMenu/SortMenu";

const PC_ITEMS_PER_PAGE = 9;
const MOBILE_ITEMS_PER_PAGE = 4;

const Places = () => {
  // --- 상태 관리 ---
  const [filters, setFilters] = useState({
    showAdminPosts: true,
    showUserPosts: true,
  });
  const [displayedPosts, setDisplayedPosts] = useState([]); // 화면에 보여질 게시물
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalPages: 1,
    hasNext: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("views");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const auth = useAuth();
  // --- 무한 스크롤 옵저버 ---
  const observer = useRef();

  // API 호출
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("refreshToken");
        const headers = { "Content-Type": "application/json;charset=UTF-8" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const params = new URLSearchParams({
          mode: 2,
          orderBy: sortBy,
          mobile: !isDesktop,
          pageNumber: currentPage - 1,
          message: "",
        });

        console.log(
          `[PlacesPage] Request URL: ${
            API_ENDPOINTS.REVIEW_LIST
          }?${params.toString()}`
        );

        const response = await fetch(
          `${API_ENDPOINTS.REVIEW_LIST}?${params.toString()}`,
          {
            headers: headers,
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(
            `게시물을 불러오는 데 실패했습니다 (${response.status})`
          );
        }
        const result = await response.json();
        console.log("PlacePage: 데이터 조회 성공:");

        const clientFilteredData = result.data.filter(
          (post) =>
            (filters.showAdminPosts && post.author?.admin) ||
            (filters.showUserPosts && !post.author?.admin)
        );

        setPageInfo(result.pageInfo);

        if (isDesktop && currentPage > 1) {
          setDisplayedPosts((prev) => [...prev, ...clientFilteredData]);
        } else {
          setDisplayedPosts(clientFilteredData);
        }
      } catch (err) {
        console.error("PlacePage: 게시물 상세 정보 조회 중 에러:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [currentPage, filters, sortBy, isDesktop, auth]);

  // --- 무한 스크롤 옵저버 ---
  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        // 다음 페이지가 있고, PC 화면일 때만 다음 페이지 로드
        if (entries[0].isIntersecting && pageInfo.hasNext && isDesktop) {
          setCurrentPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, pageInfo.hasNext, isDesktop]
  );

  // --- 이벤트 핸들러 ---
  const handleFilterChange = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    setCurrentPage(1); // 필터 변경 시 1페이지로 리셋
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handlePageClick = (page) => {
    if (currentPage === page) return;
    setCurrentPage(page);
  };

  const handleSearch = (query) =>
    navigate(`/places/result?q=${encodeURIComponent(query)}`);

  const handleCreatePost = () => navigate("/places/edit");

  return (
    <div className={$.placesPage}>
      <PageHeader
        onSearch={handleSearch}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <div className={$.sortMenuContainer}>
        <SortMenu currentSort={sortBy} onSortChange={handleSortChange} />
      </div>

      <div className={$.contentsWrap}>
        <div className={$.mapWrap}>
          <div className={$.map}>
            <KakaoMiniMap />
          </div>
          <span className={$.message}>
            서울식 유저들이 가장 많이 방문한 역사 명소를 확인해보세요!
          </span>
        </div>

        {isLoading && currentPage === 1 && <Loading />}
        {error && <p>오류: {error}</p>}

        <PostList posts={displayedPosts} lastPostRef={lastPostElementRef} />

        {isLoading && currentPage > 1 && <Loading />}
      </div>

      {auth.user && (
        <button onClick={handleCreatePost} className={$.postCreateBtn}>
          <AiOutlineEdit /> 작성
        </button>
      )}

      {!isDesktop && (
        <div className={$.pagination}>
          {Array.from({ length: pageInfo.totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageClick(i + 1)}
              className={currentPage === i + 1 ? $.activePage : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Places;
