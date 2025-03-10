import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import "./App.css";
import { Home } from "./pages/HomePage/HomePage";
import { Login } from "./pages/LoginPage/LoginPage";

function App() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
