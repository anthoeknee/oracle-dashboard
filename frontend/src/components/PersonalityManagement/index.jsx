import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PersonalityCharts from "./PersonalityCharts";
import PersonalitySettings from "./PersonalitySettings";
import PersonalityInfo from "./PersonalityInfo";

const PersonalityManagement = () => {
  const [emotions, setEmotions] = useState([]);
  const [traits, setTraits] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const fetchTraits = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      console.log("Token from localStorage:", token);
      if (!token) {
        console.log("No authentication token found. Redirecting to login...");
        // Redirect to login page or show a login modal
        return;
      }
      console.log("Making request to /personality/traits");
      const response = await axios.get("http://localhost:8000/personality/traits", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const traits = response.data;
      console.log("Raw traits data:", traits);
      const newEmotions = traits.filter((p) => p.type.toLowerCase() === "emotion");
      const newTraits = traits.filter((p) => p.type.toLowerCase() === "trait");
      
      console.log("Filtered emotions:", newEmotions);
      console.log("Filtered traits:", newTraits);
      
      setEmotions(newEmotions);
      setTraits(newTraits);
      setLastUpdate(Date.now());
      
      console.log("Fetched traits:", traits);
      console.log("New Emotions:", newEmotions);
      console.log("New Traits:", newTraits);
    } catch (error) {
      console.error("Error fetching traits:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      if (error.response && error.response.status === 403) {
        console.log("Forbidden. Token might be invalid or expired.");
        // Consider implementing a token refresh mechanism here
      }
    }
  }, []); // Empty dependency array as we don't need any external variables

  useEffect(() => {
    fetchTraits();

    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      if (event.data === "traitsUpdated") {
        console.log("Traits updated, fetching new data");
        fetchTraits();
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, [fetchTraits]); // Add fetchTraits to the dependency array

  return (
    <div className="flex-1 p-8 h-full flex flex-col bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-6">Personality Management</h2>

      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        <div className="md:w-1/3 flex flex-col gap-6 overflow-y-auto pr-3">
          <PersonalityInfo />
          <PersonalitySettings />
        </div>

        <PersonalityCharts emotions={emotions} traits={traits} />
      </div>

      <p className="text-sm text-gray-400 mt-4">
        Last updated: {new Date(lastUpdate).toLocaleString()}
      </p>
    </div>
  );
};

export default PersonalityManagement;
