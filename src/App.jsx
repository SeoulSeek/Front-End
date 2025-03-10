import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Home from "./pages/HomePage/HomePage";
import Login from "./pages/LoginPage/LoginPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
