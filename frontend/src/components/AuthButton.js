import React from "react";
import { motion } from "framer-motion";
import { PersonIcon, ExitIcon } from "@radix-ui/react-icons";

const AuthButton = ({ isLoggedIn, onAuthClick, isCollapsed }) => {
  const buttonText = isLoggedIn ? "Sign Out" : "Sign In";
  const icon = isLoggedIn ? <ExitIcon /> : <PersonIcon />;

  const handleAuth = () => {
    if (isLoggedIn) {
      // Handle sign out
      onAuthClick();
    } else {
      // Redirect to Discord OAuth login
      window.location.href = "http://localhost:8000/discord/login";
    }
  };

  return (
    <motion.button
      onClick={handleAuth}
      className={`w-full flex items-center justify-center p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 ${
        isCollapsed ? "px-2" : "px-4"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="flex items-center justify-center w-7 h-7">
        {React.cloneElement(icon, { className: "w-5 h-5" })}
      </span>
      {!isCollapsed && (
        <motion.span
          className="ml-2"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2 }}
        >
          {buttonText}
        </motion.span>
      )}
    </motion.button>
  );
};

export default AuthButton;
