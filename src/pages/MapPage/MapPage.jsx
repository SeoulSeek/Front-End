import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import styles from "./MapPage.module.css";

const MapPage = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // 카카오맵
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 3,
    };

    // 지도 생성
    mapInstance.current = new window.kakao.maps.Map(mapRef.current, options);
  }, []);

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
        <div ref={mapRef} className={styles.map}></div>
      </div>
    </>
  );
};

export default MapPage;
