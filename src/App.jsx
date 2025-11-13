import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom"; // 1. Import Routes and Route
import Navbar from "./components/Navbar";
import Home from "./components/Home"; // 2. Import Home
import Dashboard from "./components/Dashboard"; // 3. Import Dashboard

function App() {
  // All your theme state logic remains unchanged
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-background text-textPrimary transition-colors duration-500">
      {/* Navbar is outside the Routes, so it stays on every page */}
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* 4. Define your routes */}
      <Routes>
        {/* Route for the homepage ("/") */}
        <Route path="/" element={<Home />} />
        
        {/* Route for the dashboard page ("/dashboard") */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;