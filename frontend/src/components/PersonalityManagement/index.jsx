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
      const response = await axios.get("http://localhost:8000/traits");
      const allPersonalities = response.data;
      setEmotions(allPersonalities.filter((p) => p.type === "emotion"));
      setTraits(allPersonalities.filter((p) => p.type === "trait"));
      setLastUpdate(Date.now());
    } catch (error) {
      console.error("Error fetching traits:", error);
    }
  }, []);

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

    return () => {
      ws.close();
    };
  }, [fetchTraits]);

  return (
    <div className="flex-1 p-8 h-full flex flex-col overflow-hidden bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-6">Personality Management</h2>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 flex flex-col gap-6 overflow-y-auto pr-3">
          <PersonalityInfo />
          <PersonalitySettings />
        </div>

        <PersonalityCharts emotions={emotions} traits={traits} />
      </div>

      <p className="text-sm text-gray-400 mt-4">
        Last updated: {new Date(lastUpdate).toLocaleTimeString()}
      </p>
    </div>
  );
};

export default PersonalityManagement;
