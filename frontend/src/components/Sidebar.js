import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  BarChartIcon,
  GearIcon,
  QuestionMarkIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import AuthButton from "./AuthButton";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("jwtToken");
      setIsLoggedIn(false);
    }
  };

  const sidebarVariants = {
    expanded: { width: "16rem" },
    collapsed: { width: "4rem" },
  };

  const contentVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 },
  };

  return (
    <motion.div
      className="bg-gray-800 p-4 flex flex-col h-screen relative"
      initial="collapsed"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <motion.h1
        className="text-2xl font-bold mb-8 text-white"
        variants={contentVariants}
        transition={{ duration: 0.3 }}
      >
        Discord Bot
      </motion.h1>
      <nav className="flex-grow">
        <ul className="space-y-2">
          <SidebarItem
            icon={<HomeIcon />}
            text="Dashboard"
            to="/dashboard"
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={<BarChartIcon />}
            text="Analytics"
            to="/analytics"
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={<GearIcon />}
            text="Settings"
            to="/settings"
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={<QuestionMarkIcon />}
            text="Help"
            to="/help"
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={<PersonIcon />}
            text="Personality"
            to="/personality"
            isCollapsed={isCollapsed}
          />
        </ul>
      </nav>
      <motion.div
        className="mt-auto pt-4"
        variants={contentVariants}
        transition={{ duration: 0.3 }}
      >
        <AuthButton
          isLoggedIn={isLoggedIn}
          onAuthClick={handleAuthClick}
          isCollapsed={isCollapsed}
        />
      </motion.div>
    </motion.div>
  );
};

const SidebarItem = ({ icon, text, to, isCollapsed }) => {
  return (
    <li>
      <motion.div
        className="flex items-center space-x-2 p-2 rounded-lg text-white transition-colors duration-200"
        initial={{ backgroundColor: "transparent" }}
        whileHover={{ backgroundColor: "rgba(55, 65, 81, 1)" }}
        animate={{ backgroundColor: "transparent" }}
        transition={{ duration: 0.2 }}
      >
        <Link to={to} className="flex items-center w-full">
          <div className="text-blue-500 flex items-center justify-center w-7 h-7">
            {React.cloneElement(icon, { className: "w-5 h-5" })}
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="ml-2"
              >
                {text}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </motion.div>
    </li>
  );
};

export default Sidebar;
