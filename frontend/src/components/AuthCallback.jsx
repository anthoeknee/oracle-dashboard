import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");
    
    if (accessToken) {
      localStorage.setItem("jwtToken", accessToken);
      navigate("/dashboard");
    } else {
      console.error("No access token found in URL");
      navigate("/");
    }
  }, [navigate]);

  return <div>Processing authentication...</div>;
};

export default AuthCallback;
