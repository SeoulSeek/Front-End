import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RxDragHandleVertical } from "react-icons/rx";
import { BiExit } from "react-icons/bi";

import $ from "./MapHistoryView.module.css";
import PeriodSelector from "../../components/PeriodSelector/PeriodSelector";
import Loading from "../../components/Loading/Loading";
import { API_ENDPOINTS } from "../../config/api";
import joseon from "./../../assets/MapHistoryView/joseon.jpg";
import empire from "./../../assets/MapHistoryView/empire.jpg";
import japan from "./../../assets/MapHistoryView/japan.jpg";
import present from "./../../assets/MapHistoryView/korea.jpg";

const eras = [
  { name: "삼국시대", year: "4세기-676", eraKey: "THREE_KINGDOMS" },
  { name: "고려시대", year: "918-1392", eraKey: "GORYEO" },
  { name: "조선시대", year: "1392-1897", eraKey: "JOSEON" },
  { name: "대한제국", year: "1897-1910", eraKey: "KOREAN_EMPIRE" },
  { name: "일제강점기", year: "1910-1945", eraKey: "JAPANESE_OCCUPATION" },
  { name: "대한민국", year: "1945-현재", eraKey: "REPUBLIC_OF_KOREA" },
];

const MapHistoryView = () => {
  const containerRef = useRef(null);
  const roadviewRef = useRef(null);
  const [sliderX, setSliderX] = useState(90);
  const [selectedPeriod, setSelectedPeriod] = useState(2); // 초기 선택된 시대 인덱스
  const location = useLocation();
  const navigate = useNavigate();

  const [initialPosition, setInitialPosition] = useState(null);
  const [isLoadingPosition, setIsLoadingPosition] = useState(true);
  const [positionError, setPositionError] = useState(null);
  const locationId = location.state?.locationId;

  const [eraImageData, setEraImageData] = useState(null); // 현재 선택된 시대의 이미지 데이터
  const [isLoadingEraImage, setIsLoadingEraImage] = useState(false);
  const [eraImageError, setEraImageError] = useState(null);
  const [availableEraKey, setAvailableEraKey] = useState(null); // 사용가능 시대 키

  // 초기 위치 결정
  useEffect(() => {
    setIsLoadingPosition(true);
    setPositionError(null);

    // MapPage에서 state로 전달받은 위치 정보 확인
    if (location.state?.lat && location.state?.lng) {
      console.log("state에서 받은 위치:", location.state);
      setInitialPosition({
        lat: location.state.lat,
        lng: location.state.lng,
        name: location.state.name || "선택된 위치",
      });
      setIsLoadingPosition(false);
    } else {
      // 전달받은 state가 없으면 Geolocation 시도
      console.log("state없음..geolocation 시도");
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Geolocation success:", position.coords);
            setInitialPosition({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              name: "현재 위치 근처",
            });
            setIsLoadingPosition(false);
          },
          (error) => {
            console.error("Geolocation failed:", error);
            setPositionError(
              "현재 위치를 가져올 수 없습니다. 기본 위치를 표시합니다."
            );
            // 실패 시 기본 위치 (서울 시청)
            setInitialPosition({
              lat: 37.5665,
              lng: 126.978,
              name: "서울 시청 근처",
            });
            setIsLoadingPosition(false);
          }
        );
      } else {
        console.error("Geolocation not supported.");
        setPositionError(
          "Geolocation을 지원하지 않습니다. 기본 위치를 표시합니다."
        );
        // Geolocation 미지원 시 기본 위치
        setInitialPosition({
          lat: 37.5665,
          lng: 126.978,
          name: "서울 시청 근처",
        });
        setIsLoadingPosition(false);
      }
    }
  }, [location.state]); // location.state가 변경될 때마다 재실행

  // 로드뷰
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps || !initialPosition) {
      return;
    }

    const roadviewContainer = roadviewRef.current;
    if (!roadviewContainer) return;

    try {
      let roadview = new window.kakao.maps.Roadview(roadviewContainer);
      let roadviewClient = new window.kakao.maps.RoadviewClient();

      const position = new window.kakao.maps.LatLng(
        initialPosition.lat,
        initialPosition.lng
      );

      console.log("로드뷰 위치 설정 시도:", position);

      // 가장 가까운 파노라마 ID 검색 후 로드뷰 위치 설정
      roadviewClient.getNearestPanoId(position, 100, (panoId) => {
        // 검색 반경 100m
        if (panoId === null) {
          console.warn("로드뷰 정보 없음:", initialPosition);
          // 로드뷰 컨테이너에 에러 메시지 표시
          roadviewContainer.innerHTML = `<div class="${$.roadviewError}">선택된 위치 근처에 로드뷰 정보가 없습니다.</div>`;
        } else {
          console.log("가까운 Pano ID 찾음:", panoId);
          roadview.setPanoId(panoId, position); // 찾은 panoId로 로드뷰 설정
        }
      });
    } catch (error) {
      console.error("로드뷰 생성 중 에러:", error);
      // 로드뷰 컨테이너에 에러 메시지 표시
      if (roadviewRef.current) {
        roadviewRef.current.innerHTML = `<div class="${$.roadviewError}">로드뷰를 표시하는 중 오류가 발생했습니다.</div>`;
      }
    }
  }, [initialPosition]);

  // 시대별 이미지 api
  useEffect(() => {
    // 장소 ID가 없으면 호출 안 함
    if (!locationId) {
      setEraImageError("장소 ID가 없습니다.");
      setIsLoadingEraImage(false);
      return;
    }

    const fetchAvailableEraImage = async () => {
      setIsLoadingEraImage(true);
      setEraImageError(null);
      setEraImageData(null);
      setAvailableEraKey(null); // 초기화
      setSelectedPeriod(null); // 초기화
      console.log(`Fetching available image for location ${locationId}`);

      try {
        // API 엔드포인트 호출 (era 파라미터 없이)
        const imageUrl = API_ENDPOINTS.LOCATION_VIEW(locationId);
        const response = await fetch(imageUrl);

        if (!response.ok) {
          if (response.status === 404) {
            console.log(`No image found for location: ${locationId}`);
            setEraImageError("해당 장소의 시대별 이미지가 없습니다.");
          } else {
            throw new Error(`이미지 정보 로딩 실패 (${response.status})`);
          }
        } else {
          const result = await response.json();
          const availableKey = result.data?.time;

          if (result.error === false && result.data?.imageUrl && availableKey) {
            setEraImageData(result.data); // 이미지 데이터 저장
            setAvailableEraKey(availableKey); // 사용 가능한 시대 키 저장

            // 사용 가능한 시대 키에 해당하는 인덱스 찾기
            const availableIndex = eras.findIndex(
              (era) => era.eraKey === availableKey
            );
            if (availableIndex !== -1) {
              setSelectedPeriod(availableIndex); // 해당 시대를 자동으로 선택
              console.log(
                `Available era found: ${availableKey}, index: ${availableIndex}`
              );
            } else {
              console.warn(
                `Available eraKey '${availableKey}' not found in local eras array.`
              );
              setEraImageError("이미지는 있으나 시대를 알 수 없습니다."); // 매핑 실패 시
            }
          } else {
            setEraImageError("해당 장소의 시대별 이미지가 없습니다.");
          }
        }
      } catch (error) {
        console.error("시대별 이미지 로딩 에러:", error);
        setEraImageError(error.message);
      } finally {
        setIsLoadingEraImage(false);
      }
    };

    fetchAvailableEraImage();
  }, [locationId]); // 장소 ID가 변경되면 API 호출
  // --- 시대별 이미지 로딩 완료 ---

  // 스플릿바 컨트롤러러
  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleTouchStart = () => {
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
  };
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const newWidth = (e.clientX / containerWidth) * 100;
    if (newWidth >= 10 && newWidth <= 90) {
      setSliderX(newWidth);
    }
  };
  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const touch = e.touches[0];
    const newWidth = (touch.clientX / containerWidth) * 100;
    if (newWidth > 10 && newWidth < 90) {
      setSliderX(newWidth);
    }
  };
  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
  const handleTouchEnd = () => {
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
  };

  // 시대 선택 핸들러
  const handlePeriodSelect = useCallback((index) => {
    setSelectedPeriod(index);
  }, []);

  // 툴팁
  const [tutorialVisible, setTutorialVisible] = useState({
    era: true, // 시대 버튼 설명 말풍선
    splitter: true, // 스플릿바 설명 말풍선
    exit: true,
  });

  useEffect(() => {
    const timer1 = setTimeout(() => handleDismiss("era"), 5000);
    const timer2 = setTimeout(() => handleDismiss("splitter"), 5000);
    const timer3 = setTimeout(() => handleDismiss("exit"), 5000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleDismiss = (key) => {
    setTutorialVisible((prev) => ({ ...prev, [key]: false }));
  };

  const handleExit = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <>
      <div className={$.historyViewContainer}>
        <div className={$.exitButtonWrapper}>
          <button className={$.exitButton} onClick={handleExit}>
            <BiExit size={40} />
          </button>
          {tutorialVisible.exit && (
            <div
              className={$.tutorialBubbleExit}
              onClick={() => handleDismiss("exit")}
            >
              이 버튼을 눌러
              <br />
              역사뷰를 종료할 수 있어요.
              <div className={`${$.bubbleArrow} ${$.arrowRight}`}></div>
            </div>
          )}
        </div>

        <div className={$.container} ref={containerRef}>
          <div className={$.left} style={{ width: `${sliderX}%` }}>
            <div className={$.periodSelectorWrapper}>
              <PeriodSelector
                eras={eras}
                selectedEraIndex={selectedPeriod}
                onSelect={handlePeriodSelect}
                availableEraKey={availableEraKey}
              />
              {tutorialVisible.era && (
                <div
                  className={$.tutorialBubbleLeft}
                  onClick={() => handleDismiss("era")}
                >
                  시대별 이미지를 선택해서
                  <br />
                  현재와 비교해볼 수 있어요.
                  <div className={`${$.bubbleArrow} ${$.arrowLeft}`}></div>
                </div>
              )}
            </div>

            <div ref={roadviewRef} className={$.roadview}>
              {isLoadingPosition && (
                <div className={$.roadviewLoading}>위치 정보 로딩 중...</div>
              )}
              {positionError && (
                <div className={$.roadviewError}>{positionError}</div>
              )}
            </div>
          </div>

          <div className={$.splitterWrapper}>
            <div
              className={$.splitter}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              {tutorialVisible.splitter && (
                <div
                  className={$.tutorialBubbleRight}
                  onClick={() => handleDismiss("splitter")}
                >
                  역사뷰 화면을 좌우로 넘겨보세요!
                  <div className={`${$.bubbleArrow} ${$.arrowRight}`}></div>
                </div>
              )}
              <RxDragHandleVertical size={30} />
            </div>
          </div>

          <div className={$.right} style={{ width: `${100 - sliderX}%` }}>
            <div className={$.photoArea}>
              {isLoadingEraImage ? (
                <Loading />
              ) : eraImageError ? (
                <p className={$.noPhotoMessage}>{eraImageError}</p>
              ) : eraImageData?.imageUrl &&
                eras[selectedPeriod]?.eraKey === availableEraKey ? (
                // 현재 선택된 시대가 사용 가능한 시대와 일치하고 이미지 URL이 있을 때만 표시
                <img
                  src={eraImageData.imageUrl}
                  alt={eras[selectedPeriod]?.name}
                  className={$.photo}
                />
              ) : (
                // 로딩/에러도 아니고, 선택된 시대가 사용 가능하지 않거나 이미지 URL 없을 때
                <p className={$.noPhotoMessage}>
                  해당 시대의 이미지가 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapHistoryView;
