import React from "react";
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import $ from "./PostInfo.module.css";

const PostInfo = ({
  postedDate,
  isLiked,
  likes = 0,
  comments = 0,
  onClick,
}) => {
  return (
    <>
      <div className={$.postInfo}>
        <span className={$.postedDate}>{postedDate}</span>
        <div className={$.postCounts}>
          <button className={$.likeCount} onClick={onClick}>
            {isLiked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
            <span>{likes}</span>
          </button>
          <div className={$.commentCount}>
            <FaRegComment size={20} />
            <span>{comments}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostInfo;
