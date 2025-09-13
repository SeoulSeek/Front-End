import React from "react";
import styles from "./CoursesMobileTag.module.css";
import { 
  AiOutlineCheckCircle, 
  AiOutlineExclamationCircle, 
  AiOutlineClockCircle, 
  AiOutlineQuestionCircle 
} from "react-icons/ai";

const CoursesMobileTag = ({ type, count }) => {
  let bgColor, textPrefix, Icon;

  switch (type) {
    case "all":
      bgColor = "#5C4F43";
      textPrefix = "탐색할 명소";
      Icon = AiOutlineCheckCircle;
      break;
    case "special":
      bgColor = "#38A169";
      textPrefix = "특별 관광요소";
      Icon = AiOutlineExclamationCircle;
      break;
    case "landmark":
      bgColor = "#D4A017";
      textPrefix = "역사 랜드마크";
      Icon = AiOutlineClockCircle;
      break;
    case "mission":
      bgColor = "#C53030";
      textPrefix = "미션 관광요소";
      Icon = AiOutlineQuestionCircle;
      break;
    default:
      bgColor = "#38A169";
      textPrefix = "특별 관광요소";
      Icon = AiOutlineExclamationCircle;
  }

  return (
    <div className={styles.TagContainer}>
      <Icon className={styles.icon} style={{ color: bgColor }}/>
      <p className={styles.TagText}>{`${textPrefix} ${count}개`}</p>
    </div>
  );
};

export default CoursesMobileTag;
