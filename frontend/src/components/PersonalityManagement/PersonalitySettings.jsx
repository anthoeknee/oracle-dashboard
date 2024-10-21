import React, { useState } from "react";

const PersonalitySelector = ({ value, onChange }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const personalityTypes = {
    Introverted: ["Logical", "Emotional"],
    Extroverted: ["Assertive", "Passive"],
    Analytical: ["Objective", "Subjective"],
    Creative: ["Imaginative", "Practical"],
  };

  const [primaryType, subType] = value.split("-");

  return (
    <div className="relative">
      <div
        className="flex space-x-2"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <select
          value={primaryType}
          onChange={(e) =>
            onChange(`${e.target.value}-${subType || "Default"}`)
          }
          className="w-1/2 p-2 bg-gray-700 rounded-l border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        >
          <option value="Default">Select Type</option>
          {Object.keys(personalityTypes).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          value={subType}
          onChange={(e) => onChange(`${primaryType}-${e.target.value}`)}
          disabled={primaryType === "Default"}
          className="w-1/2 p-2 bg-gray-700 rounded-r border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        >
          <option value="Default">Select Subtype</option>
          {personalityTypes[primaryType]?.map((subType) => (
            <option key={subType} value={subType}>
              {subType}
            </option>
          ))}
        </select>
      </div>
      {showTooltip && (
        <div className="absolute z-10 p-2 mt-1 text-sm text-white bg-gray-800 rounded shadow-lg">
          Select the primary personality type first, then the emotional state
        </div>
      )}
    </div>
  );
};

const PersonalitySettings = () => {
  const [selectedModel, setSelectedModel] = useState("default");
  const [selectedPersonality, setSelectedPersonality] =
    useState("Default-Default");
  const [quirks, setQuirks] = useState("");

  const handleApplyQuirks = () => {
    // TODO: Implement quirks application logic
    console.log("Applying quirks:", quirks);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Settings</h3>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="model"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            AI Model
          </label>
          <select
            id="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="default">Default</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="personality"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Personality Type
          </label>
          <PersonalitySelector
            value={selectedPersonality}
            onChange={setSelectedPersonality}
          />
        </div>
        <div>
          <label
            htmlFor="quirks"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Quirks
          </label>
          <div className="flex items-center">
            <input
              type="text"
              id="quirks"
              value={quirks}
              onChange={(e) => setQuirks(e.target.value)}
              placeholder="Enter quirks here..."
              className="flex-grow p-2 bg-gray-700 rounded-l border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <button
              onClick={handleApplyQuirks}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-r border border-blue-600 text-white"
            >
              Apply
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Hint: Add unique behaviors or traits
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalitySettings;
