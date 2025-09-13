import React, { useEffect, useRef, useState } from "react";
import { RxDragHandleVertical } from "react-icons/rx";

import $ from "./MapHistoryView.module.css";
import PeriodSelector from "../../components/PeriodSelector/PeriodSelector";
import joseon from "./../../assets/MapHistoryView/joseon.jpg";
import empire from "./../../assets/MapHistoryView/empire.jpg";
import japan from "./../../assets/MapHistoryView/japan.jpg";
import present from "./../../assets/MapHistoryView/korea.jpg";

const eras = [
  { name: "삼국시대", year: "4세기-676", image: null },
  { name: "고려시대", year: "918-1392", image: null },
  { name: "조선시대", year: "1392-1897", image: joseon },
  { name: "대한제국", year: "1897-1910", image: empire },
  { name: "일제강점기", year: "1910-1945", image: japan },
  { name: "대한민국", year: "1945-현재", image: present },
];

const MapHistoryView = () => {
  const containerRef = useRef(null);
  const roadviewRef = useRef(null);
  const [sliderX, setSliderX] = useState(90);
  const [selectedPeriod, setSelectedPeriod] = useState(2); // 초기 선택된 시대 인덱스

  // 로드뷰
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const roadviewContainer = roadviewRef.current;
      const roadview = new window.kakao.maps.Roadview(roadviewContainer);

      const roadviewClient = new window.kakao.maps.RoadviewClient();
      const position = new window.kakao.maps.LatLng(37.578, 126.977); // 원하는 좌표

      roadviewClient.getNearestPanoId(position, 50, (panoId) => {
        roadview.setPanoId(panoId, position);
      });
    }
  }, []);

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
  const handlePeriodSelect = (index) => {
    setSelectedPeriod(index);
  };
  const selectedEra = selectedPeriod !== null ? eras[selectedPeriod] : null;

  // 툴팁
  const [tutorialVisible, setTutorialVisible] = useState({
    era: true, // 시대 버튼 설명 말풍선
    splitter: true, // 스플릿바 설명 말풍선
  });

  /*
  useEffect(() => {
    const timer1 = setTimeout(() => handleDismiss("era"), 5000);
    const timer2 = setTimeout(() => handleDismiss("splitter"), 5000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);*/

  const handleDismiss = (key) => {
    setTutorialVisible((prev) => ({ ...prev, [key]: false }));
  };

  return (
    <>
      <div className={$.container} ref={containerRef}>
        <div className={$.left} style={{ width: `${sliderX}%` }}>
          <PeriodSelector
            eras={eras}
            selectedEraIndex={selectedPeriod}
            onSelect={handlePeriodSelect}
          />
          <div ref={roadviewRef} className={$.roadview}></div>
          {tutorialVisible.era && (
            <div
              className={$.tutorialBubbleLeft}
              onClick={() => handleDismiss("era")}
            >
              시대별 이미지를 선택해서
              <br />
              현재와 비교해볼 수 있어요.
            </div>
          )}
        </div>
        <div
          className={$.splitter}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {tutorialVisible.splitter && (
            <>
              <div
                className={$.tutorialBubbleRight}
                onClick={() => handleDismiss("splitter")}
              >
                역사뷰 화면을 좌우로 넘겨보세요!
              </div>
            </>
          )}
          <RxDragHandleVertical size={30} />
        </div>
        <div className={$.right} style={{ width: `${100 - sliderX}%` }}>
          <div className={$.photoArea}>
            {selectedEra && selectedEra.image ? (
              <img
                src={selectedEra.image}
                alt={selectedEra.name}
                className={$.photo}
              />
            ) : (
              <p>해당 시대의 사진이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MapHistoryView;
