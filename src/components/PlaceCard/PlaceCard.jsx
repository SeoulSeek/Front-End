import React, { useState } from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import styles from "./PlaceCard.module.css";
import sampleImage from "../../assets/LoginPage/sample1.jpg";
import { useAuth } from "../../contexts/AuthContext";
import { API_ENDPOINTS } from "../../config/api";

const PlaceCard = ({ 
  id, 
  placeName, 
  distance, 
  imageUrl, 
  variant = "dark", 
  hideDistance = false,
  initialBookmarked = false,
  onBookmarkChange,
  disableBookmark = false
}) => {
  const { user, refreshAuthToken } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(initialBookmarked);

  const handleSaveClick = async (e) => {
    e.stopPropagation();
    
    // 북마크가 비활성화되어 있으면 아무 동작도 하지 않음
    if (disableBookmark) {
      return;
    }
    
    // 로그인 체크
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!id) {
      console.error("장소 ID가 없습니다.");
      return;
    }

    // 낙관적 업데이트
    const previousState = isSaved;
    setIsSaved(!isSaved);
    
    // 콜백이 있으면 호출
    if (onBookmarkChange) {
      onBookmarkChange(id, !isSaved);
    }

    try {
      const token = localStorage.getItem('refreshToken');
      
      if (!token) {
        alert("로그인이 필요합니다.");
        setIsSaved(previousState);
        if (onBookmarkChange) {
          onBookmarkChange(id, previousState);
        }
        return;
      }

      const url = API_ENDPOINTS.LOCATION_BOOKMARK(id);

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.status === 401) {
        // 토큰 재발급 시도
        const newToken = await refreshAuthToken();
        
        if (newToken) {
          const retryResponse = await fetch(url, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': `Bearer ${newToken}`,
            },
            credentials: 'include',
          });

          if (!retryResponse.ok) {
            setIsSaved(previousState);
            if (onBookmarkChange) {
              onBookmarkChange(id, previousState);
            }
          }
        } else {
          setIsSaved(previousState);
          if (onBookmarkChange) {
            onBookmarkChange(id, previousState);
          }
        }
        return;
      }

      if (!response.ok) {
        setIsSaved(previousState);
        if (onBookmarkChange) {
          onBookmarkChange(id, previousState);
        }
      }
    } catch (error) {
      console.error('북마크 업데이트 실패:', error);
      setIsSaved(previousState);
      if (onBookmarkChange) {
        onBookmarkChange(id, previousState);
      }
    }
  };

  const handleCardClick = () => {
    if (id) {
      navigate(`/map/${id}?state=full`);
    }
  };

  const isLight = variant === "light";
  const textColor = isLight ? "#000000" : "#ffffff";

  return (
    <div 
      className={`${styles.placeCard} ${isLight ? styles.lightMode : ''}`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.placeHeader}>
        <h4 className={styles.placeName} style={{ color: textColor }}>{placeName}</h4>
        {!hideDistance && <span className={styles.distance} style={{ color: textColor }}>{distance}</span>}
        {!disableBookmark && (
          <button className={styles.saveButton} onClick={handleSaveClick}>
            {isSaved ? (
              <FaBookmark size={30} color={textColor} />
            ) : (
              <FaRegBookmark size={30} color={textColor} />
            )}
          </button>
        )}
      </div>
      <div className={styles.placeImageWrapper} style={{ borderColor: textColor }}>
        <img
          src={imageUrl || sampleImage}
          alt={placeName}
          className={styles.placeImage}
        />
      </div>
    </div>
  );
};

export default PlaceCard;

