// ./src/components/MiniProfile/MiniProfile.js
import React from "react";
import { Link, useNavigate } from "react-router";
import { RiVerifiedBadgeFill } from "react-icons/ri";

import $ from "./MiniProfile.module.css";
import defaultProfileImg from "../../assets/PlacePage/profile_a.jpg";
import managerProfileImg from "../../assets/PlacePage/Icon.png";

const MiniProfile = ({ username, profileImg = defaultProfileImg, userId }) => {
  const navigate = useNavigate();

  const handleProfileCheck = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (userId) {
      navigate(`/user/${userId}`);
    }
  };

  return (
    <div className={$.userInfo} onClick={handleProfileCheck}>
      {username === "서울식" ? (
        <img
          src={managerProfileImg}
          alt="사용자 프로필 이미지"
          className={$.userProfileImg}
        />
      ) : (
        <img
          src={profileImg}
          alt="사용자 프로필 이미지"
          className={$.userProfileImg}
        />
      )}
      {}
      <span className={$.username}>
        {username}{" "}
        {username === "서울식" ? <RiVerifiedBadgeFill size={14} /> : ""}
      </span>
    </div>
  );
};

export default MiniProfile;
