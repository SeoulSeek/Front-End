import React from "react";
import { Link, useNavigate } from "react-router-dom";

import $ from "./MiniPostBox.module.css";
import defaultProfileImg from "../../assets/PlacePage/profile_a.jpg"; // 기본 프로필 이미지

const MiniPostBox = ({
  id,
  title,
  author = { userId: 0, username: "알 수 없음", profileImage: null },
}) => {
  const navigate = useNavigate();
  // 프로필 클릭 핸들러
  const handleProfileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/profile/${author.userId}`);
  };
  return (
    <Link to={`/places/${id}`} className={$.miniPostBox}>
      {/* 1. 프로필 (사진 + 이름) */}
      <div className={$.miniProfile} onClick={handleProfileClick}>
        <img
          src={author.profileImage || defaultProfileImg}
          alt={`${author.username} profile`}
          className={$.profileImage}
        />
        <span className={$.username}>{author.username}</span>

        {/* 2. 타이틀 */}
      </div>
      <h3 className={$.postTitle}>{title}</h3>
    </Link>
  );
};

export default MiniPostBox;
