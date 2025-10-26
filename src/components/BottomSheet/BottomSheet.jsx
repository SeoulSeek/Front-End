import React, { useState, useRef, useEffect } from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { BiLinkAlt } from "react-icons/bi";
import styles from "./BottomSheet.module.css";
import PlaceCard from "../PlaceCard/PlaceCard";
import sampleImage from "../../assets/LoginPage/sample1.jpg";
import { useAuth } from "../../contexts/AuthContext";

const BottomSheet = ({ 
  placeData, 
  isOpen, 
  onClose, 
  isSearchMode = false,
  searchQuery = "",
  searchResults = [],
  bottomSheetState,
  setBottomSheetState
}) => {
  const { user } = useAuth();
  const [sheetState, setSheetState] = useState("peek"); // 'peek', 'half', 'full'
  const [isSaved, setIsSaved] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef(null);
  const dragHandleRef = useRef(null);

  // 외부에서 bottomSheetState를 제어하는 경우
  useEffect(() => {
    if (bottomSheetState && setBottomSheetState) {
      setSheetState(bottomSheetState);
    }
  }, [bottomSheetState]);

  // 터치 이벤트를 passive: false로 등록
  useEffect(() => {
    const dragHandle = dragHandleRef.current;
    if (!dragHandle) return;

    let touchStartY = 0;
    let touchCurrentY = 0;
    let isTouchDragging = false;

    const handleTouchStart = (e) => {
      e.stopPropagation();
      touchStartY = e.touches[0].clientY;
      isTouchDragging = true;
      setStartY(touchStartY);
      setIsDragging(true);
    };

    const handleTouchMove = (e) => {
      if (!isTouchDragging) return;
      e.preventDefault(); // 화면 스크롤 방지
      e.stopPropagation();
      touchCurrentY = e.touches[0].clientY;
      setCurrentY(touchCurrentY);
    };

    const handleTouchEnd = (e) => {
      if (!isTouchDragging) return;
      e.stopPropagation();
      isTouchDragging = false;
      setIsDragging(false);

      const deltaY = touchCurrentY - touchStartY;

      // 드래그 방향과 거리에 따라 상태 변경
      if (Math.abs(deltaY) < 50) {
        setStartY(0);
        setCurrentY(0);
        return;
      }

      let newState = sheetState;
      if (deltaY > 0) {
        // 아래로 드래그
        if (sheetState === "full") {
          newState = "half";
        } else if (sheetState === "half") {
          newState = "peek";
        }
      } else {
        // 위로 드래그
        if (sheetState === "peek") {
          newState = "half";
        } else if (sheetState === "half") {
          newState = "full";
        }
      }

      setSheetState(newState);
      if (setBottomSheetState) {
        setBottomSheetState(newState);
      }

      setStartY(0);
      setCurrentY(0);
    };

    // passive: false 옵션으로 이벤트 리스너 등록
    dragHandle.addEventListener('touchstart', handleTouchStart, { passive: false });
    dragHandle.addEventListener('touchmove', handleTouchMove, { passive: false });
    dragHandle.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      dragHandle.removeEventListener('touchstart', handleTouchStart);
      dragHandle.removeEventListener('touchmove', handleTouchMove);
      dragHandle.removeEventListener('touchend', handleTouchEnd);
    };
  }, [sheetState, setBottomSheetState]);

  const handleMouseDown = (e) => {
    setStartY(e.clientY);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCurrentY(e.clientY);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const deltaY = currentY - startY;

    if (Math.abs(deltaY) < 50) return;

    let newState = sheetState;
    if (deltaY > 0) {
      if (sheetState === "full") {
        newState = "half";
      } else if (sheetState === "half") {
        newState = "peek";
      }
      // peek 상태에서는 더 이상 닫히지 않음
    } else {
      if (sheetState === "peek") {
        newState = "half";
      } else if (sheetState === "half") {
        newState = "full";
      }
    }

    setSheetState(newState);
    if (setBottomSheetState) {
      setBottomSheetState(newState);
    }

    setStartY(0);
    setCurrentY(0);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, currentY]);

  const handleSaveClick = (e) => {
    e.stopPropagation();
    
    // 로그인 체크
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    
    setIsSaved(!isSaved);
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(placeData.address);
      alert("복사되었습니다.");
    } catch (err) {
      console.error("복사 실패:", err);
      alert("복사에 실패했습니다.");
    }
  };

  const handleBackgroundClick = () => {
    // 배경 클릭 시 peek 상태로 되돌림
    if (sheetState !== "peek") {
      setSheetState("peek");
      if (setBottomSheetState) {
        setBottomSheetState("peek");
      }
    }
  };

  if (!placeData && !isSearchMode) return null;

  return (
    <>
      {/* 배경 딤 */}
      {sheetState !== "peek" && (
        <div
          className={styles.backdrop}
          onClick={handleBackgroundClick}
        ></div>
      )}

      {/* 바텀 시트 */}
      <div
        ref={sheetRef}
        className={`${styles.bottomSheet} ${styles[sheetState]} ${isSearchMode ? styles.searchMode : ''}`}
      >
        {/* 드래그 핸들 */}
        <div
          ref={dragHandleRef}
          className={styles.dragHandle}
          onMouseDown={handleMouseDown}
        >
          <div className={styles.dragBar}></div>
        </div>

        {/* 검색 모드 */}
        {isSearchMode ? (
          <>
            <div className={styles.searchResultTitle}>
              '{searchQuery}' 검색결과
            </div>
            <div className={styles.searchResultList}>
              {searchResults.map((result) => (
                <PlaceCard
                  key={result.id}
                  placeName={result.placeName}
                  distance={result.distance}
                  imageUrl={result.imageUrl}
                  variant="light"
                />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* 장소 이미지 */}
            <div className={styles.placeImage}>
              <img
                src={placeData.imageUrl || sampleImage}
                alt={placeData.name}
              />
            </div>

            {/* 제목 칸 */}
            <div className={styles.titleSection}>
              <h2 
                className={styles.placeName}
                style={{ fontSize: placeData.name.length > 10 ? '22px' : '35px' }}
              >
                {placeData.name}
              </h2>
              <button className={styles.saveButton} onClick={handleSaveClick}>
                {isSaved ? (
                  <FaBookmark size={24} color="#000000" />
                ) : (
                  <FaRegBookmark size={24} color="#000000" />
                )}
              </button>
            </div>

            {/* 정보 칸 */}
            <div className={styles.infoSection}>
              <div className={styles.infoContainer}>
                <div className={styles.address}>
                  <span>{placeData.address}</span>
                  <button
                    className={styles.copyButton}
                    onClick={handleCopyAddress}
                  >
                    <BiLinkAlt size={25} />
                  </button>
                </div>
                
                {placeData.period && (
                  <div className={styles.periodTag}>
                    <span>{placeData.period}</span>
                  </div>
                )}
                
                <div className={styles.hours}>{placeData.hours}</div>
                <div className={styles.phone}>{placeData.phone}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default BottomSheet;

