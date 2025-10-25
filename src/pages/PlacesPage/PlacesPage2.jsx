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
import dummyPosts from "../../data/dummyPosts";
import KakaoMiniMap from "../../components/KakaoMiniMap/KakaoMiniMap";

// 컴포넌트 import
import PageHeader from "./../../components/PlacesPage/PlacesPageHeader";
import PostList from "./../../components/PlacesPage/PostList";

const PC_ITEMS_PER_PAGE = 9;
const MOBILE_ITEMS_PER_PAGE = 4;

const Places = () => {
  // --- 상태 관리 ---
  const [filters, setFilters] = useState({
    showAdminPosts: true,
    showUserPosts: true,
  });
  const [displayedPosts, setDisplayedPosts] = useState([]); // 화면에 보여질 게시물
  const [currentPage, setCurrentPage] = useState(1);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const navigate = useNavigate();

  // --- 무한 스크롤 옵저버 ---
  const observer = useRef();

  // --- 데이터 계산 (useMemo로 최적화) ---
  const filteredPosts = useMemo(() => {
    return dummyPosts.filter((post) => {
      const isAdminPost = post.author.admin;
      return (
        (filters.showAdminPosts && isAdminPost) ||
        (filters.showUserPosts && !isAdminPost)
      );
    });
  }, [filters]);

  const itemsPerPage = isDesktop ? PC_ITEMS_PER_PAGE : MOBILE_ITEMS_PER_PAGE;
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const hasNextPage = currentPage < totalPages;

  // --- useEffect Hooks ---
  // 화면 크기 감지
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 페이지 또는 필터 변경 시 보여줄 게시물 업데이트
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newPosts = filteredPosts.slice(startIndex, endIndex);

    if (isDesktop && currentPage > 1) {
      // PC 무한 스크롤: 기존 목록에 새 데이터 추가
      setDisplayedPosts((prev) => [...prev, ...newPosts]);
    } else {
      // 모바일 페이지네이션 또는 첫 페이지 로드: 데이터 교체
      setDisplayedPosts(newPosts);
    }
  }, [currentPage, filteredPosts, isDesktop, itemsPerPage]);

  // Intersection Observer 설정
  const lastPostElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && isDesktop) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasNextPage, isDesktop]
  );

  // --- 이벤트 핸들러 ---
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // 필터 변경 시 1페이지로 리셋
  };

  const handlePageClick = (page) => {
    if (currentPage === page) return;
    setCurrentPage(page);
  };

  const handleSearch = (query) =>
    navigate(`/places/result?q=${encodeURIComponent(query)}`);
  const handleCreatePost = () => navigate("/places/edit");

  // --- 렌더링 (Rendering) ---
  return (
    <div className={$.placesPage}>
      <PageHeader
        onSearch={handleSearch}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <div className={$.contentsWrap}>
        <div className={$.mapWrap}>
          <div className={$.map}>
            <KakaoMiniMap />
          </div>
          <span className={$.message}>
            서울식 유저들이 가장 많이 방문한 역사 명소를 확인해보세요!
          </span>
        </div>

        <PostList posts={displayedPosts} lastPostRef={lastPostElementRef} />
      </div>

      <div className={$.postCreateBtnWrap}>
        <button onClick={handleCreatePost} className={$.postCreateBtn}>
          작성 <AiOutlineEdit />
        </button>
      </div>

      {!isDesktop && totalPages > 1 && (
        <div className={$.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
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
