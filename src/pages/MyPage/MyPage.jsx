import React, { useState } from "react";
import styles from "./MyPage.module.css";
import defaultProfile from "../../assets/MyPage/defaultProfile.png";
import MyEditBtn from "../../components/MyEditBtn/MyEditBtn";
import MyPublicBtn from "../../components/MyPublicBtn/MyPublicBtn";
import {
  AiFillCheckSquare,
  AiOutlineCheckSquare,
} from "react-icons/ai";

const LANGUAGES = ["한국어", "English", "中國語", "日本語"];

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("places");
  const [isPublic, setIsPublic] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("서우리");
  const [tempName, setTempName] = useState(name);

  const [selectedLangs, setSelectedLangs] = useState([
    "한국어",
    "English",
    "中國語",
  ]);

  const handleEditClick = () => {
    if (isEditing) {
      setName(tempName.trim() || name);
      setIsEditing(false);
    } else {
      setTempName(name);
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

  return (
    <div className={styles.myContainer}>
      {/* 상단 정보 */}
      <div className={styles.myInfoContainer}>
        <img
          src={defaultProfile}
          className={styles.profilePic}
          alt="프로필 이미지"
        />
        <div className={styles.myInfo}>
          {/* 닉네임/타이틀 */}
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

          {/* 언어 */}
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

          {/* 통계 */}
          <div className={styles.myStats}>
            <span className={styles.stats}>
              작성한 방명록 수 100
            </span>
            <span className={styles.stats}>
              누적 좋아요 수 50
            </span>
          </div>
        </div>
      </div>

      {/* 탭, 버튼들입니다 */}
      <div className={styles.myMenuContainer}>
        <div className={styles.tabMenu}>
          <span
            className={styles.tab}
            onClick={() => setActiveTab("places")}
            style={{
              color:
                activeTab === "places" ? "#000000" : "#D3D9DF",
              cursor: "pointer",
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
              cursor: "pointer",
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
    </div>
  );
};

export default MyPage;
