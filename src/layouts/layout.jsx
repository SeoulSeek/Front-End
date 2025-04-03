import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
import Header from "../components/Header/Header.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import Footer from "../components/Footer/Footer.jsx";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={styles.container}>
      <Header onMenuClick={handleMenuClick} onLogoClick={handleCloseSidebar} />
      <main className={styles.main}>
        <Outlet />
      </main>
      {isSidebarOpen && <Sidebar onClose={handleCloseSidebar} />}
      <Footer />
    </div>
  );
};

export default Layout;
