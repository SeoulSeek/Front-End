import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Layout from "./layouts/Layout";
import Home from "./pages/HomePage/HomePage";
import Login from "./pages/LoginPage/LoginPage";
import Signin from "./pages/SigninPage/SigninPage";
import Places from "./pages/PlacesPage/PlacesPage";
import Search from "./pages/PlacesPage/PlacesSearchPage";
import Posting from "./pages/PlacesPage/PostPlacePage";
import PlaceDetail from "./pages/PlacesPage/PlacesDetail";
import Courses from "./pages/CoursesPage/CoursesPage";
import CoursesDetail from "./pages/CoursesPage/CoursesDetail";
import MapHistoryView from "./pages/MapHistoryView/MapHistoryView";
import NotFound from "./pages/NotFoundPage/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/places" element={<Places />} />
          <Route path="/places/result" element={<Search />} />
          <Route path="/places/:id" element={<PlaceDetail />} />
          <Route path="/places/edit/" element={<Posting />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CoursesDetail />} />
          <Route path="/view" element={<MapHistoryView />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
