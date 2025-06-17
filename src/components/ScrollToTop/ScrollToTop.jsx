import React, { useEffect, useRef, useState } from "react";
import { AiFillUpCircle } from "react-icons/ai";

const ScrollToTopBtn = () => {
  const [visible, setVisible] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(20);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const footerEl = document.getElementById("footer");
      const windowHeight = window.innerHeight;

      setVisible(scrollY > 20);

      if (footerEl) {
        const footerTop = footerEl.getBoundingClientRect().top;

        if (footerTop < windowHeight) {
          const overlap = windowHeight - footerTop;
          setBottomOffset(overlap + 20);
        } else {
          setBottomOffset(20);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <button
        onClick={scrollToTop}
        style={{
          display: visible ? "block" : "none",
          position: "fixed",
          right: "3%",
          bottom: `${bottomOffset}px`,
          zIndex: 999,
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <AiFillUpCircle size={50} />
      </button>
    </>
  );
};

export default ScrollToTopBtn;
