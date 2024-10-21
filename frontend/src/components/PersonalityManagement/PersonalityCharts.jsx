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
  margin: { top: 5, right: 30, left: 20, bottom: 5 },
  xAxis: {
    type: "number",
    domain: [0, 1],
    tick: { fill: "#E2E8F0" },
  },
  yAxis: {
    type: "category",
    dataKey: "name",
    width: 100,
    tick: { fill: "#E2E8F0" },
  },
  tooltip: <CustomTooltip />,
  legend: {
    formatter: (value) => <span style={{ color: "#E2E8F0" }}>{value}</span>,
  },
});

const PersonalityCharts = ({ emotions, traits }) => {
  return (
    <div className="md:w-2/3 flex flex-col gap-6 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Personality Traits</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
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

      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Emotions</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
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
    </div>
  );
};

export default PersonalityCharts;
