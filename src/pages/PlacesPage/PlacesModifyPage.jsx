// 방명록 수정 페이지

import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    locationId: null,
    tags: [],
    files: [],
  });
  const [initialImageRemoved, setInitialImageRemoved] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // 기존 데이터 불러오기 api
  useEffect(() => {
    const fetchPostData = async () => {
      setIsLoading(true);
      setError(null);
      console.log(`[수정페이지] 방명록 ID: ${id}`);
      try {
        const token = localStorage.getItem("refreshToken");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await fetch(`${API_ENDPOINTS.REVIEWS}/${id}`, {
          headers: headers,
          credentials: "include",
        });
        console.log(`[수정페이지] 응답 상태: ${response.status}`);

        if (!response.ok) {
          throw new Error("게시물 정보를 불러오는데 실패했습니다.");
        }
        const result = await response.json();
        console.log(`[수정페이지] 데이터 수신:`, result.data);

        // 불러온 데이터로 상태 초기화
        const fetchedData = result.data;
        setInitialData(fetchedData);

        setPostData({
          title: fetchedData.title || "",
          content: fetchedData.content || "",
          locationId:
            fetchedData.locationId || fetchedData.tagList?.locationId || null, // 방법찾기전까지 null
          tags: fetchedData.tagList?.tagList?.map((tag) => tag.name) || [], // 키워드 설정
          files: [], // 파일은 ImageUploader가 initialFiles로 처리
        });
      } catch (err) {
        console.error("[상세페이지] Error data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPostData();
  }, [id]);

  const handleDataChange = useCallback((key, value) => {
    setPostData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleTagsChange = useCallback((tagData) => {
    setPostData((prev) => ({
      ...prev,
      locationId: tagData.locationId,
      tags: tagData.keywords,
    }));
  }, []);

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

  const handleInitialImageDelete = useCallback(() => {
    setInitialImageRemoved(true);
    console.log("[ModifyPage] 초기 이미지가 삭제됨으로 표시됨.");
  }, []);

  // 수정 api 호출
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 유효성 검사
    if (!id) {
      alert("잘못된 접근입니다. 게시물 ID가 없습니다.");
      return;
    }
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

    // --- API 요청 데이터 생성 ---
    const formData = new FormData();

    // 데이터 추가
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    formData.append("locationId", String(postData.locationId));
    if (postData.tags && postData.tags.length > 0) {
      postData.tags.forEach((tag) => formData.append("tags", tag));
    } else {
      formData.append("tags", "");
    }

    let fileRemovedValue = "false";
    if (initialImageRemoved && postData.files.length === 0) {
      fileRemovedValue = "true";
    }
    formData.append("fileRemoved", fileRemovedValue);
    console.log(`[ModifyPage] fileRemoved 값 추가: ${fileRemovedValue}`);
    if (postData.files.length > 0) {
      formData.append("file", postData.files[0]);
      console.log(`[ModifyPage] 새 파일 추가: ${postData.files[0].name}`);
    } else {
      console.log(`[ModifyPage] 새 파일 없음.`);
    }

    console.log("--- FormData 내용 (Modify) ---");
    for (let [key, value] of formData.entries()) {
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

      console.log(`[ModifyPage] API Endpoint: ${API_ENDPOINTS.REVIEWS}`);
      const response = await fetch(`${API_ENDPOINTS.REVIEWS}/${id}`, {
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
            initialFiles={
              initialData?.fileURL
                ? Array.isArray(initialData.fileURL)
                  ? initialData.fileURL
                  : [initialData.fileURL]
                : []
            }
            onFilesChange={handleFilesChange}
            onInitialImageDelete={handleInitialImageDelete} // 콜백 전달
          />
        </div>

        <div className={$.rightColumn}>
          <TagEditor
            initialLocationId={
              initialData.locationId || initialData.tagList?.locationId
            } // API 응답 확인 필요
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
