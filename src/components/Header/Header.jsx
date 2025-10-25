import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import LogoMobile from "../../assets/LogoMobile.png";
import LogoDesktop from "../../assets/LogoDesktop.png";
import { AiOutlineMenu } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { useAuth } from "../../contexts/AuthContext";
import LogoutModal from "../LogoutModal/LogoutModal";

const Header = ({ onMenuClick, onLogoClick }) => {
  const isDesktop = useIsDesktop();
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleProfileClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      setShowLogoutModal(true);
    }
  };

  const handleLogoutConfirm = async () => {
    await logout();
    setShowLogoutModal(false);
    navigate('/');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  // 모바일 버전
  if (!isDesktop) {
    return (
      <div className={styles.header}>
        <Link to="/" onClick={onLogoClick}>
          <img src={LogoMobile} alt="서울식 로고" className={styles.logo} />
        </Link>
        <AiOutlineMenu className={styles.menu} onClick={onMenuClick} />
      </div>
    );
  }

  // 데스크탑 버전
  return (
    <>
      <div className={styles.headerDesktop}>
        <Link to="/" onClick={onLogoClick}>
          <img src={LogoDesktop} alt="서울식 로고" className={styles.logoDesktop} />
        </Link>
        <nav className={styles.nav}>
          <Link to="/map" className={styles.navItem}>
            SS MAP
          </Link>
          <Link to="/courses" className={styles.navItem}>
            SS 관광코스 추천
          </Link>
          <Link to="/places" className={styles.navItem}>
            SS 관광명소 추천
          </Link>
          <Link to="/mypage" className={styles.navItem}>
            마이페이지
          </Link>
          <div 
            className={styles.profileItem} 
            onClick={handleProfileClick}
          >
            <FaRegUserCircle className={styles.profileIcon} />
            <span className={styles.profileText}>
              {isLoading ? (
                '로딩 중...'
              ) : user ? (
                <>
                  <span className={styles.bold}>{user.name}</span> 님
                </>
              ) : (
                '로그인'
              )}
            </span>
          </div>
        </nav>
      </div>
      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  );
};

export default Header;
