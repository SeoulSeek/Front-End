import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Layout from "./layouts/layout";
import Home from "./pages/HomePage/HomePage";
import Login from "./pages/LoginPage/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
