import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import PersonalityManagement from "./PersonalityManagement";
import AuthCallback from "./AuthCallback";

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar />
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/dashboard" element={<MainContent />} />
          <Route path="/personality" element={<PersonalityManagement />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
