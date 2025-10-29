import React, { useEffect, useState, useRef } from "react";
import { API_ENDPOINTS } from "../../config/api";
import { DISTRICT_KOR_TO_ENG } from "../../config/mapping";
import TOP1_MARKERS from "../../assets/PlacePage/pinRanks_1.svg";
import TOP2_MARKERS from "../../assets/PlacePage/pinRanks_2.svg";
import TOP3_MARKERS from "../../assets/PlacePage/pinRanks_3.svg";
import TOP4_MARKERS from "../../assets/PlacePage/pinRanks_4.svg";
import TOP5_MARKERS from "../../assets/PlacePage/pinRanks_5.svg";

// Custom Overlay를 위한 스타일
const overlayStyle = `
  .district-label {
    padding: 3px 7px;
    font-size: 8px;
    font-weight: 700;
    color: #0000000b
    white-space: nowrap; 
    z-index: 1004;
  }
`;

// 디바운스 함수 (컴포넌트 외부에 선언)
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// svg 파일
const MARKERS_SVG_URLS = [
  TOP1_MARKERS,
  TOP2_MARKERS,
  TOP3_MARKERS,
  TOP4_MARKERS,
  TOP5_MARKERS,
];
const MARKER_WIDTH = 60;
const MARKER_HEIGHT = 60;

const KakaoMiniMap = () => {
  const [map, setMap] = useState(null);
  const [districtCounts, setDistrictCounts] = useState([]); // 지역별 리뷰 수 데이터
  const [topDistricts, setTopDistricts] = useState({}); // Top 5 지역 이름 배열
  const [polygons, setPolygons] = useState([]); // 폴리곤 객체들
  const [overlays, setOverlays] = useState([]); // 이름표 오버레이 객체들
  const [markers, setMarkers] = useState([]); // Top 5 마커 객체들
  const [markerImages, setMarkerImages] = useState([]);
  const [infoWindow, setInfoWindow] = useState(null);

  // 지도 초기화
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = overlayStyle;
    document.head.appendChild(styleTag);

    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById("mini-map");
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
          level: 10,
          draggable: false,
          scrollwheel: false,
        };
        const mapInstance = new window.kakao.maps.Map(mapContainer, mapOption);
        setMap(mapInstance);
      });
    }
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  // 지역별 리뷰 수 데이터 fetch 및 top5 계산
  useEffect(() => {
    const fetchDistrictCounts = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.MINI_MAP);
        if (!response.ok) throw new Error("미니맵 데이터 로딩 실패");
        const result = await response.json();
        if (result.error || !Array.isArray(result.data))
          throw new Error("잘못된 데이터 형식");

        const countsData = result.data;
        setDistrictCounts(countsData);

        const sortedDistricts = [...countsData].sort((a, b) => b.cnt - a.cnt);
        const top5 = {};
        sortedDistricts.slice(0, 5).forEach((item, index) => {
          if (item.territory) {
            top5[item.territory] = index + 1;
          }
        });
        setTopDistricts(top5);
        console.log("Top 5:", top5);
      } catch (error) {
        console.error("미니맵 데이터 처리중 에러 발생:", error);
      }
    };
    fetchDistrictCounts();
  }, []);

  // svg 불러오기
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const images = MARKERS_SVG_URLS.map((url) => {
        const markerSize = new window.kakao.maps.Size(
          MARKER_WIDTH,
          MARKER_HEIGHT
        );
        // 마커 이미지 생성 시 옵션 추가 가능 (예: offset 등)
        // const markerOption = {offset: new window.kakao.maps.Point(MARKER_WIDTH / 2, MARKER_HEIGHT)};
        const markerOption = {
          offset: new window.kakao.maps.Point(
            MARKER_WIDTH / 2,
            MARKER_HEIGHT / 2
          ),
        };
        return new window.kakao.maps.MarkerImage(url, markerSize, markerOption);
      });
      setMarkerImages(images);
      console.log("Marker images created:", images);
    }
  }, []);

  // 폴리곤, 오버레이, 마커 그리기
  useEffect(() => {
    if (!map || markerImages.length === 0) return;

    // 기존 꺼 지우기
    polygons.forEach((p) => p.setMap(null));
    overlays.forEach((o) => o.setMap(null));
    markers.forEach((m) => m.setMap(null));
    infoWindow?.close();
    const newPolygons = [];
    const newOverlays = [];
    const newMarkers = [];
    const topMarkersInfo = [];

    Promise.all([
      fetch("/seoul_municipalities_geo_simple.geojson").then((res) =>
        res.json()
      ),
      fetch("/seoul_municipalities_geo_center.csv").then(async (res) => {
        const buffer = await res.arrayBuffer();
        return new TextDecoder("euc-kr").decode(buffer);
      }),
    ])
      .then(([geojson, csvText]) => {
        const centerPoints = {};
        const rows = csvText.trim().split("\n").slice(1);
        rows.forEach((row) => {
          const columns = row.trim().split(",");
          if (columns.length < 5) return;
          const district = columns[2].trim();
          if (district)
            centerPoints[district] = new window.kakao.maps.LatLng(
              columns[4].trim(),
              columns[3].trim()
            );
        });

        geojson.features.forEach((feature) => {
          const name = feature.properties.SIG_KOR_NM.trim();
          const coordinates = feature.geometry.coordinates[0];
          const path = coordinates.map(
            (coord) => new window.kakao.maps.LatLng(coord[1], coord[0])
          );

          const polygon = new window.kakao.maps.Polygon({
            path: path,
            strokeWeight: 2,
            strokeColor: "#000",
            strokeOpacity: 0.8,
            fillColor: "#fff",
            fillOpacity: 0.7,
          });
          polygon.setMap(map);
          newPolygons.push(polygon);

          window.kakao.maps.event.addListener(polygon, "mouseover", () =>
            polygon.setOptions({ fillColor: "#09f" })
          );
          window.kakao.maps.event.addListener(polygon, "mouseout", () =>
            polygon.setOptions({ fillColor: "#fff" })
          );

          const position = centerPoints[name];
          if (position) {
            const content = `<div class="district-label">${name}</div>`;
            const customOverlay = new window.kakao.maps.CustomOverlay({
              position: position,
              content: content,
              xAnchor: 0.5,
              yAnchor: 0.5,
            });
            customOverlay.setMap(map);
            newOverlays.push(customOverlay);

            const districtEngName = DISTRICT_KOR_TO_ENG[name];
            const rank = topDistricts[districtEngName]; // 1 ~ 5 또는 undefined
            if (rank) {
              // rank 값이 존재하면 Top 5에 해당
              console.log(
                `Adding marker for Rank ${rank}: ${name} (${districtEngName})`
              );
              const markerImageForRank = markerImages[rank - 1];
              if (markerImageForRank) {
                topMarkersInfo.push({
                  position: position,
                  image: markerImageForRank,
                  title: `${name} (${rank}위)`,
                  rank: rank, // 순위 정보 추가 (정렬용)
                  name: name, // 구 이름 (정보창용)
                });
              } else {
                console.warn(`Marker image for rank ${rank} not found.`);
              }
            }
          }
        });
        topMarkersInfo.sort((a, b) => b.rank - a.rank);
        topMarkersInfo.forEach((info) => {
          const marker = new window.kakao.maps.Marker({
            position: info.position,
            image: info.image,
            title: info.title,
            zIndex: 5 + (5 - info.rank),
          });
          marker.setMap(map);
          newMarkers.push(marker);

          window.kakao.maps.event.addListener(marker, "click", () => {
            infoWindow?.close();

            const iwContent = `<div style="padding:5px; font-size:0.9rem;">${info.name} (${info.rank}위)</div>`;
            const newInfoWindow = new window.kakao.maps.InfoWindow({
              content: iwContent,
              position: info.position, // 정보창 위치를 마커 위치로
              removable: true,
            });
            newInfoWindow.open(map, marker);
            setInfoWindow(newInfoWindow);
          });
        });
        setPolygons(newPolygons);
        setOverlays(newOverlays);
        setMarkers(newMarkers);
      })
      .catch((error) => console.error("데이터 처리 중 오류 발생:", error));

    return () => {
      console.log("Cleaning up map objects..."); // 클린업 로그
      newPolygons.forEach((p) => p.setMap(null));
      newOverlays.forEach((o) => o.setMap(null));
      newMarkers.forEach((m) => m.setMap(null));
      infoWindow?.close();
    };
  }, [map, topDistricts, markerImages, infoWindow]);

  // --- 화면 리사이즈 대응 로직 ---
  useEffect(() => {
    if (!map) return;

    // 현재 지도의 중심 좌표 저장
    const center = map.getCenter();

    // 리사이즈 이벤트가 끝나면 지도를 다시 그리고 중심을 맞추는 함수
    const handleResize = () => {
      map.relayout();
      map.setCenter(center); // 리사이즈 후 중심 좌표를 다시 설정
    };

    // 300ms 딜레이로 디바운스 함수 생성
    const debouncedHandleResize = debounce(handleResize, 300);

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener("resize", debouncedHandleResize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거 (메모리 누수 방지)
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [map]); // map 객체가 생성된 후에 이 effect가 실행되도록 함

  return <div id="mini-map" style={{ width: "100%", height: "100%" }}></div>;
};

export default KakaoMiniMap;
