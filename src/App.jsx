import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Layout from "./layouts/Layout";
import Home from "./pages/HomePage/HomePage";
import Login from "./pages/LoginPage/LoginPage";
import Signin from "./pages/SigninPage/SigninPage";
import Courses from "./pages/CoursesPage/CoursesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
