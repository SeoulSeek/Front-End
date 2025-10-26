// 방명록 수정 페이지

import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { API_ENDPOINTS } from "../../config/api";

import $ from "./PostPlacePage2.module.css";
import Loading from "../../components/Loading/Loading";
import ImageUploader from "../../components/PlacesPage/ImageUploader";
import TagEditor from "../../components/PlacesPage/TagEditor";
import PostForm from "../../components/PlacesPage/PostForm";

const ModifyPlacePage = () => {
  const { id } = useParams(); // URL에서 게시물 ID 가져오기
  const navigate = useNavigate();
  const auth = useAuth();

  // --- 상태 관리 ---
  const [initialData, setInitialData] = useState(null); // API에서 불러온 원본 데이터
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    tags: [],
    files: [],
  });
  const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // 기존 데이터 불러오기 api
  useEffect(() => {
    const fetchPostData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("refreshToken");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await fetch(`${API_ENDPOINTS.REVIEW_DETAIL}/${id}`, {
          headers: headers,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("게시물 정보를 불러오는데 실패했습니다.");
        }
        const result = await response.json();

        // 불러온 데이터로 상태 초기화
        const fetchedData = result.data;
        setInitialData(fetchedData);

        const initialTags = [
          fetchedData.tagList?.territory,
          fetchedData.tagList?.locationName,
          ...(fetchedData.tagList?.tagList?.map((tag) => tag.name) || []),
        ].filter(Boolean);

        setPostData({
          title: fetchedData.title || "",
          content: fetchedData.content || "",
          tags: initialTags,
          files: [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPostData();
  }, [id]);

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
    (fieldid, value) => {
      handleDataChange(fieldid, value);
    },
    [handleDataChange]
  );

  const handleFilesChange = useCallback(
    (files) => {
      handleDataChange("files", files);
    },
    [handleDataChange]
  );

  // 수정 api 호출
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

    // 새 이미지가 업로드된 경우 ----- 임시
    if (postData.files.length > 0) {
      formData.append("file", postData.files[0]);
    }

    // API 호출
    try {
      const token = localStorage.getItem("refreshToken");

      const response = await fetch(`${API_ENDPOINTS.REVIEW_UPDATE}/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        alert("방명록이 성공적으로 수정되었습니다!");
        navigate(`/places/${id}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("방명록 작성 실패:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
    console.log("최종 제출 데이터:", postData);
  };

  if (isLoading) return <Loading />;
  if (error) return <div>오류: {error}</div>;
  if (!initialData) return <div>게시물 정보를 찾을 수 없습니다.</div>; // 초기 데이터 로드 실패 시

  return (
    <form className={$.postPlacePage} onSubmit={handleSubmit}>
      <main className={$.mainContent}>
        <div className={$.leftColumn}>
          <header className={$.pageHeader}>
            <h1 className={$.pageTitle}>서울식 관광명소</h1>
            <p className={$.subTitle}>방명록 수정</p>
          </header>
          <ImageUploader
            initialFiles={initialData.fileURL ? [initialData.fileURL] : []}
            onFilesChange={handleFilesChange}
          />
        </div>

        <div className={$.rightColumn}>
          <TagEditor
            initialTerritory={initialData.tagList?.territory}
            initialLocationName={initialData.tagList?.locationName}
            initialKeywords={
              initialData.tagList?.tagList?.map((t) => t.name) || []
            }
            onTagsChange={handleTagsChange}
          />
          <PostForm
            initialTitle={initialData.title}
            initialContent={initialData.content}
            onFormChange={handleFormChange}
          />
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
              {isSubmitting ? "수정 중..." : "수정하기"}
            </button>
          </footer>
        </div>
      </main>
    </form>
  );
};

export default ModifyPlacePage;
