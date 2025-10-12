import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./CoursesDetail.module.css";
import dummy1 from "../../assets/HomePage/dummy1.jpg";
import { 
  AiOutlineCheckCircle, 
  AiOutlineExclamationCircle, 
  AiOutlineClockCircle, 
  AiOutlineQuestionCircle 
} from "react-icons/ai";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import CourseCard from "../../components/CourseCard/CourseCard";

const CoursesDetail = () => {
  const { id } = useParams();

  const [expanded, setExpanded] = useState({
    landmark: false,
    special: false,
    mission: false,
  });

  const toggleExpand = (type) => {
    setExpanded((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

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

  // 각 태그 타입별 더미 데이터
  const placeData = {
    landmark: [
      {
        title: "경복궁",
        description: "1395년 조선 태조가 창건한 법궁으로, 한국에서 가장 웅장한 궁궐입니다. 근정전과 경회루가 대표적인 건축물이며, 전통문화 체험과 함께 한국 역사의 중심을 느낄 수 있습니다.",
      },
      {
        title: "창덕궁",
        description: "1405년 태종이 건립한 조선의 이궁으로, 자연과 조화를 이루는 아름다운 후원이 특징입니다. 유네스코 세계문화유산으로 등재되어 있습니다.",
      },
      {
        title: "덕수궁",
        description: "서울 도심 한복판에 위치한 궁궐로, 근대와 전통이 공존하는 특별한 공간입니다. 석조전과 함께 고종황제의 애환이 서린 역사적 장소입니다.",
      },
      {
        title: "창경궁",
        description: "1484년 성종이 건립한 궁궐로, 봄에는 벚꽃이 아름답기로 유명합니다. 한국의 전통 정원과 건축미를 잘 보존하고 있습니다.",
      },
    ],
    special: [
      {
        title: "덕수궁 돌담길",
        description: "덕수궁을 둘러싸고 있는 아름다운 산책로로, 연인과 가족들에게 인기 있는 장소입니다. 가을철 단풍이 특히 아름다워 걷기 좋은 코스로 유명합니다.",
      },
      {
        title: "북촌한옥마을",
        description: "전통 한옥이 밀집된 지역으로, 조선시대의 정취를 느낄 수 있는 곳입니다. 좁은 골목길을 따라 걸으며 한국의 전통문화를 체험할 수 있습니다.",
      },
    ],
    mission: [
      {
        title: "경복궁 한복 체험하기",
        description: "한복을 대여하여 경복궁과 북촌한옥마을을 방문하며 전통적인 분위기를 만끽하세요. 한복을 입으면 경복궁 입장료가 무료입니다!",
      },
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
      <p className={styles.detailText}>
        한국의 고궁은 단순한 역사적 유적지가 아니라, 왕실의 삶과 조선 시대 문화를 담고 있는 이야기의 보고입니다. 경복궁, 창덕궁, 덕수궁 등 각 궁궐은 저마다의 독특한 스토리를 간직하고 있습니다. 경복궁에서는 근정전과 경회루를 통해 조선 왕실의 위엄을 느낄 수 있으며, 창덕궁은 자연과 조화로운 후원으로 왕의 쉼터 역할을 했습니다. 덕수궁은 근대와 전통이 공존하는 특별한 공간입니다. 이러한 고궁의 이야기를 알고 방문하시면, 더욱 생생한 역사 체험을 하실 수 있습니다.
      </p>
      <div className={styles.tags}>
        {courseData.tags.map((tag, index) => {
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
                    {placeData[tag.type]?.map((place, placeIndex) => (
                      <CourseCard
                        key={placeIndex}
                        title={place.title}
                        description={place.description}
                        type={tag.type}
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
