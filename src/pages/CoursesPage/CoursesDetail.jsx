import React from "react";
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
      <text className={styles.detailText}>한국의 고궁은 단순한 역사적 유적지가 아니라, 왕실의 삶과 조선 시대 문화를 담고 있는 이야기의 보고입니다. 경복궁, 창덕궁, 덕수궁 등 각 궁궐은 저마다의 독특한 스토리를 간직하고 있습니다. 경복궁에서는 근정전과 경회루를 통해 조선 왕실의 위엄을 느낄 수 있으며, 창덕궁은 자연과 조화로운 후원으로 왕의 쉼터 역할을 했습니다. 덕수궁은 근대와 전통이 공존하는 특별한 공간입니다. 이러한 고궁의 이야기를 알고 방문하시면, 더욱 생생한 역사 체험을 하실 수 있습니다.</text>
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
