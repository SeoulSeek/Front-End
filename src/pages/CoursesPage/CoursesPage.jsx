import React, { useState, useEffect } from "react";
import styles from "./CoursesPage.module.css";
import CoursesBox from "../../components/CoursesBox/CoursesBox";
import SortMenu from "../../components/global/SortMenu/SortMenu";
import { API_ENDPOINTS } from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortType, setSortType] = useState("recent");
  const { user } = useAuth();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(false);
      
      // 인증 헤더 준비
      const headers = {
        'Content-Type': 'application/json;charset=UTF-8',
      };
      
      const token = localStorage.getItem('refreshToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_ENDPOINTS.COURSES}?sort=${sortType}`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });
      
      console.log('CoursesPage API 호출:', {
        url: `${API_ENDPOINTS.COURSES}?sort=${sortType}`,
        status: response.status,
        hasToken: !!token
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      
      const result = await response.json();
      
      console.log('CoursesPage API 응답:', result);
      
      if (result.error) {
        throw new Error("API returned an error");
      }
      
      const coursesData = result.data || [];
      console.log('받은 코스 데이터 (첫 번째):', coursesData[0]);
      
      setCourses(coursesData);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortType]);

  const handleScrapChange = () => {
    // 스크랩 상태가 변경되면 다시 데이터를 가져옴
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const handleSortChange = (newSortType) => {
    setSortType(newSortType);
  };

  return (
    <>
      <h1 className={styles.h1}>서울식 관광코스</h1>
      <div className={styles.sortWrapper}>
        <SortMenu onSortChange={handleSortChange} />
      </div>
      <div className={styles.boxes}>
        {courses.map((course) => (
          <CoursesBox
            key={course.id}
            id={course.id}
            title={course.title}
            content={course.content}
            image={course.imageUrl}
            scrapped={course.scrapped}
            totalLocations={course.totalLocations}
            landmarkTourElements={course.landmarkTourElements}
            specialTourElements={course.specialTourElements}
            missionTourElements={course.missionTourElements}
            onScrapChange={handleScrapChange}
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
