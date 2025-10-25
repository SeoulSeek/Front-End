// 방명록 작성 페이지

import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { API_ENDPOINTS } from "../../config/api";

import $ from "./PostPlacePage2.module.css";
import ImageUploader from "../../components/PlacesPage/ImageUploader";
import TagEditor from "../../components/PlacesPage/TagEditor";
import PostForm from "../../components/PlacesPage/PostForm";

const PostPlacePage = () => {
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    tags: [],
    files: [],
  });

  // 인증 정보 및 로딩 상태
  const auth = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleDataChange = useCallback((key, value) => {
    setPostData((prev) => ({ ...prev, [key]: value }));
  }, []); // 의존성 배열이 비어있으므로 이 함수는 최초 1회만 생성됨

  const handleTagsChange = useCallback(
    (tags) => {
      handleDataChange("tags", tags);
    },
    [handleDataChange]
  );

  const handleFormChange = useCallback(
    (id, value) => {
      handleDataChange(id, value);
    },
    [handleDataChange]
  );

  const handleFilesChange = useCallback(
    (files) => {
      handleDataChange("files", files);
    },
    [handleDataChange]
  );

  // api 인증로직
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 유효성 검사
    if (!auth.user) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/login");
      return;
    }
    if (postData.tags.length < 2) {
      alert("장소 태그를 선택해주세요.");
      return;
    }

    setIsSubmitting(true);

    // --- API 요청 데이터 생성 ---
    const formData = new FormData();

    // 텍스트 데이터 (JSON 형식으로 변환하여 Blob으로 추가)
    const reviewRequest = {
      title: postData.title,
      content: postData.content,
      location: postData.tags[1], // 장소명
      tagList: {
        locationName: postData.tags[1], // 장소명
        territory: postData.tags[0], // 자치구
        tagList: postData.tags.slice(2).map((tag) => ({ name: tag })), // 키워드 태그
      },
    };
    formData.append(
      "reviewRequest",
      new Blob([JSON.stringify(reviewRequest)], { type: "application/json" })
    );

    // 이미지 파일 추가 (첫 번째 이미지만 전송) ----- 임시
    formData.append("file", postData.files[0]);

    // API 호출
    try {
      const token = localStorage.getItem("refreshToken");

      const response = await fetch(API_ENDPOINTS.REVIEW_CREATE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert("방명록이 성공적으로 작성되었습니다!");
        navigate(`/places/${result.data.reviewId}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("방명록 작성 실패:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }

    console.log("최종 제출 데이터:", postData);
  };

  return (
    <form className={$.postPlacePage} onSubmit={handleSubmit}>
      <main className={$.mainContent}>
        <div className={$.leftColumn}>
          <header className={$.pageHeader}>
            <h1 className={$.pageTitle}>서울식 관광명소</h1>
            <p className={$.subTitle}>방명록 작성</p>
          </header>
          <ImageUploader onFilesChange={handleFilesChange} />
        </div>

        <div className={$.rightColumn}>
          <TagEditor onTagsChange={handleTagsChange} />
          <PostForm onFormChange={handleFormChange} />
          <footer className={$.pageFooter}>
            {/*<button
          type="button"
          className={$.cancelBtn}
          onClick={() => navigate(-1)}
        >
          취소
        </button>*/}
            <button
              type="submit"
              className={$.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? "작성 중..." : "작성하기"}
            </button>
          </footer>
        </div>
      </main>
    </form>
  );
};

export default PostPlacePage;
