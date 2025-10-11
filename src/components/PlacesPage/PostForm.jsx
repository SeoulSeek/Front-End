import React, { useState, useEffect } from "react";
import $ from "./../../pages/PlacesPage/PostPlacePage2.module.css";

const PostForm = ({ onFormChange }) => {
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    onFormChange(id, value);
  };
  return (
    <section>
      <h3 className={$.sectionTitle}>내용 작성</h3>
      <div className={$.inputGroup}>
        <label htmlFor="title" className={$.inputLabel}>
          제목
        </label>
        <input
          id="title"
          onChange={handleInputChange}
          placeholder="방명록의 제목을 입력해주세요."
          className={$.inputStyle}
          required
        />
      </div>
      <div className={$.inputGroup}>
        <label htmlFor="content" className={$.inputLabel}>
          본문
        </label>
        <textarea
          id="content"
          onChange={handleInputChange}
          placeholder="다녀온 명소에 대해 설명해주세요.&#13;&#10;언제 다녀왔나요?&#10;어떤 역사적 이야기를 발견했나요?"
          className={$.textAreaStyle}
          required
        ></textarea>
      </div>
    </section>
  );
};

export default PostForm;
