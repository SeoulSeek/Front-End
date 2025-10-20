import React, { useState, useEffect } from "react";
import styles from "./CoursesPage.module.css";
import CoursesBox from "../../components/CoursesBox/CoursesBox";
import SortMenu from "../../components/global/SortMenu/SortMenu";
import { API_ENDPOINTS } from "../../config/api";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(API_ENDPOINTS.COURSES);
        
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        
        const result = await response.json();
        
        if (result.error) {
          throw new Error("API returned an error");
        }
        
        setCourses(result.data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <>
      <h1 className={styles.h1}>서울식 관광코스</h1>
      <div className={styles.sortWrapper}>
        <SortMenu />
      </div>
      <div className={styles.boxes}>
        {courses.map((course) => (
          <CoursesBox
            key={course.id}
            id={course.id}
            title={course.title}
            content={course.content}
            image={course.imageUrl}
            totalLocations={course.totalLocations}
            landmarkTourElements={course.landmarkTourElements}
            specialTourElements={course.specialTourElements}
            missionTourElements={course.missionTourElements}
          />
        ))}
      </div>
      <p className={styles.bottomText}>
        {loading ? "로딩중입니다." : error ? "새로고침을 해주세요." : "목록이 끝났어요."}
      </p>
    </>
  );
};

export default CoursesPage;
