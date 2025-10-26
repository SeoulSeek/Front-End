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
import { mapLanguageToUI } from "../../hooks/auth";

const LANGUAGES = ["한국어", "English", "中國語", "日本語"];

// API 언어 코드를 UI 언어로 매핑하는 함수
const mapApiLanguagesToUI = (apiLanguages) => {
  if (!Array.isArray(apiLanguages)) return [];
  return apiLanguages.map(lang => mapLanguageToUI(lang));
};

// UI 언어를 API 언어 코드로 매핑하는 함수
const mapUILanguagesToAPI = (uiLanguages) => {
  const reverseMap = {
    '한국어': 'Korean',
    'English': 'English',
    '日本語': 'Japanese',
    '中國語': 'Chinese'
  };
  return uiLanguages.map(lang => reverseMap[lang] || lang);
};

const MyPage = () => {
  const { user, isLoading, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("places");
  const [isPublic, setIsPublic] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [tempName, setTempName] = useState(name);

  const [savedProfile, setSavedProfile] = useState(user?.file || defaultProfile);
  const [tempProfile, setTempProfile] = useState(savedProfile);
  const [tempProfileFile, setTempProfileFile] = useState(null); // 새로 선택된 파일 객체
  const fileInputRef = useRef(null);

  const [selectedLangs, setSelectedLangs] = useState([]);

  // 사용자 정보가 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setTempName(user.name || "");
      
      // user.file이 유효한 URL인지 확인
      const profileImage = (user.file && (
        user.file.startsWith('http') || 
        user.file.startsWith('/') ||
        user.file.startsWith('blob:')
      )) ? user.file : defaultProfile;
      
      setSavedProfile(profileImage);
      setTempProfile(profileImage);
      
      // API에서 받은 영어 언어 코드를 UI 언어로 변환
      const uiLanguages = mapApiLanguagesToUI(user.language || []);
      setSelectedLangs(uiLanguages);
    }
  }, [user]);

  const handleEditClick = async () => {
    if (isEditing) {
      try {
        console.log('=== MyPage handleEditClick 시작 ===');
        console.log('현재 사용자:', user);
        console.log('선택된 언어(UI):', selectedLangs);
        
        // API에 전송할 데이터 준비
        const apiLanguages = mapUILanguagesToAPI(selectedLangs);
        console.log('변환된 언어(API):', apiLanguages);
        
        const profileData = {
          name: tempName.trim() || name,
          file: tempProfileFile || savedProfile, // 새 파일 객체 또는 기존 URL
          languages: apiLanguages
        };
        
        console.log('전송할 profileData:', {
          name: profileData.name,
          file: profileData.file instanceof File ? `[File] ${profileData.file.name}` : profileData.file,
          languages: profileData.languages
        });

        // API 호출
        const result = await updateProfile(profileData);
        
        if (result.success) {
          // 성공 시 로컬 상태 업데이트
          setName(tempName.trim() || name);
          setSavedProfile(tempProfile);
          setTempProfileFile(null); // 파일 객체 초기화
          setIsEditing(false);
          alert('프로필이 성공적으로 업데이트되었습니다.');
        } else {
          alert(result.message || '프로필 업데이트에 실패했습니다.');
        }
      } catch (error) {
        console.error('프로필 업데이트 중 오류:', error);
        alert('프로필 업데이트 중 오류가 발생했습니다.');
      }
    } else {
      setTempName(name);
      setTempProfile(savedProfile);
      setTempProfileFile(null);
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
      // 미리보기용 URL 생성
      const previewUrl = URL.createObjectURL(file);
      setTempProfile(previewUrl);
      // 실제 파일 객체 저장
      setTempProfileFile(file);
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
              onError={(e) => { e.target.src = defaultProfile; }}
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
              onError={(e) => { e.target.src = defaultProfile; }}
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
            onError={(e) => { e.target.src = defaultProfile; }}
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
                <span className={styles.blue}>{name || "사용자"}</span>님의 역사 탐험록
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
              북마크 개수 {user?.bookmark || 0}
            </span>
            <span className={styles.stats}>
              좋아요 개수 {user?.like || 0}
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
