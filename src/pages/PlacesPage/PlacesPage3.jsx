import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";

import $ from "./PlacesPage3.module.css";
import dummyPosts from "../../data/dummyPosts";
import { useIsDesktop } from "../../hooks/useIsDesktop";

// 공통 레이아웃 및 분리된 컴포넌트 import
import PlacesLayout from "../../layouts/PlacesLayout";
import PostList from "../../components/PlacesPage/PostList";
import Checkbox from "../../components/Checkbox/Checkbox";
import Pagination from "../../components/PlacesPage/Pagination";

const PC_ITEMS_PER_PAGE = 9;
const MOBILE_ITEMS_PER_PAGE = 4;

const PlacesPage = () => {
  const [filters, setFilters] = useState({
    showAdminPosts: true,
    showUserPosts: true,
  });
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const observer = useRef();

  // 필터링된 게시물 목록 (useMemo로 최적화)
  const filteredPosts = useMemo(() => {
    return dummyPosts.filter(
      (post) =>
        (filters.showAdminPosts && post.author.admin) ||
        (filters.showUserPosts && !post.author.admin)
    );
  }, [filters]);

  const itemsPerPage = isDesktop ? PC_ITEMS_PER_PAGE : MOBILE_ITEMS_PER_PAGE;
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const hasNextPage = currentPage < totalPages;

  // 데이터 로딩 Effect
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const newPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);

    if (isDesktop && currentPage > 1) {
      setDisplayedPosts((prev) => [...prev, ...newPosts]);
    } else {
      setDisplayedPosts(newPosts);
    }
  }, [currentPage, filteredPosts, isDesktop, itemsPerPage]);

  // 무한 스크롤 옵저버
  const lastPostElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && isDesktop) {
          setCurrentPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasNextPage, isDesktop]
  );

  const handleFilterChange = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    setCurrentPage(1);
  };

  return (
    <PlacesLayout filters={filters} onFilterChange={handleFilterChange}>
      <PostList posts={displayedPosts} lastPostRef={lastPostElementRef} />

      <div className={$.footer}>
        {!isDesktop && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageClick={(page) => setCurrentPage(page)}
          />
        )}
        <button
          onClick={() => navigate("/places/edit")}
          className={$.postCreateBtn}
        >
          <AiOutlineEdit /> 작성
        </button>
      </div>
    </PlacesLayout>
  );
};

export default PlacesPage;
