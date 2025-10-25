import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import styles from "./MapPage.module.css";
import PlaceCard from "../../components/PlaceCard/PlaceCard";
import BottomSheet from "../../components/BottomSheet/BottomSheet";
import widgetAudio from "../../assets/MapPage/widget_audio.png";
import widgetHistory from "../../assets/MapPage/widget_history.png";
import widgetLang from "../../assets/MapPage/widget_lang.png";
import widgetText from "../../assets/MapPage/widget_text.png";
import widgetPlaces from "../../assets/MapPage/widget_places.png";
import langKor from "../../assets/MapPage/lang_kor.png";
import langEng from "../../assets/MapPage/lang_eng.png";
import langChn from "../../assets/MapPage/lang_chn.png";
import langJpn from "../../assets/MapPage/lang_jpn.png";
import sampleImage from "../../assets/LoginPage/sample1.jpg";
import pinIcon from "../../assets/MapPage/pin.svg";
import pinSelectIcon from "../../assets/MapPage/pinSelect.svg";
import { API_ENDPOINTS } from "../../config/api";

// Era 매핑 객체
const ERA_MAP = {
  TEMP: "temp",
  PREHISTORIC: "선사시대",
  THREE_KINGDOMS: "삼국시대",
  GORYEO: "고려시대",
  JOSEON: "조선시대",
  KOREAN_EMPIRE: "대한제국",
  JAPANESE_OCCUPATION: "일제강점기",
  REPUBLIC_OF_KOREA: "대한민국",
};

const MapPage = () => {
  const navigate = useNavigate();
  const { locationId } = useParams();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const currentLocationMarker = useRef(null);
  const locationMarkers = useRef([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [activeWidget, setActiveWidget] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [showAudioSummary, setShowAudioSummary] = useState(false);
  const [showTextPopup, setShowTextPopup] = useState(false);
  const [showPlacesPopup, setShowPlacesPopup] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [relatedPlaces, setRelatedPlaces] = useState([]);
  const [locationText, setLocationText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [bottomSheetState, setBottomSheetState] = useState("peek");
  
  // 검색 결과 더미 데이터
  const searchResults = [
    {
      id: 1,
      placeName: "경복궁",
      distance: "1.2km",
      imageUrl: sampleImage,
    },
    {
      id: 2,
      placeName: "창덕궁",
      distance: "2.5km",
      imageUrl: sampleImage,
    },
    {
      id: 3,
      placeName: "북촌 한옥마을",
      distance: "1.8km",
      imageUrl: sampleImage,
    },
    {
      id: 4,
      placeName: "인사동",
      distance: "1.5km",
      imageUrl: sampleImage,
    },
    {
      id: 5,
      placeName: "종묘",
      distance: "2.0km",
      imageUrl: sampleImage,
    },
  ];

  // 장소 상세 정보 조회 및 바텀시트 표시
  const handleLocationMarkerClick = useCallback(async (locationId, shouldMoveMap = false, sheetState = "half") => {
    try {
      // 선택된 장소 ID 업데이트
      setSelectedLocationId(locationId);
      
      const accessToken = localStorage.getItem("accessToken");
      
      // 장소 상세 정보, 연관 장소, 텍스트 설명을 병렬로 가져오기
      const [detailResponse, relatedResponse, textResponse] = await Promise.all([
        fetch(API_ENDPOINTS.LOCATION_DETAIL(locationId), {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        }),
        fetch(API_ENDPOINTS.LOCATION_RELATED_PLACES(locationId), {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        }),
        fetch(API_ENDPOINTS.LOCATION_TEXT(locationId), {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        })
      ]);

      if (detailResponse.ok) {
        const result = await detailResponse.json();
        if (result.data) {
          const locationData = result.data;
          // era 값을 한글로 변환
          const eraText = locationData.era ? (ERA_MAP[locationData.era] || locationData.era) : "정보 없음";
          
          // 바텀 시트에 표시할 형식으로 변환
          setSelectedPlace({
            name: locationData.name,
            address: locationData.address,
            period: eraText,
            hours: locationData.time || "정보 없음",
            phone: "",
            imageUrl: locationData.imageUrl || sampleImage,
            url: locationData.url,
          });
          
          // 지도 이동이 필요한 경우
          if (shouldMoveMap && mapInstance.current) {
            const moveLatLng = new window.kakao.maps.LatLng(
              locationData.latitude,
              locationData.longitude
            );
            mapInstance.current.setCenter(moveLatLng);
          }
          
          setIsBottomSheetOpen(true);
          setBottomSheetState(sheetState);
          setIsSearchMode(false);
        }
      } else {
        console.error("장소 상세 정보 응답 실패:", detailResponse.status);
      }
      
      // 연관 장소 처리
      if (relatedResponse.ok) {
        const relatedResult = await relatedResponse.json();
        if (relatedResult.data) {
          setRelatedPlaces(relatedResult.data);
        }
      } else {
        console.error("연관 장소 응답 실패:", relatedResponse.status);
        setRelatedPlaces([]);
      }
      
      // 텍스트 설명 처리
      if (textResponse.ok) {
        const textResult = await textResponse.json();
        if (textResult.data && textResult.data.content) {
          setLocationText(textResult.data.content);
        } else {
          setLocationText("");
        }
      } else {
        console.error("텍스트 설명 응답 실패:", textResponse.status);
        setLocationText("");
      }
    } catch (error) {
      console.error("장소 정보를 가져오는데 실패했습니다:", error);
    }
  }, []);

  // 장소 목록 가져오기
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        
        const response = await fetch(API_ENDPOINTS.LOCATION, {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        });
        
        if (response.ok) {
          try {
            const result = await response.json();
            if (result.data) {
              setLocations(result.data);
            }
          } catch (parseError) {
            console.error("JSON 파싱 실패:", parseError);
          }
        } else {
          console.error("장소 목록 API 응답 실패:", response.status);
        }
      } catch (error) {
        console.error("장소 목록을 가져오는데 실패했습니다:", error);
      }
    };

    fetchLocations();
  }, []);

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

    // 현재 위치 마커 생성 (카카오 기본 마커 사용)
    const markerPosition = new window.kakao.maps.LatLng(
      userLocation.lat,
      userLocation.lng
    );
    
    currentLocationMarker.current = new window.kakao.maps.Marker({
      position: markerPosition,
      map: mapInstance.current,
    });

    // 마커에 인포윈도우 추가
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

  // URL 파라미터로 전달된 장소 자동 로드
  useEffect(() => {
    if (locationId && mapInstance.current && locations.length > 0) {
      const numericLocationId = parseInt(locationId, 10);
      handleLocationMarkerClick(numericLocationId, true, "full");
    }
  }, [locationId, mapInstance.current, locations, handleLocationMarkerClick]);

  // 장소 마커 표시
  useEffect(() => {
    if (!mapInstance.current) {
      return;
    }
    
    if (locations.length === 0) {
      return;
    }

    // 기존 마커 제거
    locationMarkers.current.forEach((marker) => marker.setMap(null));
    locationMarkers.current = [];

    // SVG 핀 마커 이미지 생성 (일반)
    const imageSize = new window.kakao.maps.Size(32, 32);
    const imageOption = { offset: new window.kakao.maps.Point(16, 32) };
    const pinMarkerImage = new window.kakao.maps.MarkerImage(
      pinIcon,
      imageSize,
      imageOption
    );

    // SVG 핀 마커 이미지 생성 (선택됨)
    const pinSelectMarkerImage = new window.kakao.maps.MarkerImage(
      pinSelectIcon,
      imageSize,
      imageOption
    );

    // 장소 마커 생성
    locations.forEach((location) => {
      const position = new window.kakao.maps.LatLng(
        location.latitude,
        location.longitude
      );

      // 선택된 장소인지 확인하여 다른 이미지 사용
      const isSelected = location.tid === selectedLocationId;
      const markerImage = isSelected ? pinSelectMarkerImage : pinMarkerImage;

      const marker = new window.kakao.maps.Marker({
        position: position,
        map: mapInstance.current,
        image: markerImage,
        title: location.name,
      });

      // 마커 클릭 이벤트 추가
      window.kakao.maps.event.addListener(marker, "click", () => {
        handleLocationMarkerClick(location.tid);
      });

      locationMarkers.current.push(marker);
    });
  }, [locations, selectedLocationId, handleLocationMarkerClick]);

  // 두 팝업이 모두 닫혔을 때 오디오 위젯 비활성화
  useEffect(() => {
    if (!showAudioPlayer && !showAudioSummary && activeWidget === "audio") {
      setActiveWidget(null);
    }
  }, [showAudioPlayer, showAudioSummary, activeWidget]);

  // 텍스트 팝업이 닫혔을 때 텍스트 위젯 비활성화
  useEffect(() => {
    if (!showTextPopup && activeWidget === "text") {
      setActiveWidget(null);
    }
  }, [showTextPopup, activeWidget]);

  // 연관 장소 팝업이 닫혔을 때 연관 장소 위젯 비활성화
  useEffect(() => {
    if (!showPlacesPopup && activeWidget === "places") {
      setActiveWidget(null);
    }
  }, [showPlacesPopup, activeWidget]);

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

  // 연관 장소 클릭 핸들러
  const handleRelatedPlaceClick = (placeId) => {
    setShowPlacesPopup(false);
    handleLocationMarkerClick(placeId, true);
  };

  const handleWidgetClick = (widgetId) => {
    if (widgetId === "audio") {
      // 오디오 위젯은 두 팝업 모두 표시
      if (!showAudioPlayer && !showAudioSummary) {
        setShowAudioPlayer(true);
        setShowAudioSummary(true);
        setIsAudioPlaying(true);
        setActiveWidget("audio");
      }
    } else if (widgetId === "text") {
      // 텍스트 위젯은 팝업 표시
      if (!showTextPopup) {
        setShowTextPopup(true);
        setActiveWidget("text");
      }
    } else if (widgetId === "places") {
      // 연관 장소 위젯은 팝업 표시
      if (!showPlacesPopup) {
        setShowPlacesPopup(true);
        setActiveWidget("places");
      }
    } else if (widgetId === "history") {
      // 역사뷰 위젯은 /view로 이동
      navigate("/view");
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
      // 텍스트 팝업도 닫기
      if (activeWidget === "text") {
        setShowTextPopup(false);
      }
      // 연관 장소 팝업도 닫기
      if (activeWidget === "places") {
        setShowPlacesPopup(false);
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

  const handleTextPopupClose = () => {
    setShowTextPopup(false);
  };

  const handlePlacesPopupClose = () => {
    setShowPlacesPopup(false);
  };

  const handleBottomSheetClose = () => {
    // 바텀 시트를 닫지 않고 peek 상태로 유지
    // setIsBottomSheetOpen(false);
    // setSelectedPlace(null);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const inputValue = e.target.elements[0].value.trim();
    
    if (inputValue) {
      setSearchQuery(inputValue);
      setIsSearchMode(true);
      setBottomSheetState("full");
    }
  };

  return (
    <>
      <div className={styles.container} onClick={handleContainerClick}>
        <div className={styles.search} onClick={(e) => e.stopPropagation()}>
          <form className={styles.searchWrap} onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="장소를 검색해보세요"
              className={styles.searchInput}
            />
            <button
              type="submit"
              style={{
                position: "absolute",
                right: "10px",
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
              <AiOutlineSearch size={28} style={{ color: "#000" }} />
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
            </div>
          </div>
        )}

        {/* 텍스트 설명 팝업 */}
        {showTextPopup && (
          <div
            className={styles.textPopup}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.textCloseButton}
              onClick={handleTextPopupClose}
            >
              <AiOutlineClose size={20} />
            </button>

            <h3 className={styles.textTitle}>텍스트 설명</h3>

            <div className={styles.textContent}>
              {locationText ? (
                locationText
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666', fontSize: '15px', fontWeight: 700 }}>
                  텍스트 설명이 없습니다.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 연관 장소 목록 팝업 */}
        {showPlacesPopup && (
          <div
            className={styles.placesPopup}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.placesCloseButton}
              onClick={handlePlacesPopupClose}
            >
              <AiOutlineClose size={20} />
            </button>

            <h3 className={styles.placesTitle}>연관 장소 목록</h3>

            <div className={styles.placesContent}>
              {relatedPlaces.length > 0 ? (
                relatedPlaces.map((place) => (
                  <div 
                    key={place.tid} 
                    onClick={() => handleRelatedPlaceClick(place.tid)}
                    style={{ cursor: 'pointer' }}
                  >
                    <PlaceCard
                      placeName={place.name}
                      distance=""
                      imageUrl={place.imageUrl}
                    />
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666', fontSize: '15px', fontWeight: 700 }}>
                  연관 장소가 없습니다.
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={mapRef} className={styles.map}></div>
      </div>

      {/* 바텀 시트 */}
      <BottomSheet
        placeData={selectedPlace}
        isOpen={isBottomSheetOpen}
        onClose={handleBottomSheetClose}
        isSearchMode={isSearchMode}
        searchQuery={searchQuery}
        searchResults={searchResults}
        bottomSheetState={bottomSheetState}
        setBottomSheetState={setBottomSheetState}
      />
    </>
  );
};

export default MapPage;
