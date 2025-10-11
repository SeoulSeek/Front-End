import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  AiOutlineCloseCircle,
  AiOutlineSearch,
  AiOutlineCloudUpload,
} from "react-icons/ai";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // 유효성 검사 (예: 장소 태그가 선택되었는지)
    if (postData.tags.length < 2) {
      alert("장소 태그를 선택해주세요.");
      return;
    }
    console.log("최종 제출 데이터:", postData);
    // navigate('/places'); // 제출 후 페이지 이동
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
            <button type="submit" className={$.submitBtn}>
              작성하기
            </button>
          </footer>
        </div>
      </main>
    </form>
  );
};

export default PostPlacePage;
