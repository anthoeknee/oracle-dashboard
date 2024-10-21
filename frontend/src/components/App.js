import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import PersonalityManagement from "./PersonalityManagement";
import AuthCallback from "./AuthCallback";
import LandingPage from "./LandingPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <div className="flex h-screen bg-gray-900 text-white">
        {isAuthenticated && <Sidebar />}
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />
            }
          />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <MainContent /> : <Navigate to="/" />}
          />
          <Route
            path="/personality"
            element={
              isAuthenticated ? <PersonalityManagement /> : <Navigate to="/" />
            }
          />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
