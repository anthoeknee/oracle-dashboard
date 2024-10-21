import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import PersonalityManagement from "./PersonalityManagement";

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar />
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/dashboard" element={<MainContent />} />
          <Route path="/personality" element={<PersonalityManagement />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
