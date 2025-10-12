import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import styles from "./MapPage.module.css";
import widgetAudio from "../../assets/MapPage/widget_audio.png";
import widgetHistory from "../../assets/MapPage/widget_history.png";
import widgetLang from "../../assets/MapPage/widget_lang.png";
import widgetText from "../../assets/MapPage/widget_text.png";
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

  const widgets = [
    { id: "lang", icon: widgetLang, alt: "언어" },
    { id: "audio", icon: widgetAudio, alt: "오디오" },
    { id: "text", icon: widgetText, alt: "텍스트" },
    { id: "history", icon: widgetHistory, alt: "역사뷰" },
  ];

  const languageButtons = [
    { id: "kor", icon: langKor, alt: "한국어" },
    { id: "eng", icon: langEng, alt: "영어" },
    { id: "chn", icon: langChn, alt: "중국어" },
    { id: "jpn", icon: langJpn, alt: "일본어" },
  ];

  const handleWidgetClick = (widgetId) => {
    if (activeWidget === widgetId) {
      setActiveWidget(null);
    } else {
      setActiveWidget(widgetId);
    }
  };

  const handleOverlayClick = () => {
    setActiveWidget(null);
  };

  const handleLanguageClick = (langId) => {
    alert("언어 변경 기능은 추후 구현될 예정입니다. 양해해 주셔서 감사합니다.");
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.search}>
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
        
        <div className={styles.widgetMenu}>
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

        {/* 오버레이 */}
        {activeWidget && (
          <div className={styles.overlay} onClick={handleOverlayClick}></div>
        )}

        {/* 언어 선택 메뉴 */}
        {activeWidget === "lang" && (
          <div className={styles.languageMenu}>
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

        <div ref={mapRef} className={styles.map}></div>
      </div>
    </>
  );
};

export default MapPage;
