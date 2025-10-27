import React, { useState, useEffect, useMemo } from "react";
import { AiOutlineSearch } from "react-icons/ai";

import $ from "./../../pages/PlacesPage/PostPlacePage2.module.css";
import PlaceSearchBar from "../../components/Input/PlaceSearchBar";
import HashTag from "../../components/global/HashTag/HashTag";
import { API_ENDPOINTS } from "../../config/api";

const TagEditor = ({
  onTagsChange,
  initialTerritory = null,
  initialLocationName = null,
  initialLocationId = null,
  initialKeywords = [],
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPlaceList, setShowPlaceList] = useState(false);
  const [allLocations, setAllLocations] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(
    initialLocationId && initialLocationName && initialTerritory
      ? {
          tid: initialLocationId,
          name: initialLocationName,
          territory: initialTerritory,
        }
      : null
  );
  const [customKeyword, setCustomKeyword] = useState("");
  const [customHashtags, setCustomHashtags] = useState(initialKeywords);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoadingLocations(true);
      try {
        const response = await fetch(API_ENDPOINTS.LOCATION_LIST); // LOCATION_LIST 엔드포인트 사용
        if (!response.ok) throw new Error("장소 목록 로딩 실패");
        const result = await response.json();
        setAllLocations(result.data || []);
      } catch (error) {
        console.error("장소 목록 로딩 중 에러:", error);
      } finally {
        setIsLoadingLocations(false);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    // 선택된 장소의 ID와 키워드 태그 목록을 객체로 전달
    onTagsChange({
      locationId: selectedPlace?.tid || null, // 장소 ID 전달
      keywords: customHashtags,
    });
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
        const updatedKeywords = [...customHashtags, newTag];
        setCustomHashtags(updatedKeywords);
        setCustomKeyword("");
        // 키워드 추가 시 부모에게 알림
        const placeTags = selectedPlace
          ? [selectedPlace.district, selectedPlace.title]
          : [];
        onTagsChange([...placeTags, ...updatedKeywords]);
      }
    }
  };

  const removeCustomTag = (indexToRemove) => {
    const updatedKeywords = customHashtags.filter(
      (_, i) => i !== indexToRemove
    );
    setCustomHashtags(updatedKeywords);
  };

  const filteredLocations = useMemo(() => {
    if (!searchQuery) return allLocations;
    return allLocations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.territory.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allLocations]);

  return (
    <section>
      <h3 className={$.sectionTitle}>태그 선택</h3>
      <div className={$.tagGroup}>
        {/*<label className={$.groupLabel}>장소 태그 (필수)</label>*/}
        <div className={$.placeSelector}>
          {selectedPlace ? (
            <>
              <HashTag text={selectedPlace.territory} color="#91C6FF" />
              <HashTag text={selectedPlace.name} color="#968C6E" />
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
              key={tag}
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
              {isLoadingLocations
                ? "불러오는 중..."
                : searchQuery
                ? `‘${searchQuery}’ 검색결과`
                : "장소 목록"}
            </div>
            <ul className={$.placeList}>
              {filteredLocations.map((location) => (
                <li
                  key={location.tid}
                  className={$.placeItem}
                  onClick={() => handlePlaceSelect(location)}
                >
                  <p className={$.placeItemTitle}>{location.name}</p>
                  <div className={$.placeItemTags}>
                    {" "}
                    <HashTag text={location.territory} color="#91C6FF" />{" "}
                    <HashTag text={location.name} color="#968C6E" />{" "}
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
