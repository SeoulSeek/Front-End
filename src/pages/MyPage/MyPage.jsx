import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyPage.module.css";
import defaultProfile from "../../assets/MyPage/defaultProfile.png";
import MyEditBtn from "../../components/MyEditBtn/MyEditBtn";
import MyPublicBtn from "../../components/MyPublicBtn/MyPublicBtn";
import {
  AiFillCheckSquare,
  AiOutlineCheckSquare,
} from "react-icons/ai";
import { useAuth } from "../../contexts/AuthContext";

const LANGUAGES = ["한국어", "English", "中國語", "日本語"];

const MyPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("places");
  const [isPublic, setIsPublic] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || "서우리");
  const [tempName, setTempName] = useState(name);

  const [savedProfile, setSavedProfile] = useState(user?.file || defaultProfile);
  const [tempProfile, setTempProfile] = useState(savedProfile);
  const fileInputRef = useRef(null);

  const [selectedLangs, setSelectedLangs] = useState(
    user?.language || ["한국어", "English", "中國語"]
  );

  // 사용자 정보가 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    if (user) {
      setName(user.name);
      setSavedProfile(user.file || defaultProfile);
      setSelectedLangs(user.language || ["한국어", "English", "中國語"]);
    }
  }, [user]);

  const handleEditClick = () => {
    if (isEditing) {
      setName(tempName.trim() || name);
      setSavedProfile(tempProfile);
      setIsEditing(false);
    } else {
      setTempName(name);
      setTempProfile(savedProfile);
      setIsEditing(true);
    }
  };

  const toggleLang = (lang) => {
    setSelectedLangs((prev) =>
      prev.includes(lang)
        ? prev.filter((l) => l !== lang)
        : [...prev, lang]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setTempProfile(previewUrl);
    }
  };

  const handleContainerClick = () => {
    if (!user) {
      navigate('/login');
    }
  };

  // 로그인하지 않은 경우
  if (!isLoading && !user) {
    return (
      <div 
        className={styles.myContainer}
        onClick={handleContainerClick}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.myInfoContainer}>
          <div className={styles.profileWrapper}>
            <img
              src={defaultProfile}
              className={styles.profilePic}
              alt="기본 프로필 이미지"
            />
          </div>
          <div className={styles.myInfo}>
            <div className={styles.myName}>
              <span>로그인해주세요.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 로딩 중인 경우
  if (isLoading) {
    return (
      <div className={styles.myContainer}>
        <div className={styles.myInfoContainer}>
          <div className={styles.profileWrapper}>
            <img
              src={defaultProfile}
              className={styles.profilePic}
              alt="기본 프로필 이미지"
            />
          </div>
          <div className={styles.myInfo}>
            <div className={styles.myName}>
              <span>로딩 중...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 로그인한 경우
  return (
    <div className={styles.myContainer}>
      <div className={styles.myInfoContainer}>
        <div className={styles.profileWrapper}>
          <img
            src={isEditing ? tempProfile : savedProfile}
            className={styles.profilePic}
            alt="프로필 이미지"
          />
          {isEditing && tempProfile === savedProfile && (
            <div
              className={styles.overlay}
              onClick={() => fileInputRef.current.click()}
            >
              업로드
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>
        <div className={styles.myInfo}>
          <div className={styles.myName}>
            {isEditing ? (
              <input
                type="text"
                className={styles.nameInput}
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="닉네임을 입력해 주세요"
              />
            ) : (
              <span>
                <span className={styles.blue}>{name}</span>님의 역사 탐험록
              </span>
            )}
          </div>

          {isEditing ? (
            <div className={styles.langSelector}>
              {LANGUAGES.map((lang) => (
                <div
                  key={lang}
                  className={styles.langItem}
                  onClick={() => toggleLang(lang)}
                >
                  {selectedLangs.includes(lang) ? (
                    <AiFillCheckSquare size={20} color="#000" />
                  ) : (
                    <AiOutlineCheckSquare size={20} color="#91C6FF" />
                  )}
                  <span
                    className={styles.langText}
                    style={{
                      color: selectedLangs.includes(lang)
                        ? "#000"
                        : "#91C6FF",
                    }}
                  >
                    {lang}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.myLang}>
              {selectedLangs.map((lang) => (
                <span key={lang} className={styles.lang}>
                  {lang}
                </span>
              ))}
            </div>
          )}

          <div className={styles.myStats}>
            <span className={styles.stats}>
              작성한 방명록 수 {user?.bookmark || 0}
            </span>
            <span className={styles.stats}>
              누적 좋아요 수 {user?.like || 0}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.myMenuContainer}>
        <div className={styles.tabMenu}>
          <span
            className={styles.tab}
            onClick={() => setActiveTab("places")}
            style={{
              color:
                activeTab === "places" ? "#000000" : "#D3D9DF",
            }}
          >
            나의 장소
          </span>
          <span
            className={styles.tab}
            onClick={() => setActiveTab("guestbook")}
            style={{
              color:
                activeTab === "guestbook"
                  ? "#000000"
                  : "#D3D9DF",
            }}
          >
            나의 방명록
          </span>
        </div>
        <div className={styles.btnMenu}>
          <MyPublicBtn
            isPublic={isPublic}
            onClick={() => setIsPublic((p) => !p)}
          />
          <MyEditBtn
            isEditing={isEditing}
            onClick={handleEditClick}
          />
        </div>
      </div>

      <div className={styles.listContainer}>
        {activeTab === "places" && (
          <div className={styles.placesList}>
            <span className={styles.emptyText}>
              지도에서 다양한 서울을 경험해 보세요!
            </span>
          </div>
        )}

        {activeTab === "guestbook" && (
          <div className={styles.logList}>
            <span className={styles.emptyText}>
              관광 기록을 방명록으로 남겨 보는 건 어떨까요?
            </span>
          </div>
        )}

        <span className={styles.listTitle}>스크랩한 관광코스</span>
        <div className={styles.scrapList}>
          <span className={styles.emptyText}>
            스크랩한 관광코스가 없습니다.
          </span>
        </div>

        <span className={styles.listTitle}>좋아요를 누른 방명록</span>
        <div className={styles.likeList}>
          <span className={styles.emptyText}>
            좋아요한 방명록이 없습니다.
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
