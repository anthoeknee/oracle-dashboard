import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 p-2 rounded shadow-lg">
        <p className="text-white font-semibold">{`${label}: ${payload[0].value.toFixed(
          2
        )}`}</p>
      </div>
    );
  }
  return null;
};

const getChartConfig = (data) => ({
  data,
  layout: "vertical",
  margin: { top: 5, right: 30, left: 100, bottom: 5 },
  xAxis: {
    type: "number",
    domain: [0, 1],
  },
  yAxis: {
    type: "category",
    dataKey: "name",
    width: 100,
  },
  legend: {
    formatter: (value) => value.charAt(0).toUpperCase() + value.slice(1),
  },
});

const PersonalityCharts = ({ emotions, traits }) => {
  console.log("Emotions in PersonalityCharts:", emotions);
  console.log("Traits in PersonalityCharts:", traits);

  if (!Array.isArray(emotions) || !Array.isArray(traits)) {
    console.error("Invalid data type for emotions or traits");
    return (
      <div className="md:w-2/3 flex flex-col gap-6 overflow-y-auto">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Error</h3>
          <p>There was an error processing the personality data.</p>
          <p>Emotions: {JSON.stringify(emotions)}</p>
          <p>Traits: {JSON.stringify(traits)}</p>
        </div>
      </div>
    );
  }

  if (emotions.length === 0 && traits.length === 0) {
    return (
      <div className="md:w-2/3 flex flex-col gap-6 overflow-y-auto">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">No Data Available</h3>
          <p>There are currently no personality traits or emotions to display.</p>
          <p>Emotions: {JSON.stringify(emotions)}</p>
          <p>Traits: {JSON.stringify(traits)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:w-2/3 flex flex-col gap-6">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Debug Information</h3>
        <p>Emotions count: {emotions.length}</p>
        <p>Traits count: {traits.length}</p>
        <p>Emotions data: {JSON.stringify(emotions)}</p>
        <p>Traits data: {JSON.stringify(traits)}</p>
      </div>
      {traits.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg flex-grow">
          <h3 className="text-xl font-semibold mb-4">Personality Traits</h3>
          <div className="h-full">
            <ResponsiveContainer width="100%" height={traits.length * 40 + 40}>
              <BarChart {...getChartConfig(traits)}>
                <XAxis {...getChartConfig(traits).xAxis} />
                <YAxis {...getChartConfig(traits).yAxis} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend formatter={getChartConfig(traits).legend.formatter} />
                <Bar dataKey="value" fill="#4C51BF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {emotions.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg flex-grow">
          <h3 className="text-xl font-semibold mb-4">Emotions</h3>
          <div className="h-full">
            <ResponsiveContainer width="100%" height={emotions.length * 40 + 40}>
              <BarChart {...getChartConfig(emotions)}>
                <XAxis {...getChartConfig(emotions).xAxis} />
                <YAxis {...getChartConfig(emotions).yAxis} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend formatter={getChartConfig(emotions).legend.formatter} />
                <Bar dataKey="value" fill="#ED8936" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalityCharts;
