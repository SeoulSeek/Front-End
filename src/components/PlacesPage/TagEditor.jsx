import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";

import $ from "./../../pages/PlacesPage/PostPlacePage2.module.css";
import dummyPlaces from "../../data/dummyPlaces";
import PlaceSearchBar from "../../components/Input/PlaceSearchBar";
import HashTag from "../../components/global/HashTag/HashTag";

const TagEditor = ({ onTagsChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPlaceList, setShowPlaceList] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [customKeyword, setCustomKeyword] = useState("");
  const [customHashtags, setCustomHashtags] = useState([]);

  useEffect(() => {
    const placeTags = selectedPlace
      ? [selectedPlace.district, selectedPlace.title]
      : [];
    onTagsChange([...placeTags, ...customHashtags]);
  }, [selectedPlace, customHashtags, onTagsChange]);

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setShowPlaceList(false);
  };

  const addCustomTag = (e) => {
    if (e.key === "Enter" && !e.isComposing) {
      e.preventDefault();
      const newTag = customKeyword.trim();
      if (
        newTag &&
        !customHashtags.includes(newTag) &&
        customHashtags.length < 10
      ) {
        setCustomHashtags([...customHashtags, newTag]);
        setCustomKeyword("");
      }
    }
  };

  const removeCustomTag = (indexToRemove) => {
    setCustomHashtags((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <section>
      <h3 className={$.sectionTitle}>태그 선택</h3>
      <div className={$.tagGroup}>
        {/*<label className={$.groupLabel}>장소 태그 (필수)</label>*/}
        <div className={$.placeSelector}>
          {selectedPlace ? (
            <>
              <HashTag text={selectedPlace.district} color="#91C6FF" />
              <HashTag text={selectedPlace.title} color="#968C6E" />
            </>
          ) : (
            ""
          )}
          <button
            type="button"
            onClick={() => setShowPlaceList(true)}
            className={$.placeSelectorBtn}
          >
            <AiOutlineSearch size={18} color="#000" />{" "}
            {selectedPlace ? "장소 변경하기" : "장소 추가하기"}
          </button>
        </div>
      </div>
      <div className={$.tagGroup}>
        {/*<label className={$.groupLabel}>키워드 태그 (선택, 최대 10개)</label>*/}
        <div className={$.keywordAdd}>
          {customHashtags.map((tag, index) => (
            <div
              key={index}
              className={$.customTagWrap}
              onClick={() => removeCustomTag(index)}
            >
              <HashTag text={tag} color="#D3D9DF" />
              <div className={$.deleteTagOverlay}>×</div>
            </div>
          ))}
          {customHashtags.length < 10 && (
            <input
              type="text"
              value={customKeyword}
              onChange={(e) => setCustomKeyword(e.target.value)}
              onKeyDown={addCustomTag}
              className={$.keywordInput}
              placeholder="태그 추가하기"
            />
          )}
        </div>
      </div>
      {showPlaceList && (
        <div className={$.overlay} onClick={() => setShowPlaceList(false)}>
          <div className={$.placeModal} onClick={(e) => e.stopPropagation()}>
            <div className={$.searchBarWrap}>
              {" "}
              <PlaceSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="장소 검색..."
              />{" "}
            </div>
            <div className={$.resultInfo}>
              {searchQuery ? `‘${searchQuery}’ 검색결과` : "장소 목록"}
            </div>
            <ul className={$.placeList}>
              {dummyPlaces
                .filter(
                  (p) =>
                    p.title.includes(searchQuery) ||
                    p.district.includes(searchQuery)
                )
                .map((place) => (
                  <li
                    key={place.id}
                    className={$.placeItem}
                    onClick={() => handlePlaceSelect(place)}
                  >
                    <p className={$.placeItemTitle}>{place.title}</p>
                    <div className={$.placeItemTags}>
                      {" "}
                      <HashTag text={place.district} color="#91C6FF" />{" "}
                      <HashTag text={place.title} color="#968C6E" />{" "}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};
export default TagEditor;
