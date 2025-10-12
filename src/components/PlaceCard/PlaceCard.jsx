import React, { useState } from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import styles from "./PlaceCard.module.css";
import sampleImage from "../../assets/LoginPage/sample1.jpg";

const PlaceCard = ({ placeName, distance, imageUrl, variant = "dark" }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveClick = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const isLight = variant === "light";
  const textColor = isLight ? "#000000" : "#ffffff";

  return (
    <div className={`${styles.placeCard} ${isLight ? styles.lightMode : ''}`}>
      <div className={styles.placeHeader}>
        <h4 className={styles.placeName} style={{ color: textColor }}>{placeName}</h4>
        <span className={styles.distance} style={{ color: textColor }}>{distance}</span>
        <button className={styles.saveButton} onClick={handleSaveClick}>
          {isSaved ? (
            <FaBookmark size={30} color={textColor} />
          ) : (
            <FaRegBookmark size={30} color={textColor} />
          )}
        </button>
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

