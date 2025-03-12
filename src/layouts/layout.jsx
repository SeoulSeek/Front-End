import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.css"
import Header from "../components/Header/Header.jsx"

const Layout = () => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
