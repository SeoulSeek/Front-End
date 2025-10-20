import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./CoursesDetail.module.css";
import { 
  AiOutlineCheckCircle, 
  AiOutlineExclamationCircle, 
  AiOutlineClockCircle, 
  AiOutlineQuestionCircle 
} from "react-icons/ai";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import CourseCard from "../../components/CourseCard/CourseCard";
import { API_ENDPOINTS } from "../../config/api";

const CoursesDetail = () => {
  const { id } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({
    landmark: false,
    special: false,
    mission: false,
  });

  // 카테고리 매핑 함수
  const mapCategoryName = (categoryName) => {
    const mapping = {
      'LANDMARK': 'landmark',
      'SPECIAL_TOUR': 'special',
      'MISSION': 'mission'
    };
    return mapping[categoryName] || categoryName.toLowerCase();
  };

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.COURSE_DETAIL(id));
        
        if (!response.ok) {
          throw new Error("Failed to fetch course detail");
        }
        
        const result = await response.json();
        
        if (result.error) {
          throw new Error("API returned an error");
        }
        
        setCourseData(result.data);
      } catch (err) {
        console.error("Error fetching course detail:", err);
        alert("다시 시도해 주시기 바랍니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [id]);

  const toggleExpand = (type) => {
    setExpanded((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // 로딩 중에는 빈 화면
  if (loading || !courseData) {
    return <div className={styles.detailContainer}></div>;
  }

  // 태그 데이터 생성
  const tags = [
    { type: "all", count: courseData.totalLocations }
  ];

  // 카테고리를 객체로 변환 (빠른 조회를 위해)
  const categoryMap = {};
  courseData.categories.forEach((category) => {
    const mappedType = mapCategoryName(category.categoryName);
    categoryMap[mappedType] = {
      type: mappedType,
      count: category.count,
      locations: category.locations
    };
  });

  // 원하는 순서대로 태그 추가: landmark -> special -> mission
  const orderedTypes = ['landmark', 'special', 'mission'];
  orderedTypes.forEach((type) => {
    if (categoryMap[type]) {
      tags.push(categoryMap[type]);
    }
  });

  return (
    <div className={styles.detailContainer}>
      <img 
        src={courseData.imageUrl} 
        alt="코스 대표이미지" 
        className={styles.courseImage} 
      />
      <h2 className={styles.title}>{courseData.title}</h2>
      <p className={styles.detailText}>
        {courseData.content}
      </p>
      <div className={styles.tags}>
        {tags.map((tag, index) => {
          if (tag.type === "all") {
            const commonColor = "#5C4F43";
            return (
              <div key={index} className={styles.tagContainer}>
                <div className={styles.tagRow}>
                  <AiOutlineCheckCircle 
                    style={{ color: commonColor, width: "40px", height: "40px" }} 
                  />
                  <span 
                    className={styles.tagName} 
                    style={{ color: commonColor, marginLeft: "10px" }}
                  >
                    탐색할 명소
                  </span>
                  <span 
                    className={styles.tagCount} 
                    style={{ color: commonColor, marginLeft: "5px", marginRight: "100px" }}
                  >
                    {tag.count}개
                  </span>
                  {/* "all"은 토글 아이콘이 없으므로 동일한 위치를 유지하기 위한 빈 공간 */}
                </div>
              </div>
            );
          } else {
            let Icon, tagName, iconColor;
            if (tag.type === "landmark") {
              Icon = AiOutlineClockCircle;
              tagName = "역사 랜드마크";
              iconColor = "#D4A017";
            } else if (tag.type === "special") {
              Icon = AiOutlineExclamationCircle;
              tagName = "특별 관광요소";
              iconColor = "#38A169";
            } else if (tag.type === "mission") {
              Icon = AiOutlineQuestionCircle;
              tagName = "미션 관광요소";
              iconColor = "#C53030";
            }
            return (
              <div key={index} className={styles.tagContainer}>
                <div className={styles.tagRow}>
                  <Icon 
                    style={{ color: iconColor, width: "40px", height: "40px" }} 
                  />
                  <span 
                    className={styles.tagName} 
                    style={{ color: iconColor, marginLeft: "10px" }}
                  >
                    {tagName}
                  </span>
                  <span 
                    className={styles.tagCount} 
                    style={{ color: iconColor, marginLeft: "5px", marginRight: "100px" }}
                  >
                    {tag.count}개
                  </span>
                  <div 
                    className={styles.toggleIcon}
                    onClick={() => toggleExpand(tag.type)}
                  >
                    {expanded[tag.type] ? (
                      <BiChevronUp style={{ color: "#D3D9DF", width: "40px", height: "40px" }} />
                    ) : (
                      <BiChevronDown style={{ color: "#D3D9DF", width: "40px", height: "40px" }} />
                    )}
                  </div>
                </div>
                {expanded[tag.type] && (
                  <div className={styles.expandedArea}>
                    {tag.locations?.map((location, locationIndex) => (
                      <CourseCard
                        key={locationIndex}
                        title={location.name}
                        description={location.description}
                        image={location.imageUrl}
                        type={tag.type}
                        recommend={location.recommend}
                        runtime={location.runtime}
                        cost={location.cost}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default CoursesDetail;
