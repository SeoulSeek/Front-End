import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";

import $ from "./PostBox2.module.css";
import HashTag from "../global/HashTag/HashTag";
import defaultProfileImg from "../../assets/PlacePage/profile_a.jpg"; // 기본 프로필 이미지

const PostBox = ({
  id,
  title,
  hashtags = [],
  author = { userId: 0, username: "알 수 없음", profileImage: null },
  likes: initialLikes = 0,
  comments = 0,
}) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const navigate = useNavigate();

  // 좋아요 버튼 클릭 핸들러
  const handleLikeClick = (e) => {
    // Link 컴포넌트의 페이지 이동 이벤트를 막음
    e.preventDefault();
    e.stopPropagation();

    const newLiked = !liked;
    setLiked(newLiked);
    setLikes(newLiked ? likes + 1 : likes - 1);
  };

  // 프로필 클릭 핸들러
  const handleProfileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/profile/${author.userId}`);
  };

  return (
    <Link to={`/places/${id}`} className={$.postBox}>
      {/* 상단 컨텐츠 영역 (제목, 태그) */}
      <div className={$.contentArea}>
        <h3 className={$.postTitle}>{title}</h3>
        <div className={$.postHashTagList}>
          {hashtags.map((tag, index) => {
            let tagColor;
            if (index === 0) {
              tagColor = "#91C6FF"; // 첫 번째 태그 색상
            } else if (index === 1) {
              tagColor = "#968C6E"; // 두 번째 태그 색상
            } else {
              tagColor = "#D3D9DF";
            }
            // 세 번째 태그부터는 tagColor가 undefined이므로 기본색이 적용됨
            return <HashTag key={index} text={tag} color={tagColor} />;
          })}
        </div>
      </div>

      {/* 하단 정보 영역 (프로필, 좋아요, 댓글) */}
      <div className={$.postUserWrap}>
        {/* 1. 프로필 (사진 + 이름) */}
        <div className={$.miniProfile} onClick={handleProfileClick}>
          <img
            src={author.profileImage || defaultProfileImg}
            alt={`${author.username} profile`}
            className={$.profileImage}
          />
          <span className={$.username}>{author.username}</span>
        </div>

        {/* 2. 정보 (좋아요 + 댓글) */}
        <div className={$.postInfo}>
          <button className={$.infoButton} onClick={handleLikeClick}>
            {liked ? (
              <AiFillHeart size={16} color="#ff4d4d" />
            ) : (
              <AiOutlineHeart size={16} />
            )}
            <span>{likes}</span>
          </button>
          <div className={$.infoItem}>
            <FaRegComment size={15} />
            <span>{comments}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostBox;
