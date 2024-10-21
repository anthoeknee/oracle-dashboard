import React from "react";
import { Users, MessageSquare, Server, Activity } from "lucide-react";

const MainContent = () => {
  return (
    <div className="flex-1 p-8">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users />} title="Total Users" value="1,234" />
        <StatCard
          icon={<MessageSquare />}
          title="Messages Today"
          value="5,678"
        />
        <StatCard icon={<Server />} title="Servers" value="42" />
        <StatCard icon={<Activity />} title="Uptime" value="99.9%" />
      </div>
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Recent Activity</h3>
        <div className="bg-gray-800 rounded-lg p-4">
          <p>Activity log will go here...</p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 flex items-center">
      <div className="mr-4 text-blue-500">{icon}</div>
      <div>
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default MainContent;
