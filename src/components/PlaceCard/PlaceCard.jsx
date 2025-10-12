import React, { useState } from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import styles from "./PlaceCard.module.css";

const PlaceCard = ({ placeName, distance, imageUrl }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveClick = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <div className={styles.placeCard}>
      <div className={styles.placeHeader}>
        <h4 className={styles.placeName}>{placeName}</h4>
        <span className={styles.distance}>{distance}</span>
        <button className={styles.saveButton} onClick={handleSaveClick}>
          {isSaved ? (
            <FaBookmark size={30} color="#ffffff" />
          ) : (
            <FaRegBookmark size={30} color="#ffffff" />
          )}
        </button>
      </div>
      <div className={styles.placeImageWrapper}>
        <img
          src={imageUrl || "https://via.placeholder.com/320x160"}
          alt={placeName}
          className={styles.placeImage}
        />
      </div>
    </div>
  );
};

export default PlaceCard;

