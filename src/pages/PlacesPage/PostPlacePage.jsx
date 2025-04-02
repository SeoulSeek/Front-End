import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDropzone } from "react-dropzone";
import { AiOutlineCloseCircle, AiOutlineSearch } from "react-icons/ai";

import $ from "./PlacesPage.module.css";
import dummyPlaces from "../../data/dummyPlaces";
import PlaceSearchBar from "../../components/Input/PlaceSearchBar";
import HashTag from "../../components/HashTag/HashTag";

const PostPlace = () => {
  const [title, setTitle] = useState(""); // 제목
  const [content, setContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPlaceList, setShowPlaceList] = useState(false);
  const [customKeyword, setCustomKeyword] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [hashtags, setHashtags] = useState([]);
  const [selectedTagIndex, setSelectedTagIndex] = useState(-1);
  const [files, setFiles] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // 이미지 업로드 핸들러
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      setFiles([...files, ...newFiles]);
    },
  });

  // 이미지 삭제 핸들러
  const deleteImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (selectedImage === files[index].preview) setSelectedImage(null);
  };

  // 장소 선택 핸들러
  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setShowPlaceList(false);
  };

  // 커스텀 태그 추가
  const addTag = () => {
    if (customKeyword.trim() && !hashtags.includes(customKeyword.trim())) {
      setHashtags([...hashtags, customKeyword.trim()]);
      setCustomKeyword("");
    }
    setShowCustomInput(false);
  };

  // 커스텀 태그 선택/삭제
  const handleTag = (index) => {
    if (selectedTagIndex === index) {
      setHashtags((prev) => prev.filter((_, i) => i !== index));
      setSelectedTagIndex(-1);
    } else {
      setSelectedTagIndex(index);
    }
  };

  // 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    // api 연결
  };

  return (
    <>
      {showPlaceList && (
        <div className={$.overlay} onClick={() => setShowPlaceList(false)}>
          <div className={$.placeModal} onClick={(e) => e.stopPropagation()}>
            <div className={$.searchBarWrap}>
              <PlaceSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="방명록에 표시할 장소를 검색하세요"
              />
            </div>
            <div className={$.resultInfo}>
              {searchQuery ? `‘${searchQuery}’ 검색결과` : "검색결과"}
            </div>
            <div className={$.placeListWrap}>
              <ul className={$.placeList}>
                {dummyPlaces.map((place) => (
                  <li
                    key={place.id}
                    className={$.placeItem}
                    onClick={() => handlePlaceSelect(place)}
                  >
                    <p>{place.title}</p>
                    {place.district && (
                      <HashTag text={place.district} type="district" />
                    )}
                    {place.title && <HashTag text={place.title} type="place" />}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className={$.placesPage}>
        <div className={$.titleWrap}>
          <h1 className={$.pageTitle}>서울식 관광명소</h1>
          <h2 className={$.subTitle}>방명록 작성</h2>
        </div>
      </div>

      <div className={$.contentWrap}>
        <div className={$.image}>
          <h3>이미지 선택</h3>
          <div {...getRootProps()} className={$.dropZone}>
            <input {...getInputProps()} />
            {selectedImage && (
              <div className={$.selectedImageOverlay}>
                <img
                  src={selectedImage}
                  className={$.selectedImage}
                  alt="선택된 이미지"
                />
              </div>
            )}
            {!selectedImage && (
              <p>
                {isDragActive
                  ? "이미지를 여기에 드롭하세요"
                  : "이미지를 드래그하거나 클릭하여 업로드"}
              </p>
            )}
          </div>
          <div className={$.previewContainer}>
            {files.map((file, index) => (
              <div
                key={file.name}
                className={$.imageWrap}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(file.preview);
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteImage(index);
                  }}
                  className={$.deleteBtn}
                >
                  <AiOutlineCloseCircle color="red" />
                </button>
                <img
                  src={file.preview}
                  alt="업로드 미리보기"
                  className={$.imagePreview}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={$.tagWrap}>
          <h3>태그 선택</h3>
          <div className={$.placeSelector}>
            {selectedPlace && (
              <>
                <HashTag text={selectedPlace.district} type="district" />
                <HashTag text={selectedPlace.title} type="place" />
              </>
            )}
            <button
              onClick={() => setShowPlaceList(true)}
              className={$.placeSelectorBtn}
            >
              {selectedPlace ? "장소 변경하기" : "장소 추가하기"}
              <AiOutlineSearch size={20} color="#000" />
            </button>
          </div>
          <div className={$.keywordAdd}>
            {hashtags.map((tag, index) => (
              <div
                key={index}
                className={`${$.hashtag} ${
                  selectedTagIndex === index ? $.selected : ""
                }`}
                onClick={() => handleTag(index)}
              >
                <HashTag text={tag} />
              </div>
            ))}
            {showCustomInput && (
              <input
                type="text"
                value={customKeyword}
                onChange={(e) => setCustomKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                autoFocus
                className={$.keywordInput}
                placeholder="태그를 입력하세요"
              />
            )}
            <button
              onClick={() => setShowCustomInput(true)}
              className={$.keywordAddBtn}
            >
              직접 추가하기
            </button>
          </div>
        </div>

        <div className={$.inputFormWrap}>
          <h3>내용 작성</h3>
          <form onSubmit={handleSubmit} className={$.inputForm}>
            <div className={$.inputGroup}>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="방명록 제목"
                className={$.inputStyle}
                required
              />
            </div>
            <div className={$.inputGroup}>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="다녀온 명소에 대해 설명해주세요.                    
                &#13;&#10;언제 다녀왔나요?                                               
                &#13;&#10; 어떤 역사적 이야기를 발견했나요?"
                className={$.textAreaStyle}
                required
              ></textarea>
            </div>
            <button type="submit" className={$.submitBtn}>
              작성하기
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostPlace;
