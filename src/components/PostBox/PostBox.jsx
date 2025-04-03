// ./src/components/PostBox/PostBox
import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";

import $ from "./PostBox.module.css";
import HashTag from "../HashTag/HashTag";
import { Link } from "react-router";
import MiniProfile from "../MiniProfile/MiniProfile";
import PostInfo from "../MiniProfile/PostInfo";

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
  const handleLikeClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes(newLiked ? likes + 1 : likes - 1);
  };

  return (
    <>
      <li className={$.post}>
        <Link to={`/places/${id}`}>
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
              <MiniProfile username={username} />
              <PostInfo
                isLiked={liked}
                likes={likes}
                comments={comments}
                onClick={handleLikeClick}
              />
            </div>
          </div>
        </Link>
      </li>
    </>
  );
};

export default PostBox;
