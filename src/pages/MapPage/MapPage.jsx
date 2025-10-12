import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import styles from "./MapPage.module.css";
import widgetAudio from "../../assets/MapPage/widget_audio.png";
import widgetHistory from "../../assets/MapPage/widget_history.png";
import widgetLang from "../../assets/MapPage/widget_lang.png";
import widgetText from "../../assets/MapPage/widget_text.png";
import widgetPlaces from "../../assets/MapPage/widget_places.png";
import langKor from "../../assets/MapPage/lang_kor.png";
import langEng from "../../assets/MapPage/lang_eng.png";
import langChn from "../../assets/MapPage/lang_chn.png";
import langJpn from "../../assets/MapPage/lang_jpn.png";

const MapPage = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const currentLocationMarker = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [activeWidget, setActiveWidget] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [showAudioSummary, setShowAudioSummary] = useState(false);

  // 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("위치 정보를 가져올 수 없습니다:", error);
          // 위치 정보를 가져올 수 없을 때 서울 시청 좌표 사용
          setUserLocation({ lat: 37.5665, lng: 126.978 });
        }
      );
    } else {
      // Geolocation을 지원하지 않을 때 서울 시청 좌표 사용
      setUserLocation({ lat: 37.5665, lng: 126.978 });
    }
  }, []);

  // 카카오맵 생성 및 현재 위치 마커 표시
  useEffect(() => {
    if (!mapRef.current || !userLocation || mapInstance.current) return;

    const options = {
      center: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      level: 3,
    };

    // 지도 생성
    mapInstance.current = new window.kakao.maps.Map(mapRef.current, options);

    // 현재 위치 마커 생성
    const markerPosition = new window.kakao.maps.LatLng(
      userLocation.lat,
      userLocation.lng
    );
    
    currentLocationMarker.current = new window.kakao.maps.Marker({
      position: markerPosition,
      map: mapInstance.current,
    });

    // 마커에 인포윈도우 추가 (선택사항)
    const infowindow = new window.kakao.maps.InfoWindow({
      content: '<div style="padding:5px;font-size:12px;">현재 위치</div>',
    });
    
    // 마커에 마우스 오버 이벤트 추가
    window.kakao.maps.event.addListener(
      currentLocationMarker.current,
      "mouseover",
      () => {
        infowindow.open(mapInstance.current, currentLocationMarker.current);
      }
    );
    
    window.kakao.maps.event.addListener(
      currentLocationMarker.current,
      "mouseout",
      () => {
        infowindow.close();
      }
    );
  }, [userLocation]);

  // 두 팝업이 모두 닫혔을 때 오디오 위젯 비활성화
  useEffect(() => {
    if (!showAudioPlayer && !showAudioSummary && activeWidget === "audio") {
      setActiveWidget(null);
    }
  }, [showAudioPlayer, showAudioSummary, activeWidget]);

  const widgets = [
    { id: "lang", icon: widgetLang, alt: "언어" },
    { id: "audio", icon: widgetAudio, alt: "오디오" },
    { id: "text", icon: widgetText, alt: "텍스트" },
    { id: "places", icon: widgetPlaces, alt: "연관 장소" },
    { id: "history", icon: widgetHistory, alt: "역사뷰" },
  ];

  const languageButtons = [
    { id: "kor", icon: langKor, alt: "한국어" },
    { id: "eng", icon: langEng, alt: "영어" },
    { id: "chn", icon: langChn, alt: "중국어" },
    { id: "jpn", icon: langJpn, alt: "일본어" },
  ];

  const handleWidgetClick = (widgetId) => {
    if (widgetId === "audio") {
      // 오디오 위젯은 두 팝업 모두 표시
      if (!showAudioPlayer && !showAudioSummary) {
        setShowAudioPlayer(true);
        setShowAudioSummary(true);
        setIsAudioPlaying(true);
        setActiveWidget("audio");
      }
    } else {
      if (activeWidget === widgetId) {
        setActiveWidget(null);
      } else {
        setActiveWidget(widgetId);
      }
    }
  };

  const handleOverlayClick = () => {
    setActiveWidget(null);
  };

  const handleContainerClick = () => {
    if (activeWidget) {
      // 위젯이 활성화되어 있으면 해제
      setActiveWidget(null);
      // 오디오 팝업들도 닫기
      if (activeWidget === "audio") {
        setShowAudioPlayer(false);
        setShowAudioSummary(false);
        setIsAudioPlaying(false);
      }
    }
  };

  const handleLanguageClick = (langId) => {
    alert("언어 변경 기능은 추후 구현될 예정입니다. 양해해 주셔서 감사합니다.");
  };

  const handleAudioPlayerClose = () => {
    setShowAudioPlayer(false);
    setIsAudioPlaying(false);
  };

  const handleAudioSummaryClose = () => {
    setShowAudioSummary(false);
  };

  const handleAudioWaveformClick = () => {
    setIsAudioPlaying(!isAudioPlaying);
  };

  return (
    <>
      <div className={styles.container} onClick={handleContainerClick}>
        <div className={styles.search} onClick={(e) => e.stopPropagation()}>
          <form className={styles.searchWrap}>
            <input
              type="text"
              placeholder="장소를 검색해보세요"
              className={styles.searchInput}
            />
            <button
              type="submit"
              style={{
                position: "absolute",
                right: "5px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AiOutlineSearch size={30} style={{ color: "#000" }} />
            </button>
          </form>
        </div>
        
        <div
          className={styles.widgetMenu}
          onClick={(e) => e.stopPropagation()}
        >
          {widgets.map((widget) => (
            <button
              key={widget.id}
              className={styles.widgetButton}
              onClick={() => handleWidgetClick(widget.id)}
              style={{
                opacity:
                  activeWidget && activeWidget !== widget.id ? 0.5 : 1,
                zIndex: activeWidget === widget.id ? 1002 : 1000,
              }}
            >
              <img
                src={widget.icon}
                alt={widget.alt}
                className={styles.widgetIcon}
              />
            </button>
          ))}
        </div>

        {/* 오버레이 (lang 위젯일 때만) */}
        {activeWidget === "lang" && (
          <div className={styles.overlay} onClick={handleOverlayClick}></div>
        )}

        {/* 언어 선택 메뉴 */}
        {activeWidget === "lang" && (
          <div
            className={styles.languageMenu}
            onClick={(e) => e.stopPropagation()}
          >
            {languageButtons.map((lang) => (
              <button
                key={lang.id}
                className={styles.languageButton}
                onClick={() => handleLanguageClick(lang.id)}
              >
                <img
                  src={lang.icon}
                  alt={lang.alt}
                  className={styles.languageIcon}
                />
              </button>
            ))}
          </div>
        )}

        {/* 오디오 재생중 표시 팝업 */}
        {showAudioPlayer && (
          <div
            className={styles.audioPopup}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.audioCloseButton}
              onClick={handleAudioPlayerClose}
            >
              <AiOutlineClose size={20} />
            </button>

            {/* 오디오 파형 애니메이션 */}
            <div
              className={styles.audioWaveform}
              onClick={handleAudioWaveformClick}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                <div
                  key={bar}
                  className={`${styles.waveBar} ${
                    isAudioPlaying ? styles.playing : ""
                  }`}
                  style={{ animationDelay: `${bar * 0.1}s` }}
                ></div>
              ))}
            </div>

            {/* 재생 상태 텍스트 */}
            <div className={styles.audioStatus}>
              {isAudioPlaying ? (
                <>
                  재생중
                  <span className={styles.dots}>
                    <span className={styles.dot}>.</span>
                    <span className={styles.dot}>.</span>
                    <span className={styles.dot}>.</span>
                  </span>
                </>
              ) : (
                "중단됨"
              )}
            </div>
          </div>
        )}

        {/* 오디오 요약 팝업 */}
        {showAudioSummary && (
          <div
            className={styles.audioSummaryPopup}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.audioSummaryCloseButton}
              onClick={handleAudioSummaryClose}
            >
              <AiOutlineClose size={20} />
            </button>

            <h3 className={styles.audioSummaryTitle}>오디오 요약</h3>

            <div className={styles.audioSummaryContent}>
              경복궁은 조선 시대의 법궁으로, 1395년 태조 이성계가 창건한
              서울의 대표적인 궁궐이다. 근정전, 경회루 등 아름다운 건축물이
              있으며, 한국 전통문화와 역사를 체험할 수 있는 관광 명소다.
              가나다라마바사
              가나다라마바사
              가나다라마바사
              가나다라마바사
            </div>
          </div>
        )}

        <div ref={mapRef} className={styles.map}></div>
      </div>
    </>
  );
};

export default MapPage;
