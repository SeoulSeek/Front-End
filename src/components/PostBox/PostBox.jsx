// ./src/components/PostBox/PostBox
import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";

import $ from "./PostBox.module.css";
import HashTag from "../HashTag/HashTag";
import profileImg from "../../assets/profile.png";

const PostBox = ({
  id, //방명록 id
  title,
  hashtags,
  place,
  district,
  username,
  likes: initialLikes,
  comments,
}) => {
  const [liked, setLiked] = useState(false); // 좋아요 상태
  const [likes, setLikes] = useState(initialLikes); // 좋아요 갯수

  // 좋아요 상태 업뎃 함수
  const handleLikeClick = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes((prev) => (newLiked ? prev + 1 : prev - 1));
  };

  return (
    <>
      <li className={$.post}>
        <div className={$.postBox}>
          <h3 className={$.postTitle}>{title}</h3>

          <div className={$.postHashTagList}>
            {district && <HashTag text={district} type="district" />}
            {place && <HashTag text={place} type="place" />}
            {hashtags.map((tag, index) => (
              <HashTag key={index} text={tag} />
            ))}
          </div>

          <div className={$.postUserWrap}>
            <div className={$.userInfo}>
              <img
                src={profileImg}
                alt="profileImg"
                className={$.userProfileImg}
              />
              <span className={$.username}>{username}</span>
            </div>
            <div className={$.postAction}>
              <button onClick={handleLikeClick} className={$.postLikeBtn}>
                {liked ? (
                  <FaHeart size={20} style={{ color: "#000" }} />
                ) : (
                  <FaRegHeart size={20} style={{ color: "#000" }} />
                )}
                <span className={$.likes}>{likes}</span>
              </button>

              <button className={$.postCommentBtn}>
                <FaRegComment size={20} style={{ color: "#000" }} />
                <span className={$.comments}>{comments}</span>
              </button>
            </div>
          </div>
        </div>
      </li>
    </>
  );
};

export default PostBox;
