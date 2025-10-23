import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./layouts/Layout";
import Home from "./pages/HomePage/HomePage";
import Login from "./pages/LoginPage/LoginPage";
import LoginCallback from "./pages/LoginPage/LoginCallback";
import Signin from "./pages/SigninPage/SigninPage";
import Places from "./pages/PlacesPage/PlacesPage2";
import Search from "./pages/PlacesPage/PlacesSearchPage2";
import Posting from "./pages/PlacesPage/PostPlacePage2";
import PlaceDetail from "./pages/PlacesPage/PlacesDetail2";
import Courses from "./pages/CoursesPage/CoursesPage";
import CoursesDetail from "./pages/CoursesPage/CoursesDetail";
import MapPage from "./pages/MapPage/MapPage";
import MapHistoryView from "./pages/MapHistoryView/MapHistoryView";
import NotFound from "./pages/NotFoundPage/NotFoundPage";
import MyPage from "./pages/MyPage/MyPage";
import ScrollToTopOnNavigation from "./components/ScrollToTop/ScrollToTopOnNavigation";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTopOnNavigation />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/places" element={<Places />} />
            <Route path="/places/result" element={<Search />} />
            <Route path="/places/:id" element={<PlaceDetail />} />
            <Route path="/places/edit/" element={<Posting />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CoursesDetail />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/view" element={<MapHistoryView />} />
            <Route path="/mypage" element={<MyPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<LoginCallback />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
