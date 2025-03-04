/*
root-layout 예시입니다

import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

const RootLayout = () => {
  return (
    <>
      <GlobalStyle/>
      <NavLayout>
        <Navbar/>
      </NavLayout>
      <MainLayout>
        <Sidebar/>
        <Content>
          <Outlet/> 
        </Content>
      </MainLayout>
    </>
  );
};

export default RootLayout;
*/