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
    locationId: null,
    tags: [],
    files: [],
  });

  // 인증 정보 및 로딩 상태
  const auth = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleDataChange = useCallback((key, value) => {
    setPostData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleTagsChange = useCallback((tagData) => {
    // tagData = { locationId: ..., keywords: [...] }
    setPostData((prev) => ({
      ...prev,
      locationId: tagData.locationId,
      tags: tagData.keywords,
    }));
  }, []);

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
    if (!postData.locationId) {
      alert("장소 태그를 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();

    // 텍스트 데이터 (JSON 형식으로 변환하여 Blob으로 추가)
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    formData.append("locationId", postData.locationId);
    if (postData.tags && postData.tags.length > 0) {
      postData.tags.forEach((tag) => formData.append("tags", tag));
    } else {
      formData.append("tags", ""); // 빈 문자열
    }
    // 이미지 파일 추가 (첫 번째 이미지만 전송) ----- 임시
    formData.append("file", postData.files[0]);

    console.log("--- FormData 내용 ---");
    for (let [key, value] of formData.entries()) {
      // 파일 객체는 직접 보기 어려우므로 파일 이름만 출력
      if (value instanceof File) {
        console.log(
          `${key}:`,
          `[File Object - name: ${value.name}, type: ${value.type}]`
        );
      } else {
        console.log(`${key}:`, value);
      }
    }

    // API 호출
    try {
      const token = localStorage.getItem("refreshToken");

      const response = await fetch(`${API_ENDPOINTS.REVIEWS_AUTH}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        alert("방명록이 성공적으로 작성되었습니다!");
        navigate(`/places/${result.data.reviewId}`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("방명록 작성 실패:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
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
