import React, { useEffect, useState } from "react";

// Custom Overlay를 위한 스타일
const overlayStyle = `
  .district-label {
    background-color: rgba(255, 255, 255, 0.3);
    padding: 3px 7px;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    white-space: nowrap;
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

const KakaoMiniMap = () => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = overlayStyle;
    document.head.appendChild(styleTag);

    // ... (지도 초기화 로직은 동일)
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById("mini-map");
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
          level: 9,
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

  useEffect(() => {
    if (!map) return;

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
          }
        });
      })
      .catch((error) => console.error("데이터 처리 중 오류 발생:", error));
  }, [map]);

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
