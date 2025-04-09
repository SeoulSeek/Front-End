import React from "react";
import { useParams } from "react-router-dom";
import styles from "./CoursesDetail.module.css";
import dummy1 from "../../assets/HomePage/dummy1.jpg";

const CoursesDetail = () => {
  const { id } = useParams();

  // 현재는 dummy 데이터를 사용합니다.
  // 추후 서버에서 실제 데이터를 받아와 처리할 수 있도록 수정하면 됩니다.
  const courseData = {
    id,
    image: dummy1,
    title: "고궁 스토리텔링",
    tags: [
      { type: "all", count: 7 },
      { type: "landmark", count: 4 },
      { type: "special", count: 2 },
      { type: "mission", count: 1 },
    ],
  };

  return (
    <div className={styles.detailContainer}>
      <img 
        src={courseData.image} 
        alt="코스 대표이미지" 
        className={styles.courseImage} 
      />
      <h2 className={styles.title}>{courseData.title}</h2>
      <div className={styles.tags}>
        {courseData.tags.map((tag, index) => (
          <p key={index} className={styles.tagText}>
            {tag.type}: {tag.count}
          </p>
        ))}
      </div>
    </div>
  );
};

export default CoursesDetail;
