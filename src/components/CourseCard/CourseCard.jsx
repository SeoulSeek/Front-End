import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CourseCard.module.css";
import sampleHistory from "../../assets/CoursesPage/sample_history.jpg";
import sampleSpecial from "../../assets/CoursesPage/sample_special.png";
import sampleMission from "../../assets/CoursesPage/sample_mission.jpg";
import mapButton from "../../assets/CoursesPage/mapButton.png";
import { AiOutlineQuestionCircle, AiOutlineDollar } from "react-icons/ai";
import { CgSandClock } from "react-icons/cg";

const CourseCard = ({ 
  id,
  title, 
  description, 
  type, 
  image, 
  recommend, 
  runtime, 
  cost 
}) => {
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);

  // type에 따라 이미지 선택 (image prop이 있으면 우선 사용)
  const getImageByType = (type) => {
    if (image) {
      return image;
    }
    switch (type) {
      case "landmark":
        return sampleHistory;
      case "special":
        return sampleSpecial;
      case "mission":
        return sampleMission;
      default:
        return sampleHistory;
    }
  };

  const handleImageClick = () => {
    // 미션 관광요소는 overlay를 표시하지 않음
    if (type !== "mission") {
      setShowOverlay(true);
    }
  };

  const handleTextAreaClick = () => {
    if (showOverlay) {
      setShowOverlay(false);
    }
  };

  const handleMapButtonClick = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    console.log('Map button clicked, id:', id);
    if (id) {
      navigate(`/map/${id}?state=full`);
    } else {
      console.warn('Location id is missing');
    }
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.titleArea} onClick={handleTextAreaClick}>
        {title}
      </div>
      <div className={styles.imageArea}>
        <img
          src={getImageByType(type)}
          alt={title}
          className={styles.image}
          onClick={handleImageClick}
        />
        {showOverlay && (
          <div className={styles.overlay}>
            <img 
              src={mapButton} 
              alt="지도 보기" 
              className={styles.mapButton}
              onClick={handleMapButtonClick}
            />
          </div>
        )}
      </div>
      <div className={styles.descriptionArea} onClick={handleTextAreaClick}>
        {description}
      </div>
      {type === "mission" && (
        <div className={styles.missionInfoContainer}>
          {recommend && (
            <div className={styles.missionInfoRow}>
              <AiOutlineQuestionCircle className={styles.missionIcon} />
              <div className={styles.missionLabel}>미션 추천 대상</div>
              <div className={styles.missionContent}>{recommend}</div>
            </div>
          )}
          {runtime && (
            <div className={styles.missionInfoRow}>
              <CgSandClock className={styles.missionIcon} />
              <div className={styles.missionLabel}>미션 소요 시간</div>
              <div className={styles.missionContent}>{runtime}</div>
            </div>
          )}
          {cost && (
            <div className={styles.missionInfoRow}>
              <AiOutlineDollar className={styles.missionIcon} />
              <div className={styles.missionLabel}>미션 소요 비용</div>
              <div className={styles.missionContent}>{cost}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseCard;

