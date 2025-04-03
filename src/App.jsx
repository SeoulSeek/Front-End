import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Layout from "./layouts/layout";
import Home from "./pages/HomePage/HomePage";
import Login from "./pages/LoginPage/LoginPage";
import Signin from "./pages/SigninPage/SigninPage";
import Places from "./pages/PlacesPage/PlacesPage";
import Search from "./pages/PlacesPage/PlacesSearchPage";
import Posting from "./pages/PlacesPage/PostPlacePage";
import PlaceDetail from "./pages/PlacesPage/PlacesDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/places" element={<Places />} />
          <Route path="/places/result" element={<Search />} />
          <Route path="/post" element={<Posting />} />
          <Route path="/places/:id" element={<PlaceDetail />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
