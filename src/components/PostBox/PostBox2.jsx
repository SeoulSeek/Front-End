import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";

import $ from "./PostBox2.module.css";
import HashTag from "../global/HashTag/HashTag";
import defaultProfileImg from "../../assets/PlacePage/profile_a.jpg"; // 기본 프로필 이미지
import { useAuth } from "../../contexts/AuthContext";

const PostBox = ({
  id,
  title,
  hashtags = [],
  author = { userId: 0, username: "알 수 없음", profileImage: null },
  likes = 0,
  isLiked = false,
  comments = 0,
  onLikeToggle,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 좋아요 버튼 클릭 핸들러
  const handleLikeClick = (e) => {
    // Link 컴포넌트의 페이지 이동 이벤트를 막음
    e.preventDefault();
    e.stopPropagation();

    if (onLikeToggle) {
      onLikeToggle(id, !isLiked);
    }
  };

  // 프로필 클릭 핸들러
  const handleProfileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 본인의 프로필인 경우 아무 동작도 하지 않음
    // user.id와 author.userId 비교, 또는 user.name과 author.username 비교
    if (user) {
      const isSameUser = (user.id && String(user.id) === String(author.userId)) ||
                         (user.name && user.name === author.username);
      if (isSameUser) {
        return;
      }
    }
    
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
            {isLiked ? (
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
