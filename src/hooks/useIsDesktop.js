// src/hooks/useIsDesktop.js
import { useState, useEffect } from "react";

const DESKTOP_MIN_WIDTH = 1024;

export const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= DESKTOP_MIN_WIDTH
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_MIN_WIDTH);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isDesktop;
};
