import React from "react";

const PersonalityInfo = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4">About</h3>
      <p className="text-gray-300 mb-4">
        This dashboard displays the current personality traits and emotions of
        the AI assistant. The values are dynamically updated and represent the
        AI's current state.
      </p>
      <p className="text-gray-300 mb-4">
        The charts on the right visualize these traits and emotions, allowing
        for easy monitoring of the AI's personality profile.
      </p>
    </div>
  );
};

export default PersonalityInfo;
